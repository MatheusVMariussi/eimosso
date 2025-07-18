import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ItemManager from '../components/ItemManager';

// Vamos manter o componente do cardápio separado para organização
// (Por enquanto, ele ficará neste arquivo, mas poderíamos movê-lo depois)
function MenuManager({ bar }) {
    // ... (Aqui virá toda a lógica de itens do cardápio)
    return <div>Gerenciador de Itens em breve...</div>
}

export default function Dashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [bar, setBar] = useState(null);
    const [loading, setLoading] = useState(true);

    // ---> NOVOS ESTADOS PARA GERENCIAR MÚLTIPLOS CARDÁPIOS <---
    const [menus, setMenus] = useState([]);
    const [selectedMenuId, setSelectedMenuId] = useState(null); // Qual cardápio estamos vendo/editando
    const [nomeNovoMenu, setNomeNovoMenu] = useState(''); // Para o formulário de criar novo cardápio

    // Busca os dados do bar e seus cardápios
    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            // ... (Lógica para buscar o bar do usuário, sem alterações)
            const baresRef = collection(db, "bares");
            const q = query(baresRef, where("ownerId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                navigate('/criar-bar');
                return;
            }

            const barDoc = querySnapshot.docs[0];
            const barData = { id: barDoc.id, ...barDoc.data() };
            setBar(barData);

            // ---> BUSCA OS CARDÁPIOS (MENUS) DESTE BAR <---
            const menusRef = collection(db, 'bares', barData.id, 'menus');
            const menusSnapshot = await getDocs(menusRef);
            const menusList = menusSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMenus(menusList);

            setLoading(false);
        };
        fetchData();
    }, [currentUser, navigate]);

    // ---> NOVA FUNÇÃO PARA CRIAR UM CARDÁPIO <---
    const handleCreateMenu = async (e) => {
        e.preventDefault();
        if (!nomeNovoMenu) return;

        try {
            const menusRef = collection(db, 'bares', bar.id, 'menus');
            const docRef = await addDoc(menusRef, { nomeMenu: nomeNovoMenu });
            
            // Atualiza a lista na tela
            setMenus([...menus, { id: docRef.id, nomeMenu: nomeNovoMenu }]);
            setNomeNovoMenu('');
            alert(`Cardápio "${nomeNovoMenu}" criado com sucesso!`);
        } catch (error) {
            console.error("Erro ao criar cardápio:", error);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleSetActiveMenu = async (menuId) => {
      if (!bar) return;
      try {
        // Cria a referência para o documento principal do bar
        const barDocRef = doc(db, 'bares', bar.id);
        // Atualiza o campo 'activeMenuId' com o ID do cardápio selecionado
        await updateDoc(barDocRef, {
          activeMenuId: menuId,
        });

        // Atualiza o estado local para refletir a mudança imediatamente na tela
        setBar({ ...bar, activeMenuId: menuId });
        alert('Cardápio ativado com sucesso!');
      } catch (error) {
        console.error("Erro ao ativar cardápio:", error);
        alert('Não foi possível ativar o cardápio.');
      }
    };

    if (loading) {
        return <div className="card"><p>Carregando seu painel...</p></div>;
    }

    return (
        <div>
            <div className="header">
                <h1>Painel de Gerenciamento: {bar?.nome}</h1>
                <button onClick={handleLogout} className="logout-button">Sair</button>
            </div>
            
            <div className="card">
                <h2>Meus Cardápios</h2>
                <form onSubmit={handleCreateMenu} className="inline-form">
                    <input
                        type="text"
                        value={nomeNovoMenu}
                        onChange={(e) => setNomeNovoMenu(e.target.value)}
                        placeholder="Nome do novo cardápio (ex: Jantar)"
                        required
                    />
                    <button type="submit">Criar Cardápio</button>
                </form>

                <div className="menu-selection-list">
                  {menus.map(menu => (
                    // A classe 'active' será adicionada se este for o cardápio ativo
                    <div key={menu.id} className={`menu-list-item ${bar?.activeMenuId === menu.id ? 'active' : ''}`}>
                      <span>{menu.nomeMenu}</span>
                      <div className="button-group">
                        {/* NOVO BOTÃO "ATIVAR" */}
                        <button onClick={() => handleSetActiveMenu(menu.id)} disabled={bar?.activeMenuId === menu.id}>
                          {bar?.activeMenuId === menu.id ? 'Ativo' : 'Ativar'}
                        </button>
                        <button onClick={() => setSelectedMenuId(menu.id)}>Gerenciar Itens</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            
            {/* Se um cardápio estiver selecionado, mostra o gerenciador de itens */}
            {selectedMenuId && (
                 <div className="card">
                    <h2>Gerenciando Itens do Cardápio: {menus.find(m => m.id === selectedMenuId)?.nomeMenu}</h2>
                    {/* AQUI ESTÁ A MUDANÇA */}
                    <ItemManager bar={bar} menuId={selectedMenuId} />
                 </div>
            )}
        </div>
    );
}