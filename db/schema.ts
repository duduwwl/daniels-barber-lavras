import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const appointments = sqliteTable('appointments', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  serviceId: text('service_id').notNull(),
  serviceName: text('service_name').notNull(),
  duration: integer('duration').notNull(),
  barberId: text('barber_id').notNull(),
  barberName: text('barber_name').notNull(),
  appointmentDate: text('appointment_date').notNull(),
  startTime: text('start_time').notNull(),
  status: text('status').notNull().default('confirmado'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('idx_appointments_date_barber').on(table.appointmentDate, table.barberId),
  index('idx_appointments_status_date').on(table.status, table.appointmentDate),
  uniqueIndex('idx_appointments_active_slot')
    .on(table.barberId, table.appointmentDate, table.startTime)
    .where(sql`${table.status} <> 'cancelado'`),
]);
