import { collection, query, where, doc, updateDoc, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { User } from 'firebase/auth';

// Definimos uma interface para o Bar para garantir a tipagem
interface Bar {
  id: string;
  nome: string;
}

/**
 * Inicia ou encontra uma conversa existente entre um usuário e um bar.
 * @param currentUser O objeto do usuário autenticado.
 * @param bar O objeto do bar com o qual se deseja conversar.
 * @returns O ID da conversa (existente ou nova) ou null em caso de erro.
 */
export const initiateChat = async (currentUser: User, bar: Bar): Promise<string | null> => {
  if (!currentUser || !bar) {
    console.error("Usuário ou bar inválido para iniciar o chat.");
    return null;
  }

  try {
    const conversasRef = collection(db, 'conversas');
    // Query para verificar se já existe uma conversa entre este usuário e este bar
    const q = query(
      conversasRef,
      where("userId", "==", currentUser.uid),
      where("barId", "==", bar.id)
    );
    
    const querySnapshot = await getDocs(q);

    // Se a conversa já existe, retorna o ID dela
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }

    // Se não existe, cria uma nova conversa
    const newConversation = {
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email, // Usa displayName se existir
      barId: bar.id,
      barName: bar.nome,
      lastMessage: "Conversa iniciada...",
      timestamp: serverTimestamp(), // Usa o timestamp do servidor
    };
    
    const docRef = await addDoc(conversasRef, newConversation);
    return docRef.id; // Retorna o ID da nova conversa

  } catch (error) {
    console.error("Erro ao iniciar ou encontrar chat:", error);
    return null; // Retorna nulo em caso de erro
  }
};

/**
 * Envia uma nova mensagem em uma conversa.
 * @param conversationId O ID da conversa.
 * @param messageText O texto da mensagem a ser enviada.
 * @param senderId O UID do remetente.
 * @returns true se a mensagem foi enviada com sucesso, false caso contrário.
 */

export const sendMessage = async (conversationId: string, messageText: string, senderId: string): Promise<boolean> => {
  if (!messageText.trim() || !senderId || !conversationId) {
    return false;
  }

  try {
    // Adiciona a nova mensagem na subcoleção 'messages'
    const messagesRef = collection(db, 'conversas', conversationId, 'messages');
    await addDoc(messagesRef, {
      text: messageText,
      senderId: senderId,
      timestamp: serverTimestamp(),
    });

    // Atualiza a 'lastMessage' e o 'timestamp' do documento principal da conversa
    const conversationDocRef = doc(db, 'conversas', conversationId);
    await updateDoc(conversationDocRef, {
      lastMessage: messageText,
      timestamp: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return false;
  }
};