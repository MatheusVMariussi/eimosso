import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Bar } from './useBarData';

// Interface para o objeto de horários
export interface Horarios {
  segunda: [number, number] | null;
  terca: [number, number] | null;
  quarta: [number, number] | null;
  quinta: [number, number] | null;
  sexta: [number, number] | null;
  sabado: [number, number] | null;
  domingo: [number, number] | null;
}

const initialHorarios: Horarios = {
    segunda: null, terca: null, quarta: null, quinta: null, sexta: null, sabado: null, domingo: null,
};

export function useHorarios(bar: Bar | null) {
  const [horarios, setHorarios] = useState<Horarios>(initialHorarios);

  // Efeito para carregar os horários do bar quando o bar muda
  useEffect(() => {
    if (bar?.horarios) {
      // Mescla os horários salvos com o estado inicial para garantir que todos os dias existam
      setHorarios(prev => ({ ...initialHorarios, ...bar.horarios }));
    }
  }, [bar]);

  // Função para salvar os horários no Firestore
  const saveHorarios = async () => {
    if (!bar) return;
    try {
      const barDocRef = doc(db, 'bares', bar.id);
      await updateDoc(barDocRef, { horarios });
      alert('Horários de funcionamento salvos com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar horários: ", error);
      alert("Não foi possível salvar os horários.");
    }
  };

  return { horarios, setHorarios, saveHorarios };
}