import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { doc, collection, onSnapshot, addDoc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';

export default function ChatScreen() {
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  // Busca as mensagens em tempo real
  useEffect(() => {
    if (!conversationId) return;

    const messagesRef = collection(db, 'conversas', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc')); // Ordena as mensagens pela mais antiga

    // onSnapshot "ouve" as mudanças na coleção em tempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe(); // Limpa o ouvinte
  }, [conversationId]);

  // Função para enviar uma nova mensagem
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !user) return;

    const messagesRef = collection(db, 'conversas', conversationId, 'messages');
    await addDoc(messagesRef, {
      text: newMessage,
      senderId: user.uid,
      timestamp: serverTimestamp(), // Usa o timestamp do servidor para consistência
    });

    // Atualiza a "última mensagem" na conversa principal para a lista
    const conversationDocRef = doc(db, 'conversas', conversationId);
    await updateDoc(conversationDocRef, {
      lastMessage: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage(''); // Limpa o campo de texto
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90} // Ajuste este valor conforme necessário
    >
      <Stack.Screen options={{ title: "Chat com o Bar" }} />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.senderId === user.uid ? styles.myMessage : styles.theirMessage
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Estilos para a tela de chat
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    messageBubble: { padding: 12, borderRadius: 18, marginVertical: 4, marginHorizontal: 8, maxWidth: '80%' },
    myMessage: { backgroundColor: '#007BFF', alignSelf: 'flex-end' },
    theirMessage: { backgroundColor: '#E5E5EA', alignSelf: 'flex-start' },
    messageText: { fontSize: 16, color: '#000' },
    inputContainer: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: '#eee' },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
    sendButton: { marginLeft: 8, justifyContent: 'center', paddingHorizontal: 12 },
    sendButtonText: { color: '#007BFF', fontWeight: 'bold', fontSize: 16 },
});