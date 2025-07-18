import { initializeApp } from 'firebase/app';
import { Platform } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {
  initializeAuth,
  getReactNativePersistence,
  indexedDBLocalPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


console.log("--- DEBUG: 1. Iniciando firebaseConfig.js ---");

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_measurementId
};

try {
  const app = initializeApp(firebaseConfig);
  console.log("--- DEBUG: 2. Firebase App inicializado com sucesso. ---");

  const auth = initializeAuth(app, {
    persistence: Platform.OS === 'web'
      ? indexedDBLocalPersistence
      : getReactNativePersistence(ReactNativeAsyncStorage),
  });
  console.log("--- DEBUG: 3. Firebase Auth inicializado com sucesso. ---");

  const db = getFirestore(app);
  console.log("--- DEBUG: 4. Firestore inicializado com sucesso. ---");

  // Exporta as instâncias
  module.exports = { auth, db };
  console.log("--- DEBUG: 5. Configurações exportadas com sucesso. ---");

} catch (error) {
  console.error("--- DEBUG: ERRO FATAL no firebaseConfig.js ---", error);
}