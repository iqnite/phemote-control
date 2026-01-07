import React, { useEffect, useState, useRef } from "react";
import { IonAvatar, IonButton, IonChip, IonLabel } from "@ionic/react";
import styles from "./Keypad.module.css";
import { startSynth, stopSynth } from "../lib/phonesynth";

const Keypad: React.FC = () => {
    const maxDigits = 20;
    //const buttonRef = useRef<HTMLIonButtonElement>(null);
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
    const [targetIp, setTargetIp] = useState("127.0.0.1:5050");

    // useEffect(() => {
    //   keys.forEach((key) => {
    //     let soundName = key.replace("*", "asterisk").replace("#", "hash");

    //     const sound = new Audio(`/keypad_sfx/${soundName}.mp3`);
    //     sound.load();
    //     sound.loop = false;
    //     setAudio((prevAudio) => [...prevAudio, { key: key, sound: sound }]);
    //   });
    // }, [keys]);

    useEffect(() => {
        if (inputDisplay.includes("*037#")) {
            setInputDisplay("037");
        }
    })

    return (
        <div className={styles.bottomContainer}>
        <IonChip disabled={true} style={{transform: "scale(5)" }}>
                <IonAvatar>
                    <img alt="LEO" src="/037.jpeg" />
                </IonAvatar>
                <IonLabel style={{ transform: 'rotate(180deg)' }}>037</IonLabel>
            </IonChip>
            <p
                className={styles.inputDisplay}
                onTouchStart={()=>setInputDisplay("")}
                style={inputDisplay === "037" ? { transform: 'rotate(180deg)' } : {}}
            >
                {inputDisplay}
            </p>
            <div className={styles.keypadContainer}>
                {keys.map((key) => {
                    function activateKeypad(touchCount: number) {
                        if (touchCount > 1) { return; }
                        setTimeout(() => startSynth(key), 0);
                        const newDisplay = (inputDisplay + key);
                        setInputDisplay(newDisplay.slice(-maxDigits));

                        if (newDisplay.startsWith("#") && newDisplay.endsWith("#") && newDisplay.split("*").length === 4 && newDisplay.split("#").length === 4) {
                          const ip = newDisplay.slice(1, newDisplay.length - 1).replaceAll("*", ".").replaceAll("#", ":");
                          setTargetIp(ip);
                          console.log(ip);
                          setInputDisplay("");
                        }
                    }

                    function stopAudioTrack() {
                        const keySound = audio.find(
                            (item) => item.key === key
                        );
                        if (keySound && !keySound.sound.paused) {
                            keySound.sound.volume = 0;
                        }
                    }

                    const button = <IonButton
                        key={key}
                        size="large"
                        color="light"
                        className={styles.key + (isFinite(+key) ? " " + styles.numberKey : "")}

                        //onMouseDown={e => activateKeypad(e, "")}
                        //onKeyDown={e => activateKeypad(e, e.repeat ? "ignore" : e.key)}
                        //onMouseUp={stopAudioTrack}
                        onTouchStart={e => activateKeypad(e.touches.length)}
                        onTouchCancel={stopSynth}
                        onTouchEnd={() => setTimeout(stopSynth, 50)}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {key}
                    </IonButton>;

                    // window.addEventListener("keydown", (e) => {
                    //   if ((e.key === key) && buttonRef.current && !e.repeat) {
                    //     setTimeout(()=>activateKeypad(e, ""), 0);
                    //   }
                    // });

                    return button;
                })}
            </div>
            <span className={styles.ipAddress}>{targetIp}</span>
        </div>
    );
};

export default Keypad;
