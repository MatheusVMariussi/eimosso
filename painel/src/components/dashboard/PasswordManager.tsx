import React, { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

export default function PasswordManager() {
  const { currentUser } = useAuth();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaNovaSenha, setConfirmaNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;

    if (novaSenha !== confirmaNovaSenha) {
      alert("As senhas não coincidem.");
      return;
    }
    
    setLoading(true);
    const credential = EmailAuthProvider.credential(currentUser.email!, senhaAtual);
    
    try {
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, novaSenha);
      alert("Senha alterada com sucesso!");
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmaNovaSenha('');
    } catch (error) {
      alert("Erro ao alterar a senha. Verifique se sua senha atual está correta.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Alterar Senha</h3>
      <form onSubmit={handleChangePassword}>
        <div className="form-group">
          <label>Senha Atual</label>
          <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Nova Senha</label>
          <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Confirmar Nova Senha</label>
          <input type="password" value={confirmaNovaSenha} onChange={(e) => setConfirmaNovaSenha(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Alterando...' : 'Alterar Senha'}
        </button>
      </form>
    </div>
  );
}