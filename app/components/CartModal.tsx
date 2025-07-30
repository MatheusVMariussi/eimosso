import React from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useOrder } from '../context/OrderContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- Adicionando Interface de Props ---
interface CartModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CartModal({ visible, onClose }: CartModalProps) {
  const { currentOrder, clearOrderItems, activeBar, scannedTable, removeItemFromOrder } = useOrder();
  const { user } = useAuth();

  const calcularTotal = () => {
    return currentOrder.reduce((total, item) => total + (item.preco * item.quantity), 0).toFixed(2);
  };

  const handleFinalizarPedido = async () => {
    if (!user || !activeBar || !scannedTable || currentOrder.length === 0) return;
    const novoPedido = {
      userId: user.uid, barId: activeBar, mesa: scannedTable,
      itens: currentOrder.map(item => ({
        itemId: item.id, nomeItem: item.nomeItem, quantidade: item.quantity,
        precoUnitario: item.preco, observacao: item.observation || null
      })),
      total: parseFloat(calcularTotal()), status: "Recebido", timestamp: serverTimestamp(),
    };
    try {
      await addDoc(collection(db, "pedidos"), novoPedido);
      Alert.alert("Pedido Enviado!", "Seu pedido foi enviado para o bar.",
        [{ text: "OK", onPress: () => { clearOrderItems(); onClose(); } }]
      );
    } catch (error) {
      console.error("Erro ao finalizar pedido: ", error);
      Alert.alert("Erro", "Não foi possível enviar seu pedido.");
    }
  };

  const handleClearCart = () => {
    Alert.alert(
        "Limpar Carrinho",
        "Tem certeza que deseja remover todos os itens do seu pedido?",
        [
            { text: "Cancelar", style: "cancel" },
            { text: "Sim", onPress: () => clearOrderItems(), style: "destructive" }
        ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Seu Pedido</Text>
            {/* ---> NOVO BOTÃO LIMPAR CARRINHO <--- */}
            {currentOrder.length > 0 && (
                <TouchableOpacity onPress={handleClearCart}>
                    <Text style={styles.clearButtonText}>Limpar</Text>
                </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={currentOrder}
            keyExtractor={(item) => item.uniqueId}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.quantity}x {item.nomeItem}</Text>
                  {item.observation && <Text style={styles.itemObservation}>Obs: {item.observation}</Text>}
                </View>
                <Text style={styles.itemPrice}>R$ {(item.preco * item.quantity).toFixed(2)}</Text>
                {/* ---> NOVO BOTÃO REMOVER ITEM <--- */}
                <TouchableOpacity onPress={() => removeItemFromOrder(item.uniqueId)} style={styles.removeItemButton}>
                    <Ionicons name="trash-outline" size={22} color="#dc3545" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>O carrinho está vazio.</Text>}
          />
          {currentOrder.length > 0 && (
            <View style={styles.footer}>
                <Text style={styles.totalText}>Total: R$ {calcularTotal()}</Text>
                <TouchableOpacity style={styles.checkoutButton} onPress={handleFinalizarPedido}>
                    <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
                </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

// --- ESTILOS ATUALIZADOS ---
const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  modalContent: {
    backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, maxHeight: '80%',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  clearButtonText: { color: '#007BFF', fontSize: 16 },
  itemContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  itemDetails: { flex: 1 }, // Garante que o texto ocupe o espaço
  itemName: { fontSize: 16, fontWeight: '500' },
  itemObservation: { fontSize: 14, color: 'gray', marginTop: 4, fontStyle: 'italic' },
  itemPrice: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 10 },
  removeItemButton: { padding: 5 }, // Adiciona uma área de toque ao redor do ícone
  emptyText: { textAlign: 'center', paddingVertical: 40, color: 'gray' },
  footer: { paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  totalText: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginBottom: 10 },
  checkoutButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  checkoutButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});