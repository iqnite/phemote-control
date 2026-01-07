import React from "react";
import { IonButton } from "@ionic/react";
import styles from "./Keypad.module.css";

const Keypad: React.FC = () => {
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
    return (
        <div className={styles.bottomContainer}>
            <div className={styles.keypadContainer}>
                {keys.map((key) => (
                    <IonButton
                        key={key}
                        color={"light"}
                        size="large"
                        className={styles.key}
                        onClick={() => {
                            let soundName;
                            if (key === "*") soundName = "asterisk";
                            else if (key === "#") soundName = "hash";
                            else soundName = key;
                            const sound = new Audio(
                                `/keypad_sfx/${soundName}.mp3`
                            );
                            sound.play();
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
