import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { Platform } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {
  initializeAuth,
  getReactNativePersistence,
  indexedDBLocalPersistence,
  Auth,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Suas variáveis de ambiente já estão configuradas corretamente com `process.env`
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Evita a reinicialização do app em cada Hot Reload
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

auth = initializeAuth(app, {
  persistence: Platform.OS === 'web'
    ? indexedDBLocalPersistence
    : getReactNativePersistence(ReactNativeAsyncStorage),
});

db = getFirestore(app);

export { auth, db };