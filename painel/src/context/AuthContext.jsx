import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const AuthContext = createContext();

// Hook para usar o contexto facilmente
export function useAuth() {
  return useContext(AuthContext);
}

// O componente Provedor
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para saber se ainda estamos verificando

  useEffect(() => {
    // O 'ouvinte' do Firebase que nos diz se o usuário está logado ou não
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Limpa o ouvinte ao desmontar
  }, []);

  const value = {
    currentUser,
  };

  // Não renderiza nada até que a verificação inicial do Firebase termine
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}