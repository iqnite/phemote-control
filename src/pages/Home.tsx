import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Keypad from '../components/Keypad';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Keypad />
      </IonContent>
    </IonPage>
  );
};

export default Home;
