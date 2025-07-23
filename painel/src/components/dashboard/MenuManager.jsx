import React from 'react';

export default function MenuManager({ menus, bar, handleCreateMenu, nomeNovoMenu, setNomeNovoMenu, handleSetActiveMenu, setSelectedMenuId }) {
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
              <button onClick={() => handleSetActiveMenu(menu.id)} disabled={bar?.activeMenuId === menu.id}>
                {bar?.activeMenuId === menu.id ? 'Ativo' : 'Ativar'}
              </button>
              <button onClick={() => setSelectedMenuId(menu.id)}>Gerenciar Itens</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}