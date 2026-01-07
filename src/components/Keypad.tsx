import React, { useEffect, useState, useRef } from "react";
import { IonButton } from "@ionic/react";
import styles from "./Keypad.module.css";
import { startSynth, stopSynth } from "../lib/phonesynth";

const Keypad: React.FC = () => {
  const maxDigits = 20;
  const buttonRef = useRef<HTMLIonButtonElement>(null);
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

  // useEffect(() => {
  //   keys.forEach((key) => {
  //     let soundName = key.replace("*", "asterisk").replace("#", "hash");

  //     const sound = new Audio(`/keypad_sfx/${soundName}.mp3`);
  //     sound.load();
  //     sound.loop = false;
  //     setAudio((prevAudio) => [...prevAudio, { key: key, sound: sound }]);
  //   });
  // }, [keys]);

  return (
    <div className={styles.bottomContainer}>
      <p className={styles.inputDisplay} onMouseDown={() => setInputDisplay("")}>
        {inputDisplay}
      </p>
      <div className={styles.keypadContainer}>
        {keys.map((key) => {
          function activateKeypad(touchCount: number) {
            if (touchCount > 1) { return; }
            setTimeout(()=>startSynth(key), 0);
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

          const button = <IonButton
            ref={buttonRef}
            key={key}
            size="large"
            color="light"
            className={styles.key + (isFinite(+key) ? " " + styles.numberKey : "")}

            //onMouseDown={e => activateKeypad(e, "")}
            //onKeyDown={e => activateKeypad(e, e.repeat ? "ignore" : e.key)}
            //onMouseUp={stopAudioTrack}
            onTouchStart={e => activateKeypad(e.touches.length)}
            onTouchCancel={stopSynth}
            onTouchEnd={()=>setTimeout(stopSynth, 50)}
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
    </div>
  );
};

export default Keypad;
