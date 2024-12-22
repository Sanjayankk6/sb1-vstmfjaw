const { Riffy } = require("riffy");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { queueNames, requesters } = require("./commands/play");
const { Dynamic } = require("musicard");
const config = require("./config.js");
const fs = require("fs");
const path = require("path");

// Audio filter presets
const FILTER_PRESETS = {
    '8D': {
        rotation: { rotationHz: 0.2 }
    },
    'KARAOKE': {
        karaoke: {
            level: 1.0,
            monoLevel: 1.0,
            filterBand: 220.0,
            filterWidth: 100.0
        }
    },
    'BASSBOOST': {
        equalizer: [
            { band: 0, gain: 0.6 },
            { band: 1, gain: 0.7 },
            { band: 2, gain: 0.8 },
            { band: 3, gain: 0.55 }
        ]
    },
    'NIGHTCORE': {
        timescale: { speed: 1.2, pitch: 1.2, rate: 1 }
    },
    'VAPORWAVE': {
        timescale: { speed: 0.8, pitch: 0.8, rate: 1 }
    }
};

function createFilterMenu(disabled = false) {
    const filterMenu = new StringSelectMenuBuilder()
        .setCustomId('filterSelect')
        .setPlaceholder('Select an audio filter')
        .setDisabled(disabled)
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('No Filter')
                .setDescription('Disable all filters')
                .setValue('NONE'),
            ...Object.keys(FILTER_PRESETS).map(filter => 
                new StringSelectMenuOptionBuilder()
                    .setLabel(filter)
                    .setDescription(`Apply ${filter} filter`)
                    .setValue(filter)
            )
        );

    return new ActionRowBuilder().addComponents(filterMenu);
}

async function handleFilterChange(player, channel, selectedFilter) {
    try {
        if (selectedFilter === 'NONE') {
            await player.clearFilters();
            await sendEmbed(channel, '🔇 **All filters have been disabled!**');
            return;
        }

        const filterSettings = FILTER_PRESETS[selectedFilter];
        await player.setFilters(filterSettings);
        await sendEmbed(channel, `🎵 **${selectedFilter} filter has been applied!**`);
    } catch (error) {
        console.error('Error applying filter:', error);
        await sendEmbed(channel, '❌ **Failed to apply the filter!**');
    }
}

function initializePlayer(client) {
    // ... (keep existing initialization code) ...

    client.riffy.on("trackStart", async (player, track) => {
        const channel = client.channels.cache.get(player.textChannel);
        const trackUri = track.info.uri;
        const requester = requesters.get(trackUri);

        try {
            const musicard = await Dynamic({
                thumbnailImage: track.info.thumbnail || 'https://example.com/default_thumbnail.png',
                backgroundColor: '#070707',
                progress: 10,
                progressColor: '#FF7A00',
                progressBarColor: '#5F2D00',
                name: track.info.title,
                nameColor: '#FF7A00',
                author: track.info.author || 'Unknown Artist',
                authorColor: '#696969',
            });

            const cardPath = path.join(__dirname, 'musicard.png');
            fs.writeFileSync(cardPath, musicard);

            const attachment = new AttachmentBuilder(cardPath, { name: 'musicard.png' });
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: 'Now Playing',
                    iconURL: 'https://cdn.discordapp.com/emojis/838704777436200981.gif'
                })
                .setDescription('🎶 **Controls:**\n 🔁 `Loop`, ❌ `Disable`, ⏭️ `Skip`, 📜 `Queue`, 🗑️ `Clear`\n ⏹️ `Stop`, ⏯️ `Play/Pause`, 🔊 `Vol +`, 🔉 `Vol -`')
                .setImage('attachment://musicard.png')
                .setColor('#FF7A00');

            const actionRow1 = createActionRow1(false);
            const actionRow2 = createActionRow2(false, player.paused);
            const filterRow = createFilterMenu(false);

            const message = await channel.send({
                embeds: [embed],
                files: [attachment],
                components: [actionRow1, actionRow2, filterRow]
            });
            currentTrackMessageId = message.id;

            if (collector) collector.stop();
            collector = setupCollector(client, player, channel, message);

        } catch (error) {
            console.error("Error creating or sending music card:", error.message);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription("⚠️ **Unable to load track card. Continuing playback...**");
            await channel.send({ embeds: [errorEmbed] });
        }
    });

    // ... (keep other event handlers) ...
}

function setupCollector(client, player, channel, message) {
    const filter = i => [
        'loopToggle', 'skipTrack', 'disableLoop', 'showQueue', 'clearQueue',
        'stopTrack', 'playPause', 'volumeUp', 'volumeDown', 'filterSelect'
    ].includes(i.customId);

    const collector = message.createMessageComponentCollector({ filter, time: 600000 });

    collector.on('collect', async i => {
        await i.deferUpdate();

        const member = i.member;
        const voiceChannel = member.voice.channel;
        const playerChannel = player.voiceChannel;

        if (!voiceChannel || voiceChannel.id !== playerChannel) {
            const vcEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setDescription('🔒 **You need to be in the same voice channel to use the controls!**');
            const sentMessage = await channel.send({ embeds: [vcEmbed] });
            setTimeout(() => sentMessage.delete().catch(console.error), config.embedTimeout * 1000);
            return;
        }

        if (i.customId === 'filterSelect') {
            await handleFilterChange(player, channel, i.values[0]);
        } else {
            await handleInteraction(i, player, channel, message);
        }
    });

    collector.on('end', () => {
        console.log("Collector stopped.");
    });

    return collector;
}

// ... (keep other existing functions) ...

module.exports = { initializePlayer };