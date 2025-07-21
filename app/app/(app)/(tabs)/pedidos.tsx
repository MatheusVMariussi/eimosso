import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useOrder } from '../../../context/OrderContext';
import { Stack } from 'expo-router';

export default function PedidosScreen() {
  // Pegamos os dados e funções do nosso contexto
  const { currentOrder, clearOrder } = useOrder();

  // Função para calcular o total do pedido
  const calcularTotal = () => {
  return currentOrder.reduce((total, item) => total + (item.preco * item.quantity), 0).toFixed(2);
};

  const handleFinalizarPedido = () => {
    // No futuro, aqui virá a lógica de pagamento e envio para o bar
    Alert.alert(
      "Pedido Finalizado!", 
      `Seu pedido de R$ ${calcularTotal()} foi enviado para o bar.`,
      [{ text: "OK", onPress: () => clearOrder() }] // Limpa o carrinho após finalizar
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Meu Pedido' }} />
      <Text style={styles.title}>Revisão do Pedido</Text>
      
      <FlatList
        data={currentOrder}
        keyExtractor={(item) => item.uniqueId} // Usamos o uniqueId
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>{item.quantity}x {item.nomeItem}</Text>
              {item.observation && <Text style={styles.itemObservation}>Obs: {item.observation}</Text>}
            </View>
            <Text style={styles.itemPrice}>R$ {(item.preco * item.quantity).toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Seu carrinho está vazio.</Text>}
        style={styles.list}
      />
      
      {/* Mostra o total e o botão de finalizar apenas se houver itens no carrinho */}
      {currentOrder.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: R$ {calcularTotal()}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleFinalizarPedido}>
            <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemObservation: { fontSize: 14, color: 'gray', marginTop: 4 },
});