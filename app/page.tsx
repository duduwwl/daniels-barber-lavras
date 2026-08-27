'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Service = { id: string; name: string; short: string; duration: number; description: string };

const services: Service[] = [
  { id: 'cabelo', name: 'Corte de cabelo', short: 'Cabelo', duration: 45, description: 'Corte personalizado, acabamento e finalização.' },
  { id: 'cabelo-barba', name: 'Cabelo + barba', short: 'Cabelo + barba', duration: 60, description: 'Visual completo com corte, desenho e alinhamento da barba.' },
  { id: 'completo', name: 'Cabelo + sobrancelha + barba', short: 'Experiência completa', duration: 75, description: 'Todos os detalhes alinhados em uma única experiência.' },
  { id: 'barba', name: 'Somente barba', short: 'Barba', duration: 30, description: 'Desenho, alinhamento e acabamento preciso.' },
];

const barbers = [
  { id: 'daniel', name: 'Daniel', initials: 'DA', role: 'Mestre barbeiro', specialty: 'Clássicos, degradê e visagismo', number: '01' },
  { id: 'vinicius', name: 'Vinícius', initials: 'VI', role: 'Barbeiro especialista', specialty: 'Fade, freestyle e barba', number: '02' },
];

const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

function formatLongDate(value: string) {
  if (!value) return 'Escolha uma data';
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(parseLocalDate(value));
}

function calendarStamp(date: string, time: string, addMinutes = 0) {
  const [hour, minute] = time.split(':').map(Number);
  const total = hour * 60 + minute + addMinutes;
  return `${date.replaceAll('-', '')}T${String(Math.floor(total / 60)).padStart(2, '0')}${String(total % 60).padStart(2, '0')}00`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [serviceId, setServiceId] = useState(services[0].id);
  const [barberId, setBarberId] = useState(barbers[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [formError, setFormError] = useState('');

  const selectedService = services.find((service) => service.id === serviceId)!;
  const selectedBarber = barbers.find((barber) => barber.id === barberId)!;

  const nextDates = useMemo(() => {
    const result: Date[] = [];
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);
    while (result.length < 12) {
      if (cursor.getDay() !== 0) result.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return result;
  }, []);

  const times = useMemo(() => {
    if (!date) return [];
    const day = parseLocalDate(date).getDay();
    if (day === 0) return [];
    const open = 8 * 60 + 30;
    const close = day === 6 ? 14 * 60 : 18 * 60 + 30;
    const slots: string[] = [];
    for (let current = open; current + selectedService.duration <= close; current += 30) {
      slots.push(`${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`);
    }
    return slots;
  }, [date, selectedService.duration]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setTime('');
    setConfirmed(false);
  }, [serviceId, barberId, date]);

  const googleCalendarUrl = useMemo(() => {
    if (!date || !time) return '#';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${selectedService.name} — Daniel's Barber`,
      dates: `${calendarStamp(date, time)}/${calendarStamp(date, time, selectedService.duration)}`,
      details: `Atendimento com ${selectedBarber.name}. Chegue 5 minutos antes do horário.`,
      location: 'Daniel’s Barber — Lavras, MG',
      ctz: 'America/Sao_Paulo',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [date, time, selectedService, selectedBarber]);

  function confirmBooking(event: FormEvent) {
    event.preventDefault();
    if (!date || !time || !name.trim() || !phone.trim()) {
      setFormError('Preencha seu nome, WhatsApp, data e horário para continuar.');
      return;
    }
    setFormError('');
    setConfirmed(true);
  }

  function downloadIcs() {
    if (!date || !time) return;
    const contents = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Daniels Barber//Agendamento//PT-BR', 'BEGIN:VEVENT',
      `DTSTART;TZID=America/Sao_Paulo:${calendarStamp(date, time)}`,
      `DTEND;TZID=America/Sao_Paulo:${calendarStamp(date, time, selectedService.duration)}`,
      `SUMMARY:${selectedService.name} — Daniel's Barber`,
      `DESCRIPTION:Atendimento com ${selectedBarber.name}. Chegue 5 minutos antes do horário.`,
      'LOCATION:Daniel’s Barber — Lavras\, MG', 'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([contents], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agendamento-daniels-barber.ics';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="#inicio" aria-label="Daniel's Barber — início" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">DB</span>
          <span><strong>DANIEL&apos;S</strong><small>BARBER · LAVRAS</small></span>
        </a>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Navegação principal">
          <a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a>
          <a href="#servicos" onClick={() => setMenuOpen(false)}>Serviços</a>
          <a href="#equipe" onClick={() => setMenuOpen(false)}>Barbeiros</a>
          <a href="#agendar" onClick={() => setMenuOpen(false)}>Agenda</a>
          <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
        </nav>
        <a className="nav-cta" href="#agendar">Agendar horário <span>↗</span></a>
        <button className={`menu-button ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Abrir menu">
          <i /><i />
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Tradição, precisão & estilo</p>
          <h1>Seu estilo.<br /><em>Nossa assinatura.</em></h1>
          <p className="hero-text">Cortes impecáveis, barba alinhada e uma experiência feita para quem valoriza cada detalhe.</p>
          <div className="hero-actions">
            <a className="button-primary" href="#agendar">Agendar agora <span>→</span></a>
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
            <button key={service.id} className="service-row" onClick={() => { setServiceId(service.id); document.querySelector('#agendar')?.scrollIntoView(); }}>
              <span className="service-index">0{index + 1}</span>
              <span className="service-main"><strong>{service.name}</strong><small>{service.description}</small></span>
              <span className="service-time">{service.duration} MIN</span>
              <span className="service-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-art" aria-hidden="true">
          <div className="blade"><span /><span /><span /></div>
          <p>DESDE<br /><strong>2024</strong></p>
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

      <section className="team-section" id="equipe">
        <div className="section-heading dark-heading">
          <div><p className="eyebrow"><span /> Quem faz acontecer</p><h2>Escolha quem vai<br /><em>assinar seu estilo.</em></h2></div>
          <a className="button-link" href="#agendar">Ver agenda disponível <span>↘</span></a>
        </div>
        <div className="team-grid">
          {barbers.map((barber) => (
            <button key={barber.id} className={`barber-card ${barberId === barber.id ? 'selected' : ''}`} onClick={() => { setBarberId(barber.id); document.querySelector('#agendar')?.scrollIntoView(); }}>
              <span className="barber-number">{barber.number}</span>
              <span className="barber-portrait"><b>{barber.initials}</b><i /></span>
              <span className="barber-info"><small>{barber.role}</small><strong>{barber.name}</strong><em>{barber.specialty}</em></span>
              <span className="choose-label">Escolher {barber.name} <i>↗</i></span>
            </button>
          ))}
        </div>
      </section>

      <section className="booking-section" id="agendar">
        <div className="booking-intro">
          <p className="eyebrow dark"><span /> Agendamento online</p>
          <h2>Seu horário,<br /><em>sem espera.</em></h2>
          <p>Escolha o serviço, o profissional e o melhor horário. Ao finalizar, adicione o compromisso ao Google Agenda, Apple Calendar ou Outlook.</p>
          <div className="booking-hours">
            <div><span>Segunda — sexta</span><strong>08:30 — 18:30</strong></div>
            <div><span>Sábado</span><strong>08:30 — 14:00</strong></div>
            <div><span>Domingo</span><strong>Fechado</strong></div>
          </div>
        </div>

        <form className="booking-card" onSubmit={confirmBooking}>
          {!confirmed ? (
            <>
              <div className="booking-card-head"><span>AGENDAR HORÁRIO</span><small>Lavras · MG</small></div>

              <fieldset>
                <legend><b>01</b> Escolha o serviço</legend>
                <div className="choice-grid service-choices">
                  {services.map((service) => (
                    <label key={service.id} className={serviceId === service.id ? 'checked' : ''}>
                      <input type="radio" name="service" value={service.id} checked={serviceId === service.id} onChange={() => setServiceId(service.id)} />
                      <span><strong>{service.short}</strong><small>{service.duration} min</small></span><i>✓</i>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend><b>02</b> Escolha o barbeiro</legend>
                <div className="choice-grid barber-choices">
                  {barbers.map((barber) => (
                    <label key={barber.id} className={barberId === barber.id ? 'checked' : ''}>
                      <input type="radio" name="barber" value={barber.id} checked={barberId === barber.id} onChange={() => setBarberId(barber.id)} />
                      <span className="mini-avatar">{barber.initials}</span><span><strong>{barber.name}</strong><small>{barber.role}</small></span><i>✓</i>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend><b>03</b> Escolha o dia</legend>
                <div className="date-strip">
                  {nextDates.map((item) => {
                    const iso = toIsoDate(item);
                    return <button type="button" key={iso} className={date === iso ? 'active' : ''} onClick={() => setDate(iso)}><small>{weekDays[item.getDay()]}</small><strong>{String(item.getDate()).padStart(2, '0')}</strong><span>{monthNames[item.getMonth()]}</span></button>;
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend><b>04</b> Escolha o horário</legend>
                {date ? <div className="time-grid">{times.map((slot) => <button type="button" key={slot} className={time === slot ? 'active' : ''} onClick={() => setTime(slot)}>{slot}</button>)}</div> : <p className="empty-slots">Selecione um dia para ver os horários disponíveis.</p>}
              </fieldset>

              <fieldset>
                <legend><b>05</b> Seus dados</legend>
                <div className="client-fields">
                  <label><span>Seu nome</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos te chamar?" autoComplete="name" /></label>
                  <label><span>WhatsApp</span><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(35) 99999-9999" inputMode="tel" autoComplete="tel" /></label>
                </div>
              </fieldset>

              <div className="booking-summary">
                <div><small>SEU AGENDAMENTO</small><strong>{selectedService.short} com {selectedBarber.name}</strong><span>{date ? formatLongDate(date) : 'Escolha uma data'}{time ? `, às ${time}` : ''}</span></div>
                <button type="submit">Confirmar horário <span>→</span></button>
              </div>
              {formError && <p className="form-error" role="alert">{formError}</p>}
            </>
          ) : (
            <div className="success-state" role="status">
              <span className="success-icon">✓</span>
              <p className="eyebrow dark"><span /> Horário selecionado</p>
              <h3>Até breve,<br /><em>{name.split(' ')[0]}.</em></h3>
              <p className="success-copy">Seu atendimento de <strong>{selectedService.short}</strong> com <strong>{selectedBarber.name}</strong> está marcado para <strong>{formatLongDate(date)}, às {time}</strong>.</p>
              <div className="calendar-actions">
                <a href={googleCalendarUrl} target="_blank" rel="noreferrer">Adicionar ao Google Agenda <span>↗</span></a>
                <button type="button" onClick={downloadIcs}>Apple / Outlook (.ics) <span>↓</span></button>
              </div>
              <p className="calendar-note">Os dados de contato ficam apenas nesta tela. Use o calendário para guardar seu compromisso.</p>
              <button type="button" className="new-booking" onClick={() => setConfirmed(false)}>← Alterar agendamento</button>
            </div>
          )}
        </form>
      </section>

      <section className="principles">
        <p className="eyebrow"><span /> O padrão Daniel&apos;s</p>
        <h2>Sem pressa no detalhe.<br /><em>Sem atraso no horário.</em></h2>
        <div className="principles-grid">
          <div><span>01</span><strong>Consulta rápida</strong><p>Entendemos o resultado que você procura antes de começar.</p></div>
          <div><span>02</span><strong>Técnica precisa</strong><p>Execução cuidadosa, produtos de qualidade e acabamento limpo.</p></div>
          <div><span>03</span><strong>Finalização</strong><p>Orientação simples para manter seu estilo bem cuidado em casa.</p></div>
        </div>
      </section>

      <section className="contact-section" id="contato">
        <div className="contact-place"><span>LAVRAS</span><strong>MG</strong><i>21°14&apos;43&quot;S · 44°59&apos;59&quot;O</i></div>
        <div className="contact-copy">
          <p className="eyebrow dark"><span /> Onde o estilo acontece</p>
          <h2>No coração de<br /><em>Lavras.</em></h2>
          <p>Atendimento de segunda a sábado, com hora marcada, ambiente confortável e atenção em cada detalhe.</p>
          <a className="dark-button" href="#agendar">Reservar meu horário <span>↗</span></a>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark">DB</span><div><strong>DANIEL&apos;S BARBER</strong><small>ESTILO COM ASSINATURA</small></div></div>
        <div className="footer-links"><a href="#servicos">Serviços</a><a href="#equipe">Barbeiros</a><a href="#agendar">Agendamento</a><a href="#contato">Contato</a></div>
        <div className="footer-hours"><small>SEG — SEX</small><span>08:30 — 18:30</span><small>SÁBADO</small><span>08:30 — 14:00</span></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Daniel&apos;s Barber</span><span>Lavras · Minas Gerais · Brasil</span><a href="#inicio">Voltar ao topo ↑</a></div>
      </footer>
    </main>
  );
}
