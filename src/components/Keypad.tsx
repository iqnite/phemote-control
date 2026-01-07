import React, { useEffect, useState } from "react";
import { IonButton } from "@ionic/react";
import styles from "./Keypad.module.css";

const Keypad: React.FC = () => {
    const maxDigits = 20;
    const [keys] = useState<string[]>([
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "*",
        "0",
        "#",
    ]);
    const [audio, setAudio] = useState<
        { key: string; sound: HTMLAudioElement }[]
    >([]);
    const [inputDisplay, setInputDisplay] = useState("");

    useEffect(() => {
        keys.forEach((key) => {
            let soundName = key.replace("*", "asterisk").replace("#", "hash");

            const sound = new Audio(`/keypad_sfx/${soundName}.mp3`);
            sound.load();
            sound.loop = false;
            setAudio((prevAudio) => [...prevAudio, { key: key, sound: sound }]);
        });
    }, [keys]);

    return (
        <div className={styles.bottomContainer}>
            <p className={styles.inputDisplay}>{inputDisplay}</p>
            <div className={styles.keypadContainer}>
                {keys.map((key) => {
                    function activateKeypad(event: any) {
                        const keySound = audio.find(
                            (item) => item.key === key
                        );
                        if (event instanceof TouchEvent) {
                          if (event.touches.length > 0) {return;}
                        }
                        if (keySound) {
                            keySound.sound.volume = 1;
                            keySound.sound.currentTime = 0;
                            setTimeout(()=>keySound.sound.play(), 0);
                        }
                        setInputDisplay((inputDisplay + key).slice(-maxDigits));
                    }

                    function stopAudioTrack() {
                        const keySound = audio.find(
                            (item) => item.key === key
                        );
                        if (keySound && !keySound.sound.paused) {
                            keySound.sound.volume = 0;
                        }
                    }
                    return <IonButton
                        key={key}
                        color="light"
                        size="large"
                        className={styles.key}
                        
                        onMouseDown={activateKeypad}
                        onMouseUp={stopAudioTrack}
                        onTouchStart={activateKeypad}
                        onTouchCancel={stopAudioTrack}
                    >
                        {key}
                    </IonButton>
})}
            </div>
        </div>
    );
};

export default Keypad;
