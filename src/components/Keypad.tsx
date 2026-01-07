import React from 'react';
import { IonButton } from '@ionic/react';
import styles from './Keypad.module.css';

interface ContainerProps { }

const Keypad: React.FC<ContainerProps> = () => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']
  return (
    <div className={styles.container}>
      {keys.map(key => (
        <IonButton key={key} color={'light'} size='large' className={styles.key}>{key}</IonButton>
      ))}
    </div>
  );
};

export default Keypad;
