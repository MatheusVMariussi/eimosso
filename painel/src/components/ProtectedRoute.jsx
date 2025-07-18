import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Este componente recebe um 'children', que é a página que queremos proteger
export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  // Se NÃO houver um usuário logado, redireciona para a página de login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Se houver um usuário, renderiza a página protegida
  return children;
}