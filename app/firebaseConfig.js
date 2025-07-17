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
  apiKey: "AIzaSyA-bZTyi6nenuNg4bTpRqCBBKFSDnnKvN0",
  authDomain: "eimosso.firebaseapp.com",
  projectId: "eimosso",
  storageBucket: "eimosso.firebasestorage.app",
  messagingSenderId: "885302787667",
  appId: "1:885302787667:web:7cd619671c5cdd5224d0a6",
  measurementId: "G-9CY19RQ9YR"
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