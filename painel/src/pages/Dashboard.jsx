import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Importando nossos componentes organizados
import BarProfileCard from '../components/dashboard/BarProfileCard';
import HorariosManager from '../components/dashboard/HorariosManager';
import MenuManager from '../components/dashboard/MenuManager';
import ItemManager from '../components/ItemManager';
import PasswordManager from '../components/dashboard/PasswordManager';
import ChatManager from '../components/dashboard/ChatManager';
import PedidosManager from '../components/dashboard/PedidosManager';

const initialHorarios = {
    segunda: null, terca: null, quarta: null, quinta: null, sexta: null, sabado: null, domingo: null,
};

export default function Dashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Estados
    const [bar, setBar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menus, setMenus] = useState([]);
    const [selectedMenuId, setSelectedMenuId] = useState(null);
    const [nomeNovoMenu, setNomeNovoMenu] = useState('');
    const [horarios, setHorarios] = useState(initialHorarios);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [activeView, setActiveView] = useState('profile'); // 'profile' será a nossa visão inicial

    // Efeito para buscar os dados principais do bar (onSnapshot para tempo real)
    useEffect(() => {
        if (!currentUser) return;
        const baresRef = collection(db, "bares");
        const q = query(baresRef, where("ownerId", "==", currentUser.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.empty) {
                navigate('/criar-bar');
                setLoading(false);
                return;
            }
            const barDoc = querySnapshot.docs[0];
            const barData = { id: barDoc.id, ...barDoc.data() };
            setBar(barData);
            if (barData.horarios) {
                setHorarios(prev => ({ ...initialHorarios, ...barData.horarios }));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser, navigate]);

    // Efeito para buscar os cardápios (menus)
    useEffect(() => {
        if (!bar) return;
        const menusRef = collection(db, 'bares', bar.id, 'menus');
        const unsubscribe = onSnapshot(menusRef, (snapshot) => {
            setMenus(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [bar]);

    // Efeito para buscar as conversas
    useEffect(() => {
        if (!bar) return;
        const q = query(collection(db, "conversas"), where("barId", "==", bar.id), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setConversations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [bar]);

    // Efeito para buscar as mensagens da conversa selecionada
    useEffect(() => {
        if (!selectedConversation) {
            setMessages([]);
            return;
        }
        const q = query(collection(db, 'conversas', selectedConversation.id, 'messages'), orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [selectedConversation]);

    // --- Funções Handler Completas ---

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleCreateMenu = async (e) => {
        e.preventDefault();
        if (!nomeNovoMenu || !bar) return;
        try {
            const menusRef = collection(db, 'bares', bar.id, 'menus');
            await addDoc(menusRef, { nomeMenu: nomeNovoMenu });
            setNomeNovoMenu('');
            alert(`Cardápio "${nomeNovoMenu}" criado com sucesso!`);
        } catch (error) {
            console.error("Erro ao criar cardápio:", error);
        }
    };

    const handleSetActiveMenu = async (menuId) => {
        if (!bar) return;
        try {
            const barDocRef = doc(db, 'bares', bar.id);
            await updateDoc(barDocRef, { activeMenuId: menuId });
            setBar({ ...bar, activeMenuId: menuId }); // Atualiza o estado local
            alert('Cardápio ativado com sucesso!');
        } catch (error) {
            console.error("Erro ao ativar cardápio:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !selectedConversation) return;
        const messagesRef = collection(db, 'conversas', selectedConversation.id, 'messages');
        await addDoc(messagesRef, {
            text: newMessage,
            senderId: currentUser.uid,
            timestamp: serverTimestamp(),
        });
        const convDocRef = doc(db, 'conversas', selectedConversation.id);
        await updateDoc(convDocRef, {
            lastMessage: newMessage,
            timestamp: serverTimestamp(),
        });
        setNewMessage('');
    };

    if (loading) {
        return <div className="card"><p>Carregando seu painel...</p></div>;
    }

    return (
    <div className="dashboard-layout">
        <div className="sidebar">
            <h2 className="sidebar-title">EiMosso Painel</h2>
            <nav className="sidebar-nav">
                <a onClick={() => setActiveView('profile')} className={activeView === 'profile' ? 'active' : ''}>Perfil e Horários</a>
                <a onClick={() => setActiveView('menus')} className={activeView === 'menus' ? 'active' : ''}>Cardápios</a>
                <a onClick={() => setActiveView('pedidos')} className={activeView === 'pedidos' ? 'active' : ''}>Pedidos</a>
                <a onClick={() => setActiveView('chat')} className={activeView === 'chat' ? 'active' : ''}>Chat</a>
                <a onClick={() => setActiveView('account')} className={activeView === 'account' ? 'active' : ''}>Conta e Senha</a>
            </nav>
            <button onClick={handleLogout} className="logout-button-sidebar">Sair</button>
        </div>

        <main className="main-content">
            {activeView === 'profile' && (
                <>
                    <BarProfileCard bar={bar} setBar={setBar} />
                    <HorariosManager bar={bar} horarios={horarios} setHorarios={setHorarios} />
                </>
            )}

            {activeView === 'menus' && (
                <>
                    <MenuManager 
                        menus={menus} 
                        bar={bar} 
                        handleCreateMenu={handleCreateMenu}
                        nomeNovoMenu={nomeNovoMenu}
                        setNomeNovoMenu={setNomeNovoMenu}
                        handleSetActiveMenu={handleSetActiveMenu}
                        setSelectedMenuId={setSelectedMenuId}
                    />
                    {selectedMenuId && (
                        <div className="card">
                            <h2>Gerenciando Itens do Cardápio: {menus.find(m => m.id === selectedMenuId)?.nomeMenu}</h2>
                            <ItemManager bar={bar} menuId={selectedMenuId} />
                        </div>
                    )}
                </>
            )}

            {activeView === 'pedidos' && (
            <div className="card">
                <h2>Pedidos Recebidos</h2>
                <PedidosManager bar={bar} />
            </div>
            )}

            {activeView === 'chat' && (
                <ChatManager 
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    setSelectedConversation={setSelectedConversation}
                    messages={messages}
                    currentUser={currentUser}
                    handleSendMessage={handleSendMessage}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                />
            )}

            {activeView === 'account' && <PasswordManager />}
        </main>
    </div>
    )
};