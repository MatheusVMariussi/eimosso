import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, Alert, FlatList } from 'react-native';
import { useOrder } from '../../../context/OrderContext';
import ParallaxScrollView from '../../../components/ParallaxScrollView';
import ItemDetailModal from '../../../components/ItemDetailModal'; // Caminho atualizado
import { useAuth } from '../../../context/AuthContext';
import { useBarDetails } from '../../../hooks/useBarDetails'; // Nosso novo hook!
import { initiateChat } from '../../../services/ChatService'; // Lógica de chat extraída

// A interface MenuItem pode ser movida para um arquivo de tipos global (ex: types/index.ts)
interface MenuItem {
  id: string;
  nomeItem: string;
  preco: number;
  descricao: string;
  disponivel: boolean;
}

export default function BarDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  // O estado da UI permanece no componente
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Toda a lógica de dados agora vem do hook
  const { bar, menu, loading, error } = useBarDetails(id);
  
  // A lógica de pedido e mesa vem do contexto, o que está correto
  const { scannedTable, activeBar, leaveTable, selectTable } = useOrder();

  const handleInitiateChat = async () => {
    if (!user || !bar) return;
    const conversationId = await initiateChat(user, bar);
    if (conversationId) {
      Alert.alert("Chat Iniciado!", "Vá para a aba Social para conversar.");
      router.push('/social');
    } else {
      Alert.alert("Erro", "Não foi possível iniciar a conversa.");
    }
  };

  const openModalForItem = (item: MenuItem) => {
    if (!scannedTable || activeBar !== id) {
      Alert.alert("Atenção", "Para pedir, primeiro escaneie o QR Code da sua mesa.");
      return;
    }
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleScanButtonPress = () => {
    if (scannedTable && activeBar === id) {
      Alert.alert(
        `Você está na Mesa ${scannedTable}`,
        "O que deseja fazer?",
        [
          { text: "Sair da Mesa", onPress: () => leaveTable(), style: "destructive" },
          { text: "Trocar de Mesa", onPress: () => router.push(`/scanner?barId=${id}`) },
          { text: "Fechar", style: "cancel" },
        ]
      );
    } else {
      router.push(`/scanner?barId=${id}`);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }
  
  if (error) {
    return <View style={styles.center}><Text>{error}</Text></View>;
  }

  return (
    <>
      <Stack.Screen options={{ title: bar?.nome || 'Detalhes' }} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <ImageBackground
            source={{ uri: bar?.bannerUrl || `https://via.placeholder.com/400x180.png/007BFF/FFFFFF?Text=${bar?.nome}` }}
            style={styles.headerImage}
          >
            <View style={styles.headerOverlay}>
              <Text style={styles.headerTitle}>{bar?.nome}</Text>
            </View>
          </ImageBackground>
        }>
        
        <View style={styles.contentContainer}>
          <Text style={styles.address}>{bar?.endereco}</Text>
          
          <TouchableOpacity style={styles.scanButton} onPress={handleScanButtonPress}>
            <Text style={styles.buttonText}>
              {scannedTable && activeBar === id ? `Mesa ${scannedTable}` : 'Escanear QR Code da Mesa'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.chatButton} onPress={handleInitiateChat}>
            <Text style={styles.buttonText}>Fale com o Bar</Text>
          </TouchableOpacity>
          
          <Text style={styles.menuTitle}>Cardápio</Text>
          
          <FlatList
            data={menu}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.menuItem} onPress={() => openModalForItem(item)}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.itemName}>{item.nomeItem}</Text>
                  {item.descricao && <Text style={styles.itemDescription}>{item.descricao}</Text>}
                </View>
                <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum item disponível neste cardápio.</Text>}
            scrollEnabled={false} // A rolagem principal é do ParallaxScrollView
          />
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

// Os estilos permanecem os mesmos, adicionei apenas um para centralizar o loading/erro
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // ... (resto dos seus estilos)
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