import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy, doc, addDoc, updateDoc, serverTimestamp, Timestamp, DocumentData } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Bar } from './useBarData';

// --- Interfaces para o Chat ---
export interface Conversation extends DocumentData {
  id: string;
  userName: string;
  lastMessage: string;
}

export interface Message extends DocumentData {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

export function useChat(bar: Bar | null) {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState({ conversations: true, messages: false });

  // Efeito para buscar as conversas do bar
  useEffect(() => {
    if (!bar) return;
    setLoading(prev => ({ ...prev, conversations: true }));
    const q = query(collection(db, "conversas"), where("barId", "==", bar.id), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setConversations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation)));
      setLoading(prev => ({ ...prev, conversations: false }));
    });
    return () => unsubscribe();
  }, [bar]);

  // Efeito para buscar as mensagens da conversa selecionada
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }
    setLoading(prev => ({ ...prev, messages: true }));
    const q = query(collection(db, 'conversas', selectedConversation.id, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      setLoading(prev => ({ ...prev, messages: false }));
    });
    return () => unsubscribe();
  }, [selectedConversation]);

  // Função para enviar uma mensagem
  const sendMessage = async (newMessageText: string) => {
    if (!newMessageText.trim() || !selectedConversation || !currentUser) return;
    
    try {
        const messagesRef = collection(db, 'conversas', selectedConversation.id, 'messages');
        await addDoc(messagesRef, {
            text: newMessageText,
            senderId: currentUser.uid,
            timestamp: serverTimestamp(),
        });

        const convDocRef = doc(db, 'conversas', selectedConversation.id);
        await updateDoc(convDocRef, {
            lastMessage: newMessageText,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        alert("Não foi possível enviar a mensagem.");
    }
  };

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    messages,
    loading,
    sendMessage,
  };
}