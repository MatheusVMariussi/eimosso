import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; // Importar o CSS do slider é uma boa prática
import { Horarios } from '../../hooks/useHorarios';

const formatTime = (minutes: number | null): string => {
    if (minutes === null) return "Fechado";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

interface HorariosManagerProps {
  horarios: Horarios;
  setHorarios: React.Dispatch<React.SetStateAction<Horarios>>;
  onSave: () => void;
}

export default function HorariosManager({ horarios, setHorarios, onSave }: HorariosManagerProps) {

  // Garantimos que 'dia' é uma chave válida da nossa interface Horarios
  const handleHorarioChange = (dia: keyof Horarios, valor: number | number[]) => {
    setHorarios(prev => ({ ...prev, [dia]: valor as [number, number] }));
  };

  const handleToggleFechado = (dia: keyof Horarios) => {
    const novoValor = horarios[dia] === null ? [1080, 1380] : null;
    setHorarios(prev => ({ ...prev, [dia]: novoValor }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="card">
      <h3>Horário de Funcionamento</h3>
      <form onSubmit={handleFormSubmit}>
        <div className="horarios-container">
          {/* Aqui, informamos ao TypeScript que as chaves são do tipo 'keyof Horarios' */}
          {(Object.keys(horarios) as Array<keyof Horarios>).map((dia) => (
            <div className="horario-dia" key={dia}>
              <div className="dia-header">
                <label style={{textTransform: 'capitalize'}}>{dia}</label>
                <div className='dia-info'>
                  <span>{horarios[dia] ? `${formatTime(horarios[dia]![0])} - ${formatTime(horarios[dia]![1])}` : 'Fechado'}</span>
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