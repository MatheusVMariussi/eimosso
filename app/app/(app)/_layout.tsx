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
          name="(tabs)" // Esta tela aponta para o nosso layout de abas
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="bar/[id]" // Esta é a nossa tela de detalhes
          options={{ presentation: 'modal', title: 'Detalhes do Bar' }} 
        />
      </Stack>
      <CartSummaryBar />
    </View>
  );
}