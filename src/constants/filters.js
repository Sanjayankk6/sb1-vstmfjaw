// Audio filter presets
exports.FILTER_PRESETS = {
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