import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { ActivityIndicator, View } from 'react-native';

interface AuthContextData {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("--- DEBUG: A. AuthProvider renderizado/reiniciado. ---");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("--- DEBUG: B. useEffect do onAuthStateChanged foi chamado. ---");
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("--- DEBUG: C. Callback do onAuthStateChanged foi EXECUTADO. ---");
      console.log("--- DEBUG: Usuário recebido:", currentUser?.email || 'Nenhum usuário logado.');
      
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error("--- DEBUG: ERRO no onAuthStateChanged ---", error);
      setLoading(false); // Importante para não ficar em loop de loading em caso de erro aqui
    });

    return () => {
      console.log("--- DEBUG: D. Limpando o ouvinte onAuthStateChanged. ---");
      unsubscribe();
    }
  }, []);

  const value = {
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};