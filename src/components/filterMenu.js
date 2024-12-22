const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { FILTER_PRESETS } = require('../constants/filters');

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

module.exports = { createFilterMenu };