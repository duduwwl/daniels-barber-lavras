import { env } from 'cloudflare:workers';

export function getDatabase() {
  if (!env.DB) throw new Error('Banco de agendamentos indisponível.');
  return env.DB;
}
