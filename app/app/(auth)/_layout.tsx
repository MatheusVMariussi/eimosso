import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();

  // Se já existir um usuário, redireciona para a tela inicial do app.
  if (user) {
    return <Redirect href="/" />;
  }

  // Se não, mostra as telas de login/cadastro.
  return <Stack screenOptions={{ headerShown: false }} />;
}