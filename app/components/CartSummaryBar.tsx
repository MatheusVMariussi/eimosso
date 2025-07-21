import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useOrder } from '../context/OrderContext';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CartSummaryBar() {
  const { currentOrder } = useOrder();

  if (currentOrder.length === 0) {
    return null;
  }

  const total = currentOrder.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
  const totalItems = currentOrder.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <Link href="/pedidos" asChild>
        <TouchableOpacity style={styles.touchable}>
          <View style={styles.iconContainer}>
            <Ionicons name="cart" size={24} color="#007BFF" />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          </View>
          <Text style={styles.text}>Ver carrinho</Text>
          <Text style={styles.total}>R$ {total.toFixed(2)}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50, // Posição acima da barra de abas
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'transparent', // Para não cobrir a barra de abas
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 'auto', // Joga o total para a direita
    color: '#007BFF',
  },
});