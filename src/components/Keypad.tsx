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
            let soundName;
            if (key === "*") soundName = "asterisk";
            else if (key === "#") soundName = "hash";
            else soundName = key;
            const sound = new Audio(`/keypad_sfx/${soundName}.mp3`);
            sound.loop = true;
            setAudio((prevAudio) => [...prevAudio, { key: key, sound: sound }]);
        });
    }, [keys]);

    return (
        <div className={styles.bottomContainer}>
            <p className={styles.inputDisplay}>{inputDisplay}</p>
            <div className={styles.keypadContainer}>
                {keys.map((key) => (
                    <IonButton
                        key={key}
                        color="light"
                        size="large"
                        className={styles.key}
                        onClick={() => {
                            setInputDisplay((inputDisplay + key).slice(-maxDigits));
                        }}
                        onTouchStart={() => {
                            const keySound = audio.find(
                                (item) => item.key === key
                            );
                            if (keySound) {
                                keySound.sound.currentTime = 0;
                                setTimeout(() => {
                                    keySound.sound.play();
                                }, 50);
                            }
                            console.log("Touch start on key:", key);
                        }}
                        onTouchEnd={() => {
                            const keySound = audio.find(
                                (item) => item.key === key
                            );
                            if (keySound) {
                                keySound.sound.pause();
                                keySound.sound.currentTime = 0;
                            }
                        }}
                    >
                        {key}
                    </IonButton>
                ))}
            </div>
        </div>
    );
};

export default Keypad;
