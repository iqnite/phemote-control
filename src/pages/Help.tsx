import {
    IonButton,
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import "./Home.css";

const Help: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Phemote Control | Help</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Phemote Help</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <p>
                    Phemote is a system that allows you to control some PC
                    functions remotely using your phone.
                </p>
                <IonList>
                    <li>
                        1. Download and install the Phemote Desktop app:
                        <IonButton
                            href="https://github.com/iqnite/phemote-desktop/releases/latest"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Get Windows App
                        </IonButton>
                    </li>
                    <li>
                        2. Ensure that your phone and PC are connected to the
                        same Wi-Fi network.
                    </li>
                    <li>
                        3. Open the Phemote Desktop app on your PC. An icon will
                        appear in the system tray.
                    </li>
                    <li>
                        4. Click on the system tray icon to reveal your PC's
                        dial code.
                    </li>
                    <li>
                        5. Enter the dial code into the Phemote Control app on
                        your phone to establish a connection.
                    </li>
                    <li>
                        6. Once connected, you can use the keypad to "press" arrow
                        keys and space bar on your PC.
                    </li>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Help;
