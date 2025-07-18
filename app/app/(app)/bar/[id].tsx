import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// O tipo do Item do Menu agora inclui a disponibilidade
interface MenuItem {
  id: string;
  nomeItem: string;
  preco: number;
  descricao: string;
  disponivel: boolean; // Nosso novo campo!
}

interface Bar {
  id: string;
  nome: string;
  endereco: string;
  activeMenuId?: string; // O campo pode ser opcional
}

export default function BarDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [bar, setBar] = useState<Bar | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarAndActiveMenu = async () => {
      if (!id) return;
      try {
        // 1. Busca os dados principais do bar
        const barDocRef = doc(db, 'bares', id);
        const barDocSnap = await getDoc(barDocRef);

        if (!barDocSnap.exists()) {
          alert("Bar não encontrado.");
          setLoading(false);
          return;
        }

        const barData = { id: barDocSnap.id, ...barDocSnap.data() } as Bar;
        setBar(barData);

        // 2. Verifica se existe um cardápio ativo
        if (barData.activeMenuId) {
          // 3. Se existir, busca os itens DENTRO da subcoleção de 'menus' usando o ID ativo
          const itemsRef = collection(db, 'bares', id, 'menus', barData.activeMenuId, 'items');
          const itemsSnapshot = await getDocs(itemsRef);
          
          const menuList = itemsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as MenuItem[];
          
          // Filtra para mostrar apenas os itens disponíveis
          setMenu(menuList.filter(item => item.disponivel));
        } else {
          // Se não houver cardápio ativo, a lista de menu fica vazia
          setMenu([]);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarAndActiveMenu();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: bar?.nome || 'Detalhes' }} />
      
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{bar?.nome}</Text>
            <Text style={styles.address}>{bar?.endereco}</Text>
            <Text style={styles.menuTitle}>Cardápio Ativo</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.itemName}>{item.nomeItem}</Text>
              <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
            </View>
            {item.descricao && <Text style={styles.itemDescription}>{item.descricao}</Text>}
          </View>
        )}
        ListEmptyComponent={
            <Text style={styles.emptyText}>
                {bar?.activeMenuId ? 'Nenhum item disponível neste cardápio.' : 'Este bar não possui um cardápio ativo no momento.'}
            </Text>
        }
      />
    </View>
  );
}

// Estilos atualizados para o cardápio
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  address: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 10,
  },
  menuItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1, // Permite que o nome quebre a linha se for muito grande
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  }
});