import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export interface Bar extends DocumentData {
  id: string;
  nome: string;
  // adicione outros campos do bar aqui
}

export function useBarData() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bar, setBar] = useState<Bar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const baresRef = collection(db, "bares");
    const q = query(baresRef, where("ownerId", "==", currentUser.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        // Se o dono não tem bar, redireciona para a criação
        navigate('/criar-bar');
        setLoading(false);
        return;
      }
      const barDoc = querySnapshot.docs[0];
      setBar({ id: barDoc.id, ...barDoc.data() } as Bar);
      setLoading(false);
    }, (error) => {
        console.error("Erro ao buscar dados do bar:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, navigate]);

  return { bar, setBar, loading };
}