import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function ItemManager({ bar, menuId }) {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const [nomeItem, setNomeItem] = useState('');
  const [precoItem, setPrecoItem] = useState('');
  const [descricaoItem, setDescricaoItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoadingItems(true);
      const itemsRef = collection(db, 'bares', bar.id, 'menus', menuId, 'items');
      const itemsSnapshot = await getDocs(itemsRef);
      const itemsList = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsList);
      setLoadingItems(false);
    };

    if (bar && menuId) {
      fetchItems();
    }
  }, [bar, menuId]);

  const handleSubmitItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const itemData = {
      nomeItem,
      preco: parseFloat(precoItem) || 0,
      descricao: descricaoItem,
      disponivel: editingItem ? editingItem.disponivel : true,
    };

    if (editingItem) {
      const itemDocRef = doc(db, 'bares', bar.id, 'menus', menuId, 'items', editingItem.id);
      await updateDoc(itemDocRef, itemData);
      setItems(items.map(item => item.id === editingItem.id ? { id: item.id, ...itemData } : item));
      alert('Item atualizado!');
    } else {
      const itemsRef = collection(db, 'bares', bar.id, 'menus', menuId, 'items');
      const docRef = await addDoc(itemsRef, itemData);
      setItems([...items, { id: docRef.id, ...itemData }]);
      alert('Item adicionado!');
    }
    cancelEdit();
    setSubmitting(false);
  };
  
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Tem certeza?")) return;
    const itemDocRef = doc(db, 'bares', bar.id, 'menus', menuId, 'items', itemId);
    await deleteDoc(itemDocRef);
    setItems(items.filter(item => item.id !== itemId));
    alert('Item apagado!');
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNomeItem(item.nomeItem);
    setPrecoItem(item.preco);
    setDescricaoItem(item.descricao || '');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNomeItem('');
    setPrecoItem('');
    setDescricaoItem('');
  };

  const handleToggleDisponibilidade = async (item) => {
    const itemDocRef = doc(db, 'bares', bar.id, 'menus', menuId, 'items', item.id);
    const novoStatus = !item.disponivel;
    await updateDoc(itemDocRef, { disponivel: novoStatus });
    setItems(items.map(i => i.id === item.id ? { ...i, disponivel: novoStatus } : i));
  };

  if (loadingItems) return <p>Carregando itens...</p>;

  return (
    <div>
      {/* --- FORMULÁRIO COMPLETO AQUI --- */}
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
                <button type="button" onClick={cancelEdit} className="cancel-button">
                    Cancelar
                </button>
            )}
        </div>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      {/* Lista de Itens do Cardápio */}
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