import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy, Timestamp, DocumentData } from 'firebase/firestore';
import { Bar } from './useBarData';

// --- Interfaces para os Pedidos ---
interface PedidoItem extends DocumentData {
  itemId: string;
  nomeItem: string;
  quantidade: number;
  precoUnitario: number;
  observacao?: string | null;
}

export interface Pedido extends DocumentData {
  id: string;
  mesa: string;
  total: number;
  status: string;
  timestamp: Timestamp;
  itens: PedidoItem[];
}

export function usePedidos(bar: Bar | null) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bar) {
      setLoading(false);
      return;
    }

    const pedidosRef = collection(db, "pedidos");
    const q = query(pedidosRef, where("barId", "==", bar.id), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pedidosList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Pedido[];
      setPedidos(pedidosList);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar pedidos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [bar]);

  return { pedidos, loading };
}