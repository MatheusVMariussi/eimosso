import { useState } from 'react';
// Importa as funções do Firestore que usaremos
import { collection, addDoc } from 'firebase/firestore';
// Importa nossa instância do banco de dados
import { db } from './firebaseConfig';
import './App.css'; // Mantemos o CSS básico

function App() {
  // Estados para guardar o nome e endereço do bar
  const [nomeBar, setNomeBar] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);

  // Função chamada ao enviar o formulário
  const handleCadastroBar = async (e) => {
    e.preventDefault(); // Impede o recarregamento padrão da página
    
    if (!nomeBar || !endereco) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      // 'collection' aponta para a coleção "bares" no Firestore. Se não existir, ela será criada.
      const baresCollectionRef = collection(db, 'bares');

      // 'addDoc' cria um novo documento (um novo bar) dentro da coleção com os dados fornecidos.
      await addDoc(baresCollectionRef, {
        nome: nomeBar,
        endereco: endereco,
        // Podemos adicionar mais campos aqui no futuro
      });

      alert(`Bar "${nomeBar}" cadastrado com sucesso!`);
      // Limpa os campos do formulário após o sucesso
      setNomeBar('');
      setEndereco('');

    } catch (error) {
      console.error("Erro ao cadastrar bar: ", error);
      alert("Ocorreu um erro ao cadastrar o bar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>Painel EiMosso - Cadastrar Bar</h1>
      <form onSubmit={handleCadastroBar}>
        <div className="form-group">
          <label>Nome do Bar</label>
          <input
            type="text"
            value={nomeBar}
            onChange={(e) => setNomeBar(e.target.value)}
            placeholder="Ex: Bar do Zé"
          />
        </div>
        <div className="form-group">
          <label>Endereço</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Ex: Rua das Flores, 123"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Bar'}
        </button>
      </form>
    </div>
  );
}

export default App;