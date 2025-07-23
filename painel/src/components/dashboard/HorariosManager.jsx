import React from 'react';
import Slider from 'rc-slider';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const formatTime = (minutes) => {
    if (minutes === null) return "Fechado";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export default function HorariosManager({ bar, horarios, setHorarios }) {

  const handleHorarioChange = (dia, valor) => {
    setHorarios(prev => ({ ...prev, [dia]: valor }));
  };

  const handleToggleFechado = (dia) => {
    const novoValor = horarios[dia] === null ? [1080, 1380] : null;
    setHorarios(prev => ({ ...prev, [dia]: novoValor }));
  };

  const handleSaveHorarios = async (e) => {
    e.preventDefault();
    if (!bar) return;
    try {
      const barDocRef = doc(db, 'bares', bar.id);
      await updateDoc(barDocRef, { horarios: horarios });
      alert('Horários de funcionamento salvos com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar horários: ", error);
    }
  };

  return (
    <div className="card">
      <h3>Horário de Funcionamento</h3>
      <form onSubmit={handleSaveHorarios}>
        <div className="horarios-container">
          {Object.keys(horarios).map((dia) => (
            <div className="horario-dia" key={dia}>
              <div className="dia-header">
                <label style={{textTransform: 'capitalize'}}>{dia}</label>
                <div className='dia-info'>
                  <span>{horarios[dia] ? `${formatTime(horarios[dia][0])} - ${formatTime(horarios[dia][1])}` : 'Fechado'}</span>
                  <button type="button" onClick={() => handleToggleFechado(dia)} className="toggle-fechado">
                    {horarios[dia] ? 'Fechar' : 'Abrir'}
                  </button>
                </div>
              </div>
              {horarios[dia] && (
                <Slider range min={0} max={1440} step={15} value={horarios[dia]} onChange={(valor) => handleHorarioChange(dia, valor)} />
              )}
            </div>
          ))}
        </div>
        <button type="submit" style={{marginTop: '1rem'}}>Salvar Horários</button>
      </form>
    </div>
  );
}