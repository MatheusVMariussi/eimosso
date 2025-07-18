import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { user } = useAuth();

  // Se não houver usuário, redireciona para a tela de login.
  if (!user) {
    return <Redirect href="/login" />;
  }

  // Se houver usuário, mostra o conteúdo desta seção.
  return <Stack />;
}