import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useChatMessages } from '@/hooks/useChatMessages';
import { sendMessage } from '../../../services/ChatService';

export default function ChatScreen() {
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  
  const { messages } = useChatMessages(conversationId);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = async () => {
    if (!user) return;
    const success = await sendMessage(conversationId, newMessage, user.uid);
    if (success) {
      setNewMessage('');
    } else {
      alert("Não foi possível enviar a mensagem.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen options={{ title: "Chat com o Bar" }} />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.senderId === user?.uid ? styles.myMessage : styles.theirMessage
          ]}>
            <Text style={item.senderId === user?.uid ? styles.myMessageText : styles.theirMessageText}>
              {item.text}
            </Text>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={{ paddingVertical: 10 }}
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    messageBubble: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 18, marginVertical: 4, marginHorizontal: 8, maxWidth: '80%' },
    myMessage: { backgroundColor: '#007BFF', alignSelf: 'flex-end' },
    theirMessage: { backgroundColor: '#fff', alignSelf: 'flex-start' },
    myMessageText: { fontSize: 16, color: '#fff' },
    theirMessageText: { fontSize: 16, color: '#000' },
    inputContainer: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
    input: { flex: 1, backgroundColor: '#f0f2f5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16 },
    sendButton: { marginLeft: 8, justifyContent: 'center', paddingHorizontal: 12 },
    sendButtonText: { color: '#007BFF', fontWeight: 'bold', fontSize: 16 },
});