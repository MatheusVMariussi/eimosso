import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

// Importando todos os nossos hooks e componentes
import { useBarData } from '../hooks/useBarData';
import { useMenus } from '../hooks/useMenus';
import { useHorarios } from '../hooks/useHorarios';
import { usePedidos } from '../hooks/usePedidos';
import { useChat } from '../hooks/useChat';

import BarProfileCard from '../components/dashboard/BarProfileCard';
import HorariosManager from '../components/dashboard/HorariosManager';
import MenuManager from '../components/dashboard/MenuManager';
import ItemManager from '../components/ItemManager';
import PasswordManager from '../components/dashboard/PasswordManager';
import PedidosManager from '../components/dashboard/PedidosManager';
import ChatManager from '../components/dashboard/ChatManager';

type ActiveView = 'profile' | 'menus' | 'pedidos' | 'chat' | 'account';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [activeView, setActiveView] = useState<ActiveView>('profile');
    const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

    // --- 1. Consumindo os hooks para buscar e gerenciar dados ---
    const { bar, setBar, loading: barLoading } = useBarData();
    const { menus, createMenu, setActiveMenu } = useMenus(bar);
    const { horarios, setHorarios, saveHorarios } = useHorarios(bar);
    const { pedidos, loading: pedidosLoading } = usePedidos(bar);
    const { conversations, selectedConversation, setSelectedConversation, messages, sendMessage, loading: chatLoading } = useChat(bar);

    const handleLogout = () => signOut(auth);

    if (barLoading) {
        return <div className="card" style={{ textAlign: 'center' }}><p>Carregando seu painel...</p></div>;
    }

    if (!bar) {
        // O hook useBarData já redireciona para /criar-bar se não encontrar um bar.
        // Retornar null aqui evita renderizar o resto do dashboard desnecessariamente.
        return null;
    }

    // --- 2. Renderizando a UI e passando os dados/funções para os componentes ---
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
                        <HorariosManager horarios={horarios} setHorarios={setHorarios} onSave={saveHorarios} />
                    </>
                )}

                {activeView === 'menus' && (
                    <>
                        <MenuManager 
                            menus={menus} 
                            bar={bar} 
                            onCreateMenu={createMenu}
                            onSetActiveMenu={setActiveMenu}
                            onManageItems={setSelectedMenuId}
                        />
                        {selectedMenuId && (
                            <div className="card">
                                <h2>Gerenciando Itens: {menus.find(m => m.id === selectedMenuId)?.nomeMenu}</h2>
                                <ItemManager bar={bar} menuId={selectedMenuId} />
                            </div>
                        )}
                    </>
                )}
                
                {activeView === 'pedidos' && (
                    <PedidosManager bar={bar} />
                )}

                {activeView === 'chat' && (
                    <ChatManager bar={bar} />
                )}

                {activeView === 'account' && <PasswordManager />}
            </main>
        </div>
    );
};