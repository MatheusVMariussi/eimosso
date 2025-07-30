import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

// Definindo uma interface para o objeto de conversa
export interface Conversation {
  id: string;
  barName: string;
  lastMessage: string;
  timestamp: Timestamp;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const convRef = collection(db, 'conversas');
    // Query para buscar conversas do usuário atual, ordenadas pela mensagem mais recente
    const q = query(
      convRef, 
      where('userId', '==', user.uid), 
      orderBy('timestamp', 'desc')
    );

    // onSnapshot cria um "ouvinte" que atualiza a lista em tempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Conversation[];
      setConversations(convList);
      setLoading(false);
    });

    // Limpa o "ouvinte" quando o hook é desmontado
    return () => unsubscribe();
  }, [user]);

  return { conversations, loading };
}