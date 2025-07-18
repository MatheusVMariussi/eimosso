import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function CriarBar() {
  const [nomeBar, setNomeBar] = useState('');
  const [endereco, setEndereco] = useState('');
  const navigate = useNavigate();

  const handleCriarBar = async (e) => {
    e.preventDefault();
    const user = auth.currentUser; // Pega o usuário que acabou de se cadastrar

    if (!user) {
      alert("Você precisa estar logado para criar um bar. Redirecionando para o login.");
      navigate('/login');
      return;
    }

    if (!nomeBar || !endereco) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Salva o novo bar na coleção "bares", associando o ID do dono (ownerId)
      await addDoc(collection(db, 'bares'), {
        nome: nomeBar,
        endereco: endereco,
        ownerId: user.uid, // A associação crucial!
      });
      
      alert('Perfil do bar criado com sucesso!');
      navigate('/'); // Redireciona para o Dashboard principal
    } catch (error) {
      console.error("Erro ao criar bar:", error);
      alert("Ocorreu um erro ao criar o perfil do seu bar.");
    }
  };

  return (
    <div className="card">
      <h1>Crie o Perfil do seu Bar</h1>
      <p>Este é o último passo para começar a usar o EiMosso!</p>
      <form onSubmit={handleCriarBar}>
        <div className="form-group">
          <label>Nome do Estabelecimento</label>
          <input
            type="text"
            value={nomeBar}
            onChange={(e) => setNomeBar(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Endereço Completo</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
        </div>
        <button type="submit">Salvar e Acessar o Painel</button>
      </form>
    </div>
  );
}