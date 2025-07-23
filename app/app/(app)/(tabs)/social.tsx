import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'expo-router';

export default function SocialScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const convRef = collection(db, 'conversas');
    const q = query(convRef, where('userId', '==', user.uid));

    // onSnapshot cria um "ouvinte" que atualiza a lista automaticamente
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const convList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setConversations(convList);
        setLoading(false);
    });

    return () => unsubscribe();
}, [user]);

  if (loading) {
    return <View><Text>Carregando conversas...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Cada item da lista é um link para a tela de chat específica
          <Link href={`/chat/${item.id}`} asChild>
            <TouchableOpacity style={styles.chatItem}>
              <Text style={styles.chatName}>{item.barName}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma conversa iniciada.</Text>}
      />
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  chatName: { fontSize: 16, fontWeight: 'bold' },
  lastMessage: { fontSize: 14, color: 'gray', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray' }
});