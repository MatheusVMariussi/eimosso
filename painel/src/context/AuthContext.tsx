import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// --- Interfaces para tipagem ---
interface UserProfile extends DocumentData {
  role?: 'barOwner' | 'client';
}

interface AuthContextType {
  currentUser: User | null;
  currentUserProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Busca o perfil do usuário no Firestore para verificar a role
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setCurrentUserProfile(docSnap.data());
        } else {
          // Se não houver perfil, assume um perfil padrão ou de erro.
          // Para o painel, talvez o ideal fosse deslogar o usuário.
          setCurrentUserProfile({ role: 'client' }); // Assume 'client' se não encontrar perfil
        }
      } else {
        setCurrentUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    currentUserProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}