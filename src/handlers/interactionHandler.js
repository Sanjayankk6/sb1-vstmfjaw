const { MESSAGES } = require('../utils/constants');
const { sendEmbed } = require('../utils/messageUtils');
const { handleFilterChange } = require('./filterHandler');

async function handleInteraction(interaction, player, channel) {
    if (interaction.customId === 'filterSelect') {
        await handleFilterChange(player, channel, interaction.values[0]);
        return;
    }

    switch (interaction.customId) {
        case 'loopToggle':
            player.setLoop(player.loop === "track" ? "queue" : "track");
            await sendEmbed(channel, player.loop === "track" ? MESSAGES.LOOP_TRACK : MESSAGES.LOOP_QUEUE);
            break;

        case 'skipTrack':
            player.stop();
            await sendEmbed(channel, MESSAGES.NEXT_SONG);
            break;

        case 'disableLoop':
            player.setLoop("none");
            await sendEmbed(channel, MESSAGES.LOOP_DISABLED);
            break;

        case 'showQueue':
            showQueue(channel, player.queue);
            break;

        case 'clearQueue':
            player.queue.clear();
            await sendEmbed(channel, MESSAGES.QUEUE_CLEARED);
            break;

        case 'stopTrack':
            player.stop();
            player.destroy();
            await sendEmbed(channel, MESSAGES.PLAYBACK_STOPPED);
            break;

        case 'playPause':
            if (player.paused) {
                player.pause(false);
                await sendEmbed(channel, '▶️ **Playback has been resumed!**');
            } else {
                player.pause(true);
                await sendEmbed(channel, '⏸️ **Playback has been paused!**');
            }
            break;

        case 'volumeUp':
            adjustVolume(player, channel, 10);
            break;

        case 'volumeDown':
            adjustVolume(player, channel, -10);
            break;
    }
}

function adjustVolume(player, channel, amount) {
    const newVolume = Math.min(100, Math.max(10, player.volume + amount));
    if (newVolume === player.volume) {
        sendEmbed(channel, amount > 0 ? MESSAGES.VOLUME_MAX : MESSAGES.VOLUME_MIN);
    } else {
        player.setVolume(newVolume);
        sendEmbed(channel, MESSAGES.VOLUME_CHANGE(newVolume));
    }
}

function showQueue(channel, queue) {
    if (queue.length === 0) {
        sendEmbed(channel, MESSAGES.QUEUE_EMPTY);
        return;
    }

    // Queue display logic here
}

module.exports = { handleInteraction };