export type Service = {
  id: string;
  name: string;
  short: string;
  duration: number;
  description: string;
};

export const services: Service[] = [
  { id: 'cabelo', name: 'Corte de cabelo', short: 'Cabelo', duration: 45, description: 'Corte personalizado, acabamento e finalização.' },
  { id: 'cabelo-barba', name: 'Cabelo + barba', short: 'Cabelo + barba', duration: 60, description: 'Visual completo com corte, desenho e alinhamento da barba.' },
  { id: 'completo', name: 'Cabelo + barba + sobrancelha', short: 'Cabelo + barba + sobrancelha', duration: 75, description: 'Todos os detalhes alinhados em uma única experiência.' },
  { id: 'barba', name: 'Somente barba', short: 'Barba', duration: 30, description: 'Desenho, alinhamento e acabamento preciso.' },
];

export const barbers = [
  { id: 'daniel', name: 'Daniel', initials: 'DA', role: 'Mestre barbeiro', specialty: 'Clássicos, degradê e visagismo', number: '01' },
  { id: 'vinicius', name: 'Vinícius', initials: 'VI', role: 'Barbeiro especialista', specialty: 'Fade, freestyle e barba', number: '02' },
];
