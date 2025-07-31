import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  CollectionReference, // Importamos o tipo de referência de coleção
  DocumentData      // Importamos o tipo genérico de documento
} from 'firebase/firestore';
import { Bar } from '../hooks/useBarData';

// --- Interfaces ---
interface MenuItemData {
  nomeItem: string;
  preco: number;
  descricao: string;
  disponivel: boolean;
}

interface MenuItem extends MenuItemData {
  id: string;
}

interface ItemManagerProps {
  bar: Bar;
  menuId: string;
}

// --- Hook customizado para gerenciar os itens de um menu específico ---
function useMenuItems(barId: string, menuId: string) {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!barId || !menuId) return;
        
        const itemsRef = collection(db, 'bares', barId, 'menus', menuId, 'items');
        const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
            const itemsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
            setItems(itemsList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [barId, menuId]);

    return { items, loading, setItems };
}

// --- Componente de Apresentação ---
export default function ItemManager({ bar, menuId }: ItemManagerProps) {
  const { items, loading, setItems } = useMenuItems(bar.id, menuId);

  const [nomeItem, setNomeItem] = useState('');
  const [precoItem, setPrecoItem] = useState('');
  const [descricaoItem, setDescricaoItem] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const itemData: DocumentData = {
          nomeItem,
          preco: parseFloat(precoItem) || 0,
          descricao: descricaoItem,
          disponivel: editingItem ? editingItem.disponivel : true,
        };

    const itemsRef = collection(db, 'bares', bar.id, 'menus', menuId, 'items') as CollectionReference<MenuItemData>;

    if (editingItem) {
      const itemDocRef = doc(itemsRef, editingItem.id);
      await updateDoc(itemDocRef, itemData); // Agora o TypeScript sabe que itemData é compatível
    } else {
      await addDoc(itemsRef, itemData); // O mesmo aqui
    }
    
    cancelEdit();
    setSubmitting(false);
  };
  
  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm("Tem certeza?")) return;
    const itemDocRef = doc(db, 'bares', bar.id, 'menus', menuId, 'items', itemId);
    await deleteDoc(itemDocRef);
  };

  const handleToggleDisponibilidade = async (item: MenuItem) => {
    const itemDocRef = doc(db, 'bares', bar.id, 'menus', menuId, 'items', item.id);
    await updateDoc(itemDocRef, { disponivel: !item.disponivel });
  };
  
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setNomeItem(item.nomeItem);
    setPrecoItem(String(item.preco));
    setDescricaoItem(item.descricao || '');
  };

  const cancelEdit = () => {
    setEditingItem(null); setNomeItem(''); setPrecoItem(''); setDescricaoItem('');
  };

  if (loading) return <p>Carregando itens...</p>;

  return (
    <div>
      <form onSubmit={handleSubmitItem}>
        <h4>{editingItem ? 'Editar Item' : 'Adicionar Novo Item'}</h4>
        <div className="form-group">
          <label>Nome do Item</label>
          <input type="text" value={nomeItem} onChange={(e) => setNomeItem(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Preço (ex: 45.50)</label>
          <input type="number" step="0.01" value={precoItem} onChange={(e) => setPrecoItem(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <input type="text" value={descricaoItem} onChange={(e) => setDescricaoItem(e.target.value)} />
        </div>
        <div className="button-group">
            <button type="submit" disabled={submitting}>
                {editingItem ? 'Salvar Alterações' : 'Adicionar Item'}
            </button>
            {editingItem && (
                <button type="button" onClick={cancelEdit}>Cancelar</button>
            )}
        </div>
      </form>

      <hr style={{ margin: '2rem 0' }} />
      <h4>Itens Atuais</h4>
      {items.map(item => (
        <div key={item.id} className="menu-item-panel" style={{ opacity: item.disponivel ? 1 : 0.5 }}>
          <div className="menu-item-info">
            <strong>{item.nomeItem}</strong> - R$ {Number(item.preco).toFixed(2)}
            <p style={{ color: '#666' }}>
              {item.descricao}
            </p>
          </div>
          <div className="button-group">
            <button onClick={() => handleToggleDisponibilidade(item)} className={item.disponivel ? 'disponivel' : 'indisponivel'}>
              {item.disponivel ? 'Disponível' : 'Indisponível'}
            </button>
            <button onClick={() => handleEditItem(item)} className="edit-button">Editar</button>
            <button onClick={() => handleDeleteItem(item.id)} className="delete-button">Apagar</button>
          </div>
        </div>
      ))}
    </div>
  );
}