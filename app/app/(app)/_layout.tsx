import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { View } from 'react-native';
import CartSummaryBar from '../../components/CartSummaryBar';
import CartModal from '../../components/CartModal';
import { useOrder } from '../../context/OrderContext';

export default function AppLayout() {
  const { user } = useAuth();
  const { isCartVisible, closeCart } = useOrder();

  if (!user) return <Redirect href="/login" />;

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen 
          name="(tabs)" // Esta tela aponta para o nosso layout que define as abas
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="scanner" // A tela do scanner é uma tela de nível superior nesta pilha
          options={{ 
            presentation: 'modal', 
            title: 'Escanear QR Code da Mesa' 
          }} 
        />
      </Stack>
      <CartSummaryBar />
      <CartModal visible={isCartVisible} onClose={closeCart} />
    </View>
  );
}