import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Reutilizando as interfaces que já definimos
interface MenuItem {
  id: string;
  nomeItem: string;
  preco: number;
  descricao: string;
  disponivel: boolean;
}

interface Bar {
  id: string;
  nome: string;
  endereco: string;
  activeMenuId: string;
  bannerUrl: string; // Adicionado para completude
}

export function useBarDetails(barId: string) {
  const [bar, setBar] = useState<Bar | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!barId) {
      setLoading(false);
      return;
    }

    const fetchBarAndMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const barDocRef = doc(db, 'bares', barId);
        const barDocSnap = await getDoc(barDocRef);

        if (!barDocSnap.exists()) {
          throw new Error("Bar não encontrado.");
        }

        const barData = { id: barDocSnap.id, ...barDocSnap.data() } as Bar;
        setBar(barData);

        if (barData.activeMenuId) {
          const itemsRef = collection(db, 'bares', barId, 'menus', barData.activeMenuId, 'items');
          const itemsSnapshot = await getDocs(itemsRef);
          const menuList = itemsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as MenuItem))
            .filter(item => item.disponivel);
          setMenu(menuList);
        } else {
          setMenu([]);
        }
      } catch (e: any) {
        setError(e.message);
        console.error("Erro ao buscar dados do bar:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBarAndMenu();
  }, [barId]);

  return { bar, menu, loading, error };
}