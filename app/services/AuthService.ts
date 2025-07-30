import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  Auth,
  UserCredential
} from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Nossa instância do Firebase Auth

// Tipo para o retorno das nossas funções, facilitando o tratamento de sucesso/erro
type AuthResult = {
  success: boolean;
  error?: string;
  userCredential?: UserCredential;
};

/**
 * Tenta registrar um novo usuário com e-mail e senha.
 */
export const signUpUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, userCredential };
  } catch (error: any) {
    // Retorna uma mensagem de erro mais amigável
    return { success: false, error: error.message };
  }
};

/**
 * Tenta autenticar um usuário com e-mail e senha.
 */
export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, userCredential };
  } catch (error: any) {
    return { success: false, error: "E-mail ou senha inválidos." };
  }
};