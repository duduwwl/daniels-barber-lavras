'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { barbers, services } from '../data';
import Footer from './Footer';
import Navbar from './Navbar';

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

export default function BookingExperience() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [barberId, setBarberId] = useState(barbers[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [formError, setFormError] = useState('');
  const [dateError, setDateError] = useState('');

  const selectedService = services.find((service) => service.id === serviceId)!;
  const selectedBarber = barbers.find((barber) => barber.id === barberId)!;

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('servico');
    if (requested && services.some((service) => service.id === requested)) setServiceId(requested);
  }, []);

  useEffect(() => {
    setTime('');
    setConfirmed(false);
  }, [serviceId, barberId, date]);

  const nextDates = useMemo(() => {
    const result: Date[] = [];
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);
    while (result.length < 60) {
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

  function chooseBarber(id: string) {
    setBarberId(id);
    document.querySelector('#reservar')?.scrollIntoView({ behavior: 'smooth' });
  }

  function chooseDate(value: string) {
    if (!value) return;
    if (parseLocalDate(value).getDay() === 0) {
      setDateError('A barbearia não abre aos domingos. Escolha outra data.');
      return;
    }
    setDateError('');
    setDate(value);
  }

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
    <main className="booking-page" id="inicio">
      <Navbar />

      <section className="booking-page-hero">
        <div className="booking-route"><span>AGENDA ONLINE</span><b>02 / 02</b></div>
        <div className="booking-hero-copy">
          <p className="eyebrow"><span /> Reserva exclusiva</p>
          <h1>Escolha. Reserve.<br /><em>Chegue no horário.</em></h1>
        </div>
        <div className="booking-hero-aside">
          <p>Uma página dedicada ao seu atendimento. Selecione o profissional, o serviço e o melhor horário em poucos passos.</p>
          <a href="#reservar">Começar agendamento <span>↓</span></a>
        </div>
      </section>

      <section className="team-section booking-page-team" id="profissionais">
        <div className="section-heading dark-heading">
          <div><p className="eyebrow"><span /> Profissionais</p><h2>Quem vai cuidar<br /><em>do seu estilo?</em></h2></div>
          <p>Escolha o profissional com quem deseja reservar. Você poderá alterar sua escolha durante o agendamento.</p>
        </div>
        <div className="team-grid">
          {barbers.map((barber) => (
            <button key={barber.id} className={`barber-card ${barberId === barber.id ? 'selected' : ''}`} onClick={() => chooseBarber(barber.id)}>
              <span className="barber-number">{barber.number}</span>
              <span className="barber-portrait"><b>{barber.initials}</b><i /></span>
              <span className="barber-info"><small>{barber.role}</small><strong>{barber.name}</strong><em>{barber.specialty}</em></span>
              <span className="choose-label">Reservar com {barber.name} <i>↗</i></span>
            </button>
          ))}
        </div>
      </section>

      <section className="booking-section" id="reservar">
        <div className="booking-intro">
          <p className="eyebrow dark"><span /> Agendamento online</p>
          <h2>Sua cadeira.<br /><em>Seu horário.</em></h2>
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
              <div className="booking-card-head"><span>RESERVAR CADEIRA</span><small>Lavras · MG</small></div>
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
                <div className="date-picker-row">
                  <label>
                    <span>ABRIR CALENDÁRIO COMPLETO</span>
                    <input type="date" min={toIsoDate(new Date())} value={date} onChange={(event) => chooseDate(event.target.value)} aria-label="Escolher qualquer data futura" />
                  </label>
                  <p>{dateError || 'Disponível de segunda a sábado. Use o calendário ou role as sugestões abaixo.'}</p>
                </div>
                <div className="date-strip">
                  {nextDates.map((item) => {
                    const iso = toIsoDate(item);
                    return <button type="button" key={iso} className={date === iso ? 'active' : ''} onClick={() => chooseDate(iso)}><small>{weekDays[item.getDay()]}</small><strong>{String(item.getDate()).padStart(2, '0')}</strong><span>{monthNames[item.getMonth()]}</span></button>;
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

      <Footer />
    </main>
  );
}
