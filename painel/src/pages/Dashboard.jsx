import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Dashboard() {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Você saiu da sua conta.');
      // A lógica de redirecionamento cuidará de nos levar para a tela de login
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className="card">
      <h1>Painel Principal do Bar</h1>
      <p>Bem-vindo! Você está logado.</p>
      {/* Futuramente, aqui ficará a lista de bares e o gerenciador de cardápio */}
      <button onClick={handleLogout} className="logout-button">
        Sair (Logout)
      </button>
    </div>
  );
}