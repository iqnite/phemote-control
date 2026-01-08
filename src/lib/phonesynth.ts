let audioCtx: AudioContext | null = null;
let osc1: OscillatorNode | null = null;
let osc2: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let reverbNode: ConvolverNode | null = null;

const orderedKeys = [
    "1", "2", "3", "A",
    "4", "5", "6", "B",
    "7", "8", "9", "C",
    "*", "0", "#", "D"
];
let horizontalFrequencies = [
    1209, 1336, 1477, 1633
];
let verticalFrequencies = [
    697, 770, 852, 941
];

function setupAudioContext() {
    audioCtx = new AudioContext({
        sampleRate: 24000
    });
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, 0);
    gainNode.connect(audioCtx.destination);
    osc1 = audioCtx.createOscillator();
    osc1.connect(gainNode);
    osc1.start(0);
    osc1.type = "sine";
    osc2 = audioCtx.createOscillator();
    osc2.connect(gainNode);
    osc2.start(0);
    osc2.type = "sine";

}
export function startSynth(key: string) {
    // expects to be called after a user interaction
    // due to react stupidity, you may need to queue a macro task.
    if (!audioCtx) {
        setupAudioContext();
    }

    const index = orderedKeys.indexOf(key.toUpperCase());
    const f1 = horizontalFrequencies[index % 4];
    const f2 = verticalFrequencies[Math.floor(index / 4)];
    //console.log("Synth Started");
    if (osc1) {
        osc1.frequency.setValueAtTime(f1, 0);
    }
    if (osc2) {
        osc2.frequency.setValueAtTime(f2, 0);
    }
    gainNode?.gain?.setValueAtTime(1, 0);
}
export function stopSynth() {
    //console.log("Synth Stopped");
    gainNode?.gain?.setValueAtTime(0, 0);
}

export function overrideHorizontalFrequencies(values: number[]) {
    horizontalFrequencies = values;
}

export function overrideVerticalFrequencies(values: number[]) {
    verticalFrequencies = values;
}

export function overrideWaveShape(shape: OscillatorType) {
    if (osc1) {
        console.log("a");
        osc1.type = shape;
    }
    if (osc2) {
        console.log("b");
        osc2.type = shape;
    }
}


export function addGiantReverb() {
    if (reverbNode) {
        return;
    }
    if (!audioCtx || !gainNode) {
        return;
    }
    reverbNode = audioCtx.createConvolver();
    //gainNode.disconnect(audioCtx.destination);
    gainNode.connect(reverbNode);
    reverbNode.connect(audioCtx.destination);

    const impulseBuffer = audioCtx.createBuffer(2, 24000 * 4, 24000);


    for (let c = 0; c < impulseBuffer.numberOfChannels; c++) {
        const impulseData = impulseBuffer.getChannelData(c);
        for (let i = 0; i < impulseData.length; i++) {
            impulseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseData.length, 4);
        }
    }

    reverbNode.buffer = impulseBuffer;
}