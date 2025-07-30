import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useOrder } from '../context/OrderContext';

interface MenuItem {
  id: string;
  nomeItem: string;
  preco: number;
  descricao: string;
  disponivel: boolean;
}

interface ItemDetailModalProps {
  item: MenuItem | null; // O item pode ser nulo quando o modal não está focado em um item específico
  visible: boolean;
  onClose: () => void;
}

// --- Aplicando a Interface de Props ---
export default function ItemDetailModal({ item, visible, onClose }: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');
  const { addItemToOrder } = useOrder();

  useEffect(() => {
    if (visible) {
      setQuantity(1);
      setObservation('');
    }
  }, [visible, item]); // Adicionado 'item' ao array de dependências

  if (!item) return null;

  const handleAddItem = () => {
    addItemToOrder(item, quantity, observation);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalBackdrop}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.modalContent}>
          <Text style={styles.itemName}>{item.nomeItem}</Text>
          <Text style={styles.itemDescription}>{item.descricao}</Text>
          
          <TextInput
            style={styles.observationInput}
            placeholder="Alguma observação? Ex: sem cebola"
            value={observation}
            onChangeText={setObservation}
          />

          <View style={styles.footer}>
            <View style={styles.counterContainer}>
              <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))} style={styles.counterButton}>
                <Text style={styles.counterText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(q => q + 1)} style={styles.counterButton}>
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleAddItem} style={styles.addButton}>
              <Text style={styles.addButtonText}>Adicionar R$ {(item.preco * quantity).toFixed(2)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  observationInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  counterButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});