import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Pega o estado de login do nosso contexto

// Este componente é um "Wrapper" ou "Guardião".
// Ele recebe como 'children' o componente que queremos proteger (no caso, o Dashboard).
export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth(); // Verifica se há um usuário logado

  // Se NÃO houver um usuário logado...
  if (!currentUser) {
    // ...ele renderiza o componente <Navigate>, que redireciona o usuário para a tela de login.
    return <Navigate to="/login" />;
  }

  // Se houver um usuário, ele simplesmente renderiza o componente filho (o Dashboard).
  return children;
}