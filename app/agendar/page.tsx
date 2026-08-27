import type { Metadata } from 'next';
import BookingExperience from '../components/BookingExperience';

export const metadata: Metadata = {
  title: "Agendamento | Daniel's Barber",
  description: 'Escolha seu serviço, barbeiro e horário na Daniel’s Barber em Lavras, MG.',
};

export default function BookingPage() {
  return <BookingExperience />;
}
