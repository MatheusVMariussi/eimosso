import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// Importamos as funções 'doc' e 'getDoc' para buscar um documento específico
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // Caminho para nossa config

// O mesmo tipo que usamos na lista
interface Bar {
  id: string;
  nome: string;
  endereco: string;
}

export default function BarDetailsScreen() {
  // useLocalSearchParams é um hook do Expo Router que nos dá os parâmetros da URL.
  // Neste caso, ele nos dará o 'id' do bar que veio do link.
  const { id } = useLocalSearchParams<{ id: string }>();

  // Estados para guardar os dados do bar e o status de carregamento
  const [bar, setBar] = useState<Bar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A função de busca agora é para um único documento
    const fetchBarDetails = async () => {
      if (!id) return; // Se não houver ID, não fazemos nada

      try {
        // 'doc' cria uma referência para um documento específico dentro da coleção "bares"
        const barDocRef = doc(db, 'bares', id);
        // 'getDoc' busca esse documento
        const docSnap = await getDoc(barDocRef);

        if (docSnap.exists()) {
          // Se o documento existe, colocamos os dados no nosso estado
          setBar({ id: docSnap.id, ...docSnap.data() } as Bar);
        } else {
          console.log("Nenhum bar encontrado com este ID!");
          alert("Bar não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do bar: ", error);
        alert("Ocorreu um erro ao carregar os detalhes do bar.");
      } finally {
        setLoading(false);
      }
    };

    fetchBarDetails();
  }, [id]); // Este useEffect executa sempre que o 'id' mudar

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!bar) {
    return (
      <View style={styles.container}>
        <Text>Bar não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* O Stack.Screen permite customizar o cabeçalho desta página específica */}
      <Stack.Screen options={{ title: bar.nome }} />
      <Text style={styles.title}>{bar.nome}</Text>
      <Text style={styles.address}>{bar.endereco}</Text>
      {/* Aqui no futuro, podemos adicionar mais detalhes, como o cardápio */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Centraliza o conteúdo tanto vertical quanto horizontalmente
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // Um fundo branco limpo
  },
  title: {
    fontSize: 32, // Título maior
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center', // Garante que o texto esteja centralizado
  },
  address: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  }
});