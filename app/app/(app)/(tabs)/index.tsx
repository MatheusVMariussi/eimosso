import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { BarCard } from '../../../components/BarCard'; // Importa o novo componente

interface Bar {
  id: string;
  nome: string;
  endereco: string;
  bannerUrl?: string;
  horarios?: any;
}

export default function BuscaScreen() {
  const [bares, setBares] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBares = async () => {
      try {
        const baresCollectionRef = collection(db, 'bares');
        const querySnapshot = await getDocs(baresCollectionRef);
        const baresList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Bar[];
        setBares(baresList);
      } catch (error) {
        console.error("Erro ao buscar bares: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBares();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.container} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bares}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BarCard item={item} />} // Usa o componente BarCard
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum bar cadastrado ainda.</Text>}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: 'gray',
  }
});