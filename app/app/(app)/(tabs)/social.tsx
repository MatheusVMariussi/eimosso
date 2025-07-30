import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useConversations, Conversation } from '../../../hooks/useConversations'; // Importando o hook e o tipo

const ConversationItem = ({ item }: { item: Conversation }) => (
  <Link href={`/chat/${item.id}`} asChild>
    <TouchableOpacity style={styles.chatItem}>
      <Text style={styles.chatName}>{item.barName}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
    </TouchableOpacity>
  </Link>
);

export default function SocialScreen() {
  const { conversations, loading } = useConversations();

  if (loading) {
    return <ActivityIndicator style={styles.container} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ConversationItem item={item} />}
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