import { env } from 'cloudflare:workers';
import { NextRequest, NextResponse } from 'next/server';
import { barbers, services } from '../../data';
import { getDatabase } from '../../db';

export const dynamic = 'force-dynamic';

const allowedOrigins = new Set([
  'https://duduwwl.github.io',
  'https://daniels-barber-lavras.duduwwl.chatgpt.site',
]);
const statuses = new Set(['confirmado', 'concluido', 'cancelado', 'faltou']);

function timeToMinutes(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

function corsHeaders(request: Request) {
  const origin = request.headers.get('origin');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Vary': 'Origin',
  };
  if (origin && allowedOrigins.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function json(request: Request, body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders(request) });
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || allowedOrigins.has(origin);
}

function isManager(request: Request) {
  const email = request.headers.get('oai-authenticated-user-email')?.trim().toLowerCase();
  const configured = env.MANAGER_EMAIL?.trim().toLowerCase();
  return Boolean(email && configured && email === configured);
}

export function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: NextRequest) {
  if (!isAllowedOrigin(request)) return json(request, { error: 'Origem não permitida.' }, 403);

  const query = request.nextUrl.searchParams;
  const date = query.get('date') ?? '';
  const barberId = query.get('barber') ?? '';

  if (query.get('availability') === '1') {
    if (!date || !barberId) return json(request, { busy: [] });
    const result = await getDatabase().prepare(
      `SELECT start_time, duration FROM appointments
       WHERE appointment_date = ? AND barber_id = ? AND status <> 'cancelado'
       ORDER BY start_time`,
    ).bind(date, barberId).all<{ start_time: string; duration: number }>();
    return json(request, { busy: result.results });
  }

  if (!isManager(request)) return json(request, { error: 'Acesso restrito à gerência.' }, 401);

  const clauses: string[] = [];
  const bindings: string[] = [];
  if (date) { clauses.push('appointment_date = ?'); bindings.push(date); }
  if (barberId) { clauses.push('barber_id = ?'); bindings.push(barberId); }
  const status = query.get('status') ?? '';
  if (status && statuses.has(status)) { clauses.push('status = ?'); bindings.push(status); }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const result = await getDatabase().prepare(
    `SELECT id, customer_name, customer_phone, service_id, service_name, duration,
            barber_id, barber_name, appointment_date, start_time, status, notes,
            created_at, updated_at
     FROM appointments ${where}
     ORDER BY appointment_date ASC, start_time ASC`,
  ).bind(...bindings).all();

  return json(request, { appointments: result.results });
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) return json(request, { error: 'Origem não permitida.' }, 403);

  const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!payload) return json(request, { error: 'Dados inválidos.' }, 400);

  const service = services.find((item) => item.id === payload.serviceId);
  const barber = barbers.find((item) => item.id === payload.barberId);
  const customerName = String(payload.customerName ?? '').trim().slice(0, 100);
  const customerPhone = String(payload.customerPhone ?? '').trim().slice(0, 30);
  const appointmentDate = String(payload.appointmentDate ?? '');
  const startTime = String(payload.startTime ?? '');
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const timePattern = /^\d{2}:\d{2}$/;

  if (!service || !barber || customerName.length < 2 || customerPhone.length < 8 || !datePattern.test(appointmentDate) || !timePattern.test(startTime)) {
    return json(request, { error: 'Revise os dados do agendamento.' }, 400);
  }
  if (new Date(`${appointmentDate}T23:59:59`) < new Date()) {
    return json(request, { error: 'Escolha uma data futura.' }, 400);
  }

  const id = crypto.randomUUID();
  try {
    const existing = await getDatabase().prepare(
      `SELECT start_time, duration FROM appointments
       WHERE appointment_date = ? AND barber_id = ? AND status <> 'cancelado'`,
    ).bind(appointmentDate, barber.id).all<{ start_time: string; duration: number }>();
    const requestedStart = timeToMinutes(startTime);
    const requestedEnd = requestedStart + service.duration;
    const overlaps = existing.results.some((item) => {
      const existingStart = timeToMinutes(item.start_time);
      return requestedStart < existingStart + item.duration && existingStart < requestedEnd;
    });
    if (overlaps) return json(request, { error: 'Esse período acabou de ser reservado. Escolha outro horário.' }, 409);

    await getDatabase().prepare(
      `INSERT INTO appointments (
         id, customer_name, customer_phone, service_id, service_name, duration,
         barber_id, barber_name, appointment_date, start_time, status, notes
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmado', '')`,
    ).bind(
      id, customerName, customerPhone, service.id, service.short, service.duration,
      barber.id, barber.name, appointmentDate, startTime,
    ).run();
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('UNIQUE') || message.includes('constraint')) {
      return json(request, { error: 'Esse horário acabou de ser reservado. Escolha outro.' }, 409);
    }
    throw error;
  }

  return json(request, { id, status: 'confirmado' }, 201);
}

export async function PATCH(request: NextRequest) {
  if (!isManager(request)) return json(request, { error: 'Acesso restrito à gerência.' }, 401);

  const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
  const id = String(payload?.id ?? '');
  const status = String(payload?.status ?? '');
  const notes = String(payload?.notes ?? '').trim().slice(0, 500);
  if (!id || !statuses.has(status)) return json(request, { error: 'Atualização inválida.' }, 400);

  const result = await getDatabase().prepare(
    `UPDATE appointments
     SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
  ).bind(status, notes, id).run();

  if (!result.meta.changes) return json(request, { error: 'Agendamento não encontrado.' }, 404);
  return json(request, { ok: true });
}
