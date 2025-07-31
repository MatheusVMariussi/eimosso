import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, doc, updateDoc, DocumentData } from 'firebase/firestore';
import { Bar } from './useBarData'; // Reutilizando a interface do hook anterior

// Interface para um Menu/Cardápio
export interface Menu extends DocumentData {
  id: string;
  nomeMenu: string;
}

export function useMenus(bar: Bar | null) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Efeito para buscar os menus em tempo real
  useEffect(() => {
    if (!bar) {
      setMenus([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const menusRef = collection(db, 'bares', bar.id, 'menus');
    const unsubscribe = onSnapshot(menusRef, (snapshot) => {
      const menuList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Menu));
      setMenus(menuList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [bar]);

  // Função para criar um novo menu
  const createMenu = async (nomeMenu: string) => {
    if (!bar || !nomeMenu.trim()) return;
    try {
      const menusRef = collection(db, 'bares', bar.id, 'menus');
      await addDoc(menusRef, { nomeMenu });
      alert(`Cardápio "${nomeMenu}" criado com sucesso!`);
    } catch (error) {
      console.error("Erro ao criar cardápio:", error);
      alert("Não foi possível criar o cardápio.");
    }
  };

  // Função para definir o menu ativo
  const setActiveMenu = async (menuId: string) => {
    if (!bar) return;
    try {
      const barDocRef = doc(db, 'bares', bar.id);
      // O 'bar' no dashboard será atualizado automaticamente pelo onSnapshot do useBarData
      await updateDoc(barDocRef, { activeMenuId: menuId });
      alert('Cardápio ativado com sucesso!');
    } catch (error) {
      console.error("Erro ao ativar cardápio:", error);
      alert("Não foi possível ativar o cardápio.");
    }
  };

  return { menus, loading, createMenu, setActiveMenu };
}