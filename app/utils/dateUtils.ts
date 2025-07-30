interface Horarios {
  [key: string]: [number, number] | null;
}

interface BarStatus {
  text: string;
  color: string;
}

export const isBarOpen = (horarios?: Horarios): BarStatus => {
  if (!horarios) return { text: 'Horário indisponível', color: '#6c757d' };

  const now = new Date();
  const dayOfWeek = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][now.getDay()];
  
  const horarioDoDia = horarios[dayOfWeek];
  if (horarioDoDia === null || !Array.isArray(horarioDoDia)) {
      return { text: 'Fechado', color: '#dc3545' };
  }

  const [startMinutes, endMinutes] = horarioDoDia;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
      return { text: 'Aberto', color: '#28a745' };
  } else {
      return { text: 'Fechado', color: '#dc3545' };
  }
};