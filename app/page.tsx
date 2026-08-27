import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { services } from './data';

export default function Home() {
  return (
    <main>
      <Navbar />

      <section className="hero" id="inicio">
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Tradição, precisão & estilo</p>
          <h1>Seu estilo.<br /><em>Nossa assinatura.</em></h1>
          <p className="hero-text">Cortes impecáveis, barba alinhada e uma experiência feita para quem valoriza cada detalhe.</p>
          <div className="hero-actions">
            <a className="button-primary" href="/agendar#reservar">Reservar cadeira <span>→</span></a>
            <a className="button-link" href="#servicos">Conheça os serviços <span>↘</span></a>
          </div>
          <div className="hero-meta">
            <div><strong>SEG — SEX</strong><span>08:30 — 18:30</span></div>
            <div><strong>SÁBADO</strong><span>08:30 — 14:00</span></div>
            <div><strong>LOCAL</strong><span>Lavras, MG</span></div>
          </div>
        </div>
        <div className="hero-visual" aria-label="Ambiente sofisticado de barbearia">
          <div className="arch">
            <div className="arch-light" />
            <div className="chair"><span className="headrest" /><span className="seat" /><span className="base" /></div>
            <span className="visual-number">01</span>
          </div>
          <p className="visual-caption">A experiência Daniel&apos;s<br />começa antes do corte.</p>
        </div>
        <div className="scroll-cue"><span>DESCUBRA</span><i /></div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div><span>CORTE DE PRECISÃO</span><b>✦</b><span>BARBA & ESTILO</span><b>✦</b><span>EXPERIÊNCIA DANIEL&apos;S</span><b>✦</b><span>CORTE DE PRECISÃO</span><b>✦</b><span>BARBA & ESTILO</span><b>✦</b></div>
      </div>

      <section className="services-section section-light" id="servicos">
        <div className="section-heading">
          <div><p className="eyebrow dark"><span /> Menu de serviços</p><h2>Escolha sua<br /><em>melhor versão.</em></h2></div>
          <p>Do clássico ao contemporâneo, cada serviço é pensado para respeitar seu estilo e valorizar sua identidade.</p>
        </div>
        <div className="service-list">
          {services.map((service, index) => (
            <a key={service.id} className="service-row" href={`/agendar?servico=${service.id}#reservar`}>
              <span className="service-index">0{index + 1}</span>
              <span className="service-main"><strong>{service.name}</strong><small>{service.description}</small></span>
              <span className="service-time">{service.duration} MIN</span>
              <span className="service-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="manifesto" id="barbearia">
        <div className="manifesto-art" aria-hidden="true">
          <div className="blade"><span /><span /><span /></div>
          <p>FEITO EM<br /><strong>LAVRAS</strong></p>
        </div>
        <div className="manifesto-copy">
          <p className="eyebrow"><span /> Mais que um corte</p>
          <h2>Um ritual de<br /><em>confiança.</em></h2>
          <p>Na Daniel&apos;s Barber, técnica e atenção caminham juntas. Cada atendimento começa com uma boa conversa e termina com um resultado que combina com você.</p>
          <div className="manifesto-points">
            <div><b>01</b><span><strong>Atendimento personalizado</strong><small>Seu rosto, rotina e estilo guiam cada escolha.</small></span></div>
            <div><b>02</b><span><strong>Precisão nos detalhes</strong><small>Acabamento impecável em todos os ângulos.</small></span></div>
            <div><b>03</b><span><strong>Ambiente preparado</strong><small>Conforto, pontualidade e cuidado do início ao fim.</small></span></div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contato">
        <div className="contact-place"><span>LAVRAS</span><strong>MG</strong><i>MINAS GERAIS · BRASIL</i></div>
        <div className="contact-copy">
          <p className="eyebrow dark"><span /> Onde o estilo acontece</p>
          <h2>No coração de<br /><em>Lavras.</em></h2>
          <p>Atendimento de segunda a sábado, com hora marcada, ambiente confortável e atenção em cada detalhe.</p>
          <a className="dark-button" href="/agendar#reservar">Reservar meu horário <span>↗</span></a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
