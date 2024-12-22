const BUTTON_IDS = {
  LOOP_TOGGLE: 'loopToggle',
  DISABLE_LOOP: 'disableLoop',
  SKIP_TRACK: 'skipTrack',
  SHOW_QUEUE: 'showQueue',
  CLEAR_QUEUE: 'clearQueue',
  STOP_TRACK: 'stopTrack',
  PLAY_PAUSE: 'playPause',
  VOLUME_UP: 'volumeUp',
  VOLUME_DOWN: 'volumeDown'
};

const MESSAGES = {
  VOLUME_MAX: '🔊 **Volume is already at maximum!**',
  VOLUME_MIN: '🔉 **Volume is already at minimum!**',
  VOLUME_CHANGE: (volume) => `🔊 **Volume changed to ${volume}%!**`,
  LOOP_TRACK: '🔁 **Track loop is activated!**',
  LOOP_QUEUE: '🔁 **Queue loop is activated!**',
  LOOP_DISABLED: '❌ **Loop is disabled!**',
  QUEUE_EMPTY: 'The queue is empty.',
  QUEUE_CLEARED: '🗑️ **Queue has been cleared!**',
  PLAYBACK_STOPPED: '⏹️ **Playback has been stopped and player destroyed!**',
  NEXT_SONG: '⏭️ **Player will play the next song!**',
  WRONG_CHANNEL: '🔒 **You need to be in the same voice channel to use the controls!**'
};

module.exports = { BUTTON_IDS, MESSAGES };