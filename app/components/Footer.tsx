import { LogIn } from 'lucide-react';
import { sitePath } from '../site-path';

export default function Footer() {
  return (
    <footer>
      <div className="footer-brand"><img className="brand-mark" src={sitePath('/logo-crisp.png')} alt="Logo Daniel's Barber" /><div><strong>DANIEL&apos;S BARBER</strong><small>ESTILO COM ASSINATURA</small></div></div>
      <div className="footer-links"><a href={sitePath('/#barbearia')}>A barbearia</a><a href={sitePath('/agendar')}>Agendamento</a><a href={sitePath('/gerencia')}>Área da equipe</a><a href="https://www.instagram.com/danielsbarber_04/" target="_blank" rel="noreferrer">Instagram</a><a href="https://wa.me/5535998416060" target="_blank" rel="noreferrer">WhatsApp</a></div>
      <div className="footer-hours"><small>SEG — SEX</small><span>08:30 — 18:30</span><small>SÁBADO</small><span>08:30 — 14:00</span></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Daniel&apos;s Barber</span><span>Av. Álvaro Augusto Leite, 657</span><a href="#inicio">Voltar ao topo ↑</a></div>
      <a className="manager-login-fab" href={sitePath('/gerencia')} aria-label="Entrar na gerência de agendamentos" title="Gerência de agendamentos">
        <LogIn size={17} aria-hidden="true" />
        <span>Gerência</span>
      </a>
    </footer>
  );
}
