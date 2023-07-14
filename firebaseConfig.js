import firebase from '@react-native-firebase/app';
import { logError } from './src/lib/constants';

const firebaseConfig = {
  apiKey: 'AIzaSyDgk_ZLfGXU_wCHoyqF9VHS51FEDiATdzA',
  authDomain: 'dashboard-6ecae.firebaseapp.com',
  projectId: 'dashboard-6ecae',
  storageBucket: 'dashboard-6ecae.appspot.com',
  messagingSenderId: '814351911525',
  appId: '1:814351911525:web:6e6d1c33cb32ccf8f0548c',
  measurementId: 'G-ZMH93WSLGY',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig).catch(e => logError(e));
}
