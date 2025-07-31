import React, { useState } from 'react';
import { Bar } from '../../hooks/useBarData';
import { Menu } from '../../hooks/useMenus';

// 1. Definimos as props que o componente espera receber
interface MenuManagerProps {
  menus: Menu[];
  bar: Bar;
  onCreateMenu: (name: string) => void;
  onSetActiveMenu: (menuId: string) => void;
  onManageItems: (menuId: string) => void;
}

export default function MenuManager({ menus, bar, onCreateMenu, onSetActiveMenu, onManageItems }: MenuManagerProps) {
  // O estado do input do formulário é local, então pode ficar aqui
  const [nomeNovoMenu, setNomeNovoMenu] = useState('');

  const handleCreateMenu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateMenu(nomeNovoMenu); // Chama a função que veio do hook, via props
    setNomeNovoMenu('');
  };
  
  return (
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
          <div key={menu.id} className={`menu-list-item ${bar?.activeMenuId === menu.id ? 'active' : ''}`}>
            <span>{menu.nomeMenu}</span>
            <div className="button-group">
              <button onClick={() => onSetActiveMenu(menu.id)} disabled={bar?.activeMenuId === menu.id}>
                {bar?.activeMenuId === menu.id ? 'Ativo' : 'Ativar'}
              </button>
              <button onClick={() => onManageItems(menu.id)}>Gerenciar Itens</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}