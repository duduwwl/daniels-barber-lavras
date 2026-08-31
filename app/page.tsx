import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <main>
      <Navbar />

      <section className="hero" id="inicio">
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Técnica local. Resultado preciso.</p>
          <h1>Corte bem feito.<br /><em>Presença que fica.</em></h1>
          <p className="hero-text">Na Daniel&apos;s, o atendimento começa entendendo seu estilo. Degradê, barba e acabamento executados com atenção — sem pressa no corte e sem complicação para agendar.</p>
          <div className="hero-actions">
            <a className="button-primary" href="/agendar#reservar">Reservar horário <span>→</span></a>
          </div>
          <div className="hero-meta">
            <div><strong>SEG — SEX</strong><span>08:30 — 18:30</span></div>
            <div><strong>SÁBADO</strong><span>08:30 — 14:00</span></div>
            <div><strong>ENDEREÇO</strong><span>Álvaro A. Leite, 657</span></div>
          </div>
        </div>
        <div className="hero-visual" aria-label="Barbeiro realizando um corte de precisão">
          <div className="arch">
            <img className="hero-photo" src="/hero-barber.png" alt="Barbeiro realizando um corte com máquina em um cliente" />
            <div className="photo-shade" aria-hidden="true" />
          </div>
          <p className="visual-caption">Técnica, conversa e acabamento.<br />Do jeito que um bom corte deve ser.</p>
        </div>
        <div className="scroll-cue"><span>DESCUBRA</span><i /></div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div><span>CORTE DE PRECISÃO</span><b>✦</b><span>BARBA & ESTILO</span><b>✦</b><span>EXPERIÊNCIA DANIEL&apos;S</span><b>✦</b><span>CORTE DE PRECISÃO</span><b>✦</b><span>BARBA & ESTILO</span><b>✦</b></div>
      </div>

      <section className="manifesto" id="barbearia">
        <div className="manifesto-art">
          <img className="manifesto-logo" src="/logo-instagram.jpg" alt="Logo oficial Daniel's Barber" />
          <p><span>IDENTIDADE OFICIAL</span><strong>DANIEL&apos;S BARBER</strong></p>
        </div>
        <div className="manifesto-copy">
          <p className="eyebrow"><span /> Mais que um corte</p>
          <h2>Bom atendimento.<br /><em>Sem personagem.</em></h2>
          <p>Uma barbearia de verdade: conversa direta, técnica apurada e atenção ao resultado. Do corte infantil ao degradê e à barba, cada serviço parte do que combina com você.</p>
          <div className="manifesto-points">
            <div><b>01</b><span><strong>Atendimento personalizado</strong><small>Seu rosto, rotina e estilo guiam cada escolha.</small></span></div>
            <div><b>02</b><span><strong>Precisão nos detalhes</strong><small>Acabamento impecável em todos os ângulos.</small></span></div>
            <div><b>03</b><span><strong>Ambiente preparado</strong><small>Conforto, pontualidade e cuidado do início ao fim.</small></span></div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contato">
        <div className="contact-place contact-profile">
          <p className="eyebrow"><span /> Visite a Daniel&apos;s</p>
          <h2>Av. Álvaro Augusto<br />Leite, 657</h2>
          <div className="contact-details">
            <a href="https://www.instagram.com/danielsbarber_04/" target="_blank" rel="noreferrer"><small>INSTAGRAM</small><strong>@danielsbarber_04</strong><span>↗</span></a>
            <a href="https://wa.me/5535998416060" target="_blank" rel="noreferrer"><small>WHATSAPP</small><strong>(35) 99841-6060</strong><span>↗</span></a>
          </div>
        </div>
        <div className="contact-copy">
          <img className="contact-logo" src="/logo-instagram.jpg" alt="Daniel's Barber" />
          <p className="eyebrow dark"><span /> Informação direta</p>
          <h2>Chegue no horário.<br /><em>Saia alinhado.</em></h2>
          <p>Escolha o serviço, Daniel ou Vinícius e o melhor momento para você. O agendamento fica pronto em poucos passos e pode ser salvo no seu calendário.</p>
          <a className="dark-button" href="/agendar#reservar">Reservar horário <span>↗</span></a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
