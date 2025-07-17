// Importa as funções necessárias do SDK do Firebase que você acabou de instalar.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Objeto de configuração do seu projeto Firebase.
// Estes dados são as "chaves" que permitem que seu app se conecte ao seu backend no Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyA-bZTyi6nenuNg4bTpRqCBBKFSDnnKvN0",
  authDomain: "eimosso.firebaseapp.com",
  projectId: "eimosso",
  storageBucket: "eimosso.firebasestorage.app",
  messagingSenderId: "885302787667",
  appId: "1:885302787667:web:7cd619671c5cdd5224d0a6",
  measurementId: "G-9CY19RQ9YR"
};

// Inicializa o app Firebase com as configurações fornecidas.
// Isso estabelece a conexão principal com o seu projeto Firebase.
const app = initializeApp(firebaseConfig);

// Obtém e exporta as instâncias dos serviços que vamos usar.
// É como pegar "atalhos" para a Autenticação e o Banco de Dados.
// Vamos importar esses atalhos em outros arquivos para usar as funcionalidades.
export const auth = getAuth(app);
export const db = getFirestore(app);