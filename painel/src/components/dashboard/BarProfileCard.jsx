import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function BarProfileCard({ bar, setBar }) {
  const [bannerUrlInput, setBannerUrlInput] = useState('');

  const handleSaveBannerUrl = async (e) => {
    e.preventDefault();
    if (!bannerUrlInput || !bar) return;
    try {
      const barDocRef = doc(db, 'bares', bar.id);
      await updateDoc(barDocRef, { bannerUrl: bannerUrlInput });
      setBar({ ...bar, bannerUrl: bannerUrlInput });
      setBannerUrlInput('');
      alert('URL do banner salva com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar URL do banner: ", error);
    }
  };

  return (
    <div className="card">
      <h2>{bar?.nome}</h2>
      <p>{bar?.endereco}</p>
      <hr />
      <h3>Banner do Estabelecimento</h3>
      {bar?.bannerUrl && <img src={bar.bannerUrl} alt="Banner atual" style={{width: '100%', borderRadius: '8px', marginBottom: '1rem'}} />}
      <form onSubmit={handleSaveBannerUrl}>
        <div className="form-group">
          <label>URL da imagem para o banner</label>
          <input
            type="text"
            placeholder="Cole o link da imagem aqui"
            value={bannerUrlInput}
            onChange={(e) => setBannerUrlInput(e.target.value)}
          />
        </div>
        <button type="submit">Salvar URL do Banner</button>
      </form>
    </div>
  );
}