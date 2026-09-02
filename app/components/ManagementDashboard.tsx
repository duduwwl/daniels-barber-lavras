'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, LogIn, MessageCircle, RefreshCw, Scissors, UserRound } from 'lucide-react';
import { appointmentApiUrl, productionSiteOrigin } from '../api-base';
import { barbers } from '../data';
import { sitePath } from '../site-path';

type AppointmentStatus = 'confirmado' | 'concluido' | 'cancelado' | 'faltou';

type Appointment = {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_id: string;
  service_name: string;
  duration: number;
  barber_id: string;
  barber_name: string;
  appointment_date: string;
  start_time: string;
  status: AppointmentStatus;
  notes: string;
  created_at: string;
  updated_at: string;
};

const statusLabels: Record<AppointmentStatus, string> = {
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  faltou: 'Não compareceu',
};

function todayIso() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
    .format(new Date(`${value}T12:00:00`));
}

function whatsappUrl(phone: string, name: string, time: string) {
  const digits = phone.replace(/\D/g, '');
  const number = digits.startsWith('55') ? digits : `55${digits}`;
  const message = encodeURIComponent(`Olá, ${name}! Confirmamos seu horário na Daniel's Barber às ${time}.`);
  return `https://wa.me/${number}?text=${message}`;
}

export default function ManagementDashboard() {
  const [date, setDate] = useState(todayIso);
  const [barber, setBarber] = useState('todos');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ date });
      if (barber !== 'todos') params.set('barber', barber);
      const response = await fetch(appointmentApiUrl(`/api/appointments?${params}`), {
        credentials: 'include',
        cache: 'no-store',
      });
      if (response.status === 401) {
        setUnauthorized(true);
        setAppointments([]);
        return;
      }
      const data = await response.json() as { appointments?: Appointment[]; error?: string };
      if (!response.ok) throw new Error(data.error || 'Não foi possível carregar a agenda.');
      setUnauthorized(false);
      setAppointments(data.appointments ?? []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível carregar a agenda.');
    } finally {
      setLoading(false);
    }
  }, [barber, date]);

  useEffect(() => {
    if (window.location.hostname.endsWith('github.io')) {
      window.location.replace(`${productionSiteOrigin}/gerencia`);
      return;
    }
    const timer = window.setTimeout(() => void loadAppointments(), 0);
    return () => window.clearTimeout(timer);
  }, [loadAppointments]);

  const metrics = useMemo(() => ({
    total: appointments.length,
    active: appointments.filter((item) => item.status === 'confirmado').length,
    complete: appointments.filter((item) => item.status === 'concluido').length,
    minutes: appointments.filter((item) => item.status !== 'cancelado').reduce((sum, item) => sum + item.duration, 0),
  }), [appointments]);

  async function updateAppointment(appointment: Appointment, changes: Partial<Pick<Appointment, 'status' | 'notes'>>) {
    const updated = { ...appointment, ...changes };
    setSavingId(appointment.id);
    setError('');
    try {
      const response = await fetch(appointmentApiUrl(), {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appointment.id, status: updated.status, notes: updated.notes }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Não foi possível atualizar o atendimento.');
      setAppointments((current) => current.map((item) => item.id === appointment.id ? updated : item));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível atualizar o atendimento.');
    } finally {
      setSavingId('');
    }
  }

  if (unauthorized) {
    return (
      <main className="management-login">
        <div className="management-login-card">
          <img src={sitePath('/logo-crisp.png')} alt="Daniel's Barber" />
          <p className="management-kicker">ÁREA INTERNA</p>
          <h1>Gerência de<br /><em>agendamentos.</em></h1>
          <p>Entre com a conta autorizada da barbearia para consultar clientes e organizar os atendimentos.</p>
          <a href="/signin-with-chatgpt?return_to=/gerencia" target="_top"><LogIn size={17} aria-hidden="true" /> Entrar com segurança</a>
          <a className="management-back" href={sitePath('/')}><ArrowLeft size={14} aria-hidden="true" /> Voltar ao site</a>
        </div>
      </main>
    );
  }

  return (
    <main className="management-page">
      <header className="management-topbar">
        <a className="management-brand" href={sitePath('/')}>
          <img src={sitePath('/logo-crisp.png')} alt="" aria-hidden="true" />
          <span><strong>DANIEL&apos;S</strong><small>PAINEL DA EQUIPE</small></span>
        </a>
        <div><span className="management-live"><i /> Agenda sincronizada</span><a href={sitePath('/')}><ArrowLeft size={14} /> Voltar ao site</a></div>
      </header>

      <section className="management-shell">
        <div className="management-heading">
          <div><p className="management-kicker">CONTROLE DE ATENDIMENTOS</p><h1>Agenda da<br /><em>barbearia.</em></h1></div>
          <p>Organize o fluxo do dia, confirme clientes e mantenha Daniel e Vinícius alinhados em uma única visão.</p>
        </div>

        <div className="management-toolbar">
          <label><span>DATA DA AGENDA</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <label><span>PROFISSIONAL</span><select value={barber} onChange={(event) => setBarber(event.target.value)}><option value="todos">Todos os barbeiros</option>{barbers.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
          <button type="button" onClick={() => void loadAppointments()} disabled={loading}><RefreshCw size={16} className={loading ? 'is-spinning' : ''} /> Atualizar agenda</button>
        </div>

        <div className="management-metrics" aria-label="Resumo da agenda">
          <article><span><CalendarDays size={17} /> Agendamentos</span><strong>{metrics.total.toString().padStart(2, '0')}</strong><small>{formatDate(date)}</small></article>
          <article><span><Clock3 size={17} /> Aguardando</span><strong>{metrics.active.toString().padStart(2, '0')}</strong><small>horários confirmados</small></article>
          <article><span><CheckCircle2 size={17} /> Concluídos</span><strong>{metrics.complete.toString().padStart(2, '0')}</strong><small>atendimentos finalizados</small></article>
          <article><span><Scissors size={17} /> Ocupação</span><strong>{Math.floor(metrics.minutes / 60)}h{String(metrics.minutes % 60).padStart(2, '0')}</strong><small>tempo reservado</small></article>
        </div>

        <section className="management-agenda">
          <div className="management-agenda-head"><div><span>AGENDA DO DIA</span><h2>{formatDate(date)}</h2></div><small>{barber === 'todos' ? 'Toda a equipe' : barbers.find((item) => item.id === barber)?.name}</small></div>
          {error && <p className="management-error" role="alert">{error}</p>}
          {loading ? (
            <div className="management-empty"><RefreshCw className="is-spinning" /><strong>Carregando a agenda</strong><span>Buscando os horários mais recentes.</span></div>
          ) : appointments.length === 0 ? (
            <div className="management-empty"><CalendarDays /><strong>Nenhum horário nesta data</strong><span>Os próximos agendamentos aparecerão aqui automaticamente.</span></div>
          ) : (
            <div className="management-list">
              {appointments.map((appointment) => (
                <article className={`appointment-card status-${appointment.status}`} key={appointment.id}>
                  <div className="appointment-time"><strong>{appointment.start_time}</strong><span>{appointment.duration} MIN</span></div>
                  <div className="appointment-main">
                    <div className="appointment-client"><span><UserRound size={16} /> CLIENTE</span><strong>{appointment.customer_name}</strong><a href={whatsappUrl(appointment.customer_phone, appointment.customer_name, appointment.start_time)} target="_blank" rel="noreferrer"><MessageCircle size={14} /> {appointment.customer_phone}</a></div>
                    <div className="appointment-service"><span><Scissors size={16} /> SERVIÇO</span><strong>{appointment.service_name}</strong><small>com {appointment.barber_name}</small></div>
                  </div>
                  <div className="appointment-actions">
                    <label><span>STATUS</span><select value={appointment.status} disabled={savingId === appointment.id} onChange={(event) => void updateAppointment(appointment, { status: event.target.value as AppointmentStatus })}>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
                    <label><span>OBSERVAÇÃO</span><textarea defaultValue={appointment.notes} placeholder="Preferências ou observações do cliente" onBlur={(event) => { if (event.target.value !== appointment.notes) void updateAppointment(appointment, { notes: event.target.value }); }} /></label>
                    <small>{savingId === appointment.id ? 'Salvando…' : statusLabels[appointment.status]}</small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
