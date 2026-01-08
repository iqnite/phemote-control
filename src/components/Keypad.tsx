import React, { useEffect, useState } from "react";
import { IonAvatar, IonButton, IonCard, IonCardContent, IonChip, IonLabel, getPlatforms, } from "@ionic/react";
import styles from "./Keypad.module.css";
import { startSynth, stopSynth } from "../lib/phonesynth";

const MAX_DIGITS = 20;
const KEYS = [
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
]

const Keypad: React.FC = () => {
    const [currentValue, setCurrentValue] = useState("0".repeat(MAX_DIGITS));
    const [targetIp, setTargetIp] = useState("127.0.0.1:5050");
    const [leoMode, setLeoMode] = useState(false);

    // Check if the user has entered a secret code
    useEffect(() => {
        const match = /^[^#]*?(\*\d+?#)/.exec(currentValue)?.[1];
        if (match) {
            setCurrentValue("0".repeat(MAX_DIGITS));
            const secretCode = match.slice(1, match.length - 1);

            switch (secretCode) {
                case "037":
                    setLeoMode(true);
                    break;
            
                default:
                    // send other custom compound codes to the server
                    fetch("http://" + targetIp, {
                        method: "POST",
                        body: JSON.stringify({ action: "code:"+secretCode }),
                    });
                    break;
            }
        }
    }, [currentValue]);

    // Check if user has entered an IP change code
    // Format: #X*X*X*X#PPPP# -> X.X.X.X:PPPP
    useEffect(() => {
        const match = /#\d+?.\d+?.\d+?.\d+?#\d+#/.exec(currentValue);
        if (match) {
            const pattern = match[0].slice(1, match[0].length - 1);
            const ip = pattern.split('*').map(x => x.split("#")).flat();
            const ipStr = `${ip[0]}.${ip[1]}.${ip[2]}.${ip[3]}:${ip[4]}`
            setTargetIp(ipStr);
            console.log(ipStr);
            setCurrentValue("0".repeat(MAX_DIGITS));
        }
    }, [currentValue])

    // When leaving App, stop sounds
    window.addEventListener("blur", stopSynth);

    function activateKeypad(key: string) {
        startSynth(key);
        const newDisplay = currentValue + key;
        setCurrentValue(newDisplay.slice(-MAX_DIGITS));

        if (!newDisplay.includes("*") && !newDisplay.includes("#")) {
            // do not send packets if user is building a compound code (eg: *037#)
            fetch("http://" + targetIp, {
                method: "POST",
                body: JSON.stringify({ action: key }),
            });
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.keypadContainer}>
                {leoMode ? (
                    <IonChip onClick={() => setLeoMode(false)} style={{ gridSpan: "2" }}>
                        <IonAvatar>
                            <img alt="LEO" src="/037.jpeg" />
                        </IonAvatar>
                        <IonLabel style={{ transform: "rotate(180deg)" }}>037</IonLabel>
                    </IonChip>
                ) : (
                    <IonCard
                        // className={styles.inputDisplay}
                        style={{ width: "fit-content", margin: "10px auto" }}
                        onClick={() => setCurrentValue("0".repeat(MAX_DIGITS))}
                        button={true}
                    >
                        <IonCardContent>{currentValue}</IonCardContent>
                    </IonCard>
                )}
                <div className={styles.keypad}>
                    {KEYS.map((key) =>
                        <IonButton
                            key={key}
                            size="large"
                            color={Number.isFinite(+key) ? "light" : "medium"}
                            className={styles.key}
                            {...(getPlatforms().includes("desktop")
                                ? {
                                    onMouseDown: () => activateKeypad(key),
                                    onMouseUp: stopSynth,
                                }
                                : {})}
                            onTouchStart={() => activateKeypad(key)}
                            onTouchEnd={stopSynth}
                        >
                            {key}
                        </IonButton>
                    )}
                </div>
            </div>
            <span className={styles.ipAddress}>{targetIp}</span>
        </div>
    );
};

export default Keypad;
