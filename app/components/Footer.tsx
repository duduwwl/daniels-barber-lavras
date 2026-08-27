export default function Footer() {
  return (
    <footer>
      <div className="footer-brand"><span className="brand-mark">DB</span><div><strong>DANIEL&apos;S BARBER</strong><small>ESTILO COM ASSINATURA</small></div></div>
      <div className="footer-links"><a href="/#servicos">Serviços</a><a href="/#barbearia">A barbearia</a><a href="/agendar">Agendamento</a><a href="/#contato">Contato</a></div>
      <div className="footer-hours"><small>SEG — SEX</small><span>08:30 — 18:30</span><small>SÁBADO</small><span>08:30 — 14:00</span></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Daniel&apos;s Barber</span><span>Lavras · Minas Gerais · Brasil</span><a href="#inicio">Voltar ao topo ↑</a></div>
    </footer>
  );
}
