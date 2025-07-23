import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { doc, getDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useOrder } from '@/context/OrderContext';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import ItemDetailModal from '@/components/ItemDetailModal';
import { useAuth } from '@/context/AuthContext';

// Interfaces
interface MenuItem {
  id: string;
  nomeItem: string;
  preco: number;
  descricao: string;
  disponivel: boolean;
}
interface Bar {
  id: string;
  nome: string;
  endereco: string;
  activeMenuId?: string;
}

export default function BarDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bar, setBar] = useState<Bar | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const { selectTable, scannedTable, activeBar } = useOrder();
  const { user: currentUser } = useAuth();
  const router = useRouter();

  // Busca os dados do bar e seu cardápio ativo
  useEffect(() => {
    const fetchBarAndActiveMenu = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const barDocRef = doc(db, 'bares', id);
        const barDocSnap = await getDoc(barDocRef);

        if (!barDocSnap.exists()) {
          alert("Bar não encontrado.");
          setLoading(false);
          return;
        }

        const barData = { id: barDocSnap.id, ...barDocSnap.data() } as Bar;
        setBar(barData);

        if (barData.activeMenuId) {
          const itemsRef = collection(db, 'bares', id, 'menus', barData.activeMenuId, 'items');
          const itemsSnapshot = await getDocs(itemsRef);
          
          const menuList = itemsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as MenuItem[];
          
          setMenu(menuList.filter(item => item.disponivel));
        } else {
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

  // Abre o modal de detalhes do item
  const openModalForItem = (item: MenuItem) => {
    if (!scannedTable || activeBar !== id) {
      alert("Para ver os detalhes de um item, primeiro escaneie o QR Code da sua mesa!");
      return;
    }
    setSelectedItem(item);
    setModalVisible(true);
  };

  // Inicia uma nova conversa ou navega para uma existente
  const handleInitiateChat = async () => {
    if (!currentUser || !bar) return;
    try {
      const conversasRef = collection(db, 'conversas');
      const q = query(conversasRef, 
        where("userId", "==", currentUser.uid),
        where("barId", "==", bar.id)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const conversationId = querySnapshot.docs[0].id;
        router.push(`/chat/${conversationId}`);
      } else {
        const newConversation = {
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email,
          barId: bar.id,
          barName: bar.nome,
          lastMessage: "Conversa iniciada...",
          timestamp: new Date(),
        };
        const docRef = await addDoc(conversasRef, newConversation);
        router.push(`/chat/${docRef.id}`);
      }
    } catch (error) {
      console.error("Erro ao iniciar chat:", error);
      alert("Não foi possível iniciar a conversa.");
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;
  }

  return (
    <>
      <Stack.Screen options={{ title: bar?.nome || 'Detalhes' }} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <ImageBackground
            source={{ uri: `https://via.placeholder.com/400x180.png/007BFF/FFFFFF?Text=${bar?.nome}` }}
            style={styles.headerImage}
          >
            <View style={styles.headerOverlay}>
              <Text style={styles.headerTitle}>{bar?.nome}</Text>
            </View>
          </ImageBackground>
        }>
        <View style={styles.contentContainer}>
          <Text style={styles.address}>{bar?.endereco}</Text>
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={() => selectTable(id, '15')}
          >
            <Text style={styles.buttonText}>
              {scannedTable && activeBar === id ? `Você está na Mesa 15` : 'Simular Scan da Mesa'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatButton} onPress={handleInitiateChat}>
            <Text style={styles.buttonText}>Fale com o Bar</Text>
          </TouchableOpacity>
          <Text style={styles.menuTitle}>Cardápio Ativo</Text>

          {menu.map(item => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => openModalForItem(item)}>
              <View style={styles.menuItemInfo}>
                <Text style={styles.itemName}>{item.nomeItem}</Text>
                {item.descricao && <Text style={styles.itemDescription}>{item.descricao}</Text>}
              </View>
              <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
          {menu.length === 0 && (
            <Text style={styles.emptyText}>
              {bar?.activeMenuId ? 'Nenhum item disponível.' : 'Nenhum cardápio ativo.'}
            </Text>
          )}
        </View>
      </ParallaxScrollView>

      <ItemDetailModal
        item={selectedItem}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: { width: '100%', height: 180 },
  headerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', padding: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  contentContainer: { paddingVertical: 24, backgroundColor: '#fff', minHeight: '100%' },
  address: { fontSize: 16, color: 'gray', textAlign: 'center', marginBottom: 20, paddingHorizontal: 16 },
  scanButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 16, marginBottom: 10 },
  chatButton: { backgroundColor: '#17a2b8', padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 16, marginBottom: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  menuTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, paddingHorizontal: 16 },
  menuItem: { paddingVertical: 20, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  menuItemInfo: { flex: 1, marginRight: 16 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemDescription: { fontSize: 14, color: '#666', marginTop: 4 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  emptyText: { textAlign: 'center', marginTop: 20, color: 'gray', paddingHorizontal: 16 },
});