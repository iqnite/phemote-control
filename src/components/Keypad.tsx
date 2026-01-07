import React, { useEffect, useState, useRef } from "react";
import { IonAvatar, IonButton, IonChip, IonLabel } from "@ionic/react";
import styles from "./Keypad.module.css";
import { startSynth, stopSynth } from "../lib/phonesynth";
import { getPlatforms } from "@ionic/react";

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

    const platforms = getPlatforms();
    console.log(platforms);

    return (
        <div className={styles.bottomContainer}>
            <IonChip disabled={true} style={{ transform: "scale(5)", position: "fixed", top: "50%", left: "50%", display: inputDisplay === "037" ? "block" : "none" }}>
                <IonAvatar>
                    <img alt="LEO" src="/037.jpeg" />
                </IonAvatar>
                <IonLabel style={{ transform: 'rotate(180deg)' }}>037</IonLabel>
            </IonChip>
            <p
                className={styles.inputDisplay}
                onClick={() => setInputDisplay("")}
                style={inputDisplay === "037" ? { transform: 'rotate(180deg)' } : {}}
            >
                {inputDisplay}
            </p>
            <div className={styles.keypadContainer}>
                {keys.map((key) => {
                    function activateKeypad() {
                        setTimeout(() => startSynth(key), 0);
                        const newDisplay = (inputDisplay + key);
                        setInputDisplay(newDisplay.slice(-maxDigits));

                        if (newDisplay.startsWith("#") && newDisplay.endsWith("#") && newDisplay.split("*").length === 4 && newDisplay.split("#").length === 4) {
                            const ip = newDisplay.slice(1, newDisplay.length - 1).replaceAll("*", ".").replaceAll("#", ":");
                            setTargetIp(ip);
                            console.log(ip);
                            setInputDisplay("");
                        }

                        fetch("http://" + targetIp, {
                            method: "POST",
                            body: JSON.stringify({ action: isFinite(+key) ? +key : key })
                        }).then(() => {
                            console.log("Sent successfully");
                        });
                    }

                    const button = <IonButton
                        key={key}
                        size="large"
                        color={isFinite(+key) ? "light" : "medium"}
                        className={styles.key}
                        {...platforms.includes("desktop") ? ({
                            onMouseDown: activateKeypad,
                            onMouseUp: stopSynth
                        }) : {}}
                        onTouchStart={activateKeypad}
                        onTouchEnd={stopSynth}
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
