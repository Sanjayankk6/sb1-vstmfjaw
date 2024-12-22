const { sendEmbed } = require('../utils/messageUtils');
const { FILTER_PRESETS } = require('../constants/filters');

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

module.exports = { handleFilterChange };