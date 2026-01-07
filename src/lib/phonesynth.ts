let audioCtx: AudioContext | null = null;
let osc1: OscillatorNode | null = null;
let osc2: OscillatorNode | null = null;

const orderedKeys = [
    "1", "2", "3", "A",
    "4", "5", "6", "B",
    "7", "8", "9", "C",
    "*", "0", "#", "D"
];
const horizontalFrequencies = [
    1209, 1336, 1477, 1633
];
const verticalFrequencies = [
    697, 770, 852, 941
];

function setupAudioContext() {
    audioCtx = new AudioContext({
        sampleRate: 24000
    });
    osc1 = audioCtx.createOscillator();
    osc1.connect(audioCtx.destination);
    osc2 = audioCtx.createOscillator();
    osc2.connect(audioCtx.destination);
}
export function startSynth(key: string) {
    // expects to be called after a user interaction
    // due to react stupidity, you may need to queue a macro task.
    if (!audioCtx) {
        setupAudioContext();
    }

    const index = orderedKeys.indexOf(key.toUpperCase());
    const f1 = horizontalFrequencies[index % 4];
    const f2 = horizontalFrequencies[Math.floor(index / 4)];
    if (osc1) {
        osc1.frequency.setValueAtTime(f1, 0);
        osc1.type = "triangle";
        osc1.start(0);
    }
    if (osc2) {
        osc2.frequency.setValueAtTime(f2, 0);
        osc2.type = "triangle";
        osc2.start(0);
    }
}
export function stopSynth() {
    osc1?.stop();
    osc2?.stop();
}