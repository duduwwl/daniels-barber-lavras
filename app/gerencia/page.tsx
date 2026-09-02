import type { Metadata } from 'next';
import ManagementDashboard from '../components/ManagementDashboard';

export const metadata: Metadata = {
  title: "Gerência de agendamentos | Daniel's Barber",
  description: 'Painel interno para organização dos atendimentos da equipe.',
};

export default function ManagementPage() {
  return <ManagementDashboard />;
}
