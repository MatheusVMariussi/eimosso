import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

export function useChatMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const messagesRef = collection(db, 'conversas', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  return { messages, loading };
}