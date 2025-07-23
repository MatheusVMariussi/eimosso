import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { View } from 'react-native';
import CartSummaryBar from '../../components/CartSummaryBar';

export default function AppLayout() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen 
          name="(tabs)" // Aponta para o layout que controla a barra de abas
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="bar/[id]" // Tela de detalhes do bar
          options={{ presentation: 'modal', title: 'Detalhes do Bar' }} 
        />
        <Stack.Screen 
          name="chat/[id]" // Tela de uma conversa
          options={{ title: 'Chat' }} // Abre como uma tela normal, por cima das abas
        />
      </Stack>
      <CartSummaryBar />
    </View>
  );
}