-- Portfolio sample-app schema (Booking + Invoicing)
-- Run this once against your Neon database (Neon dashboard SQL editor is the
-- easiest way — no local psql required) before the apps will work. Safe to
-- re-run: every statement is idempotent (if not exists / on conflict).

-- =============================================================================
-- Booking demo app
-- =============================================================================

create table if not exists services (
  id serial primary key,
  name text not null,
  description text,
  duration_minutes integer not null,
  price_cents integer not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- One row per day of week (0 = Sunday .. 6 = Saturday).
create table if not exists business_hours (
  day_of_week smallint primary key check (day_of_week between 0 and 6),
  open_time time,
  close_time time,
  is_closed boolean not null default false
);

-- One-off closures (holidays, vacation days, etc.) that override business_hours.
create table if not exists blocked_dates (
  id serial primary key,
  date date not null unique,
  reason text
);

create table if not exists bookings (
  id serial primary key,
  service_id integer not null references services(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_bookings_start_time on bookings (start_time);
create index if not exists idx_bookings_service_id on bookings (service_id);

-- --- Seed data for the demo business ---------------------------------------

insert into services (name, description, duration_minutes, price_cents) values
  ('Haircut & Style', 'Consultation, cut, and finish styling.', 45, 5500),
  ('Color Treatment', 'Full color service including gloss and blowout.', 120, 14000),
  ('Blowout', 'Wash and professional blowout styling.', 30, 3500),
  ('Deep Conditioning Treatment', 'Add-on or standalone restorative treatment.', 30, 3000),
  ('Bridal Trial', 'Trial run for wedding-day hair, includes consultation.', 90, 12000)
on conflict do nothing;

insert into business_hours (day_of_week, open_time, close_time, is_closed) values
  (0, null, null, true),
  (1, '09:00', '17:00', false),
  (2, '09:00', '17:00', false),
  (3, '09:00', '17:00', false),
  (4, '09:00', '17:00', false),
  (5, '09:00', '17:00', false),
  (6, '10:00', '14:00', false)
on conflict (day_of_week) do nothing;

-- =============================================================================
-- Invoicing demo app
-- =============================================================================

create table if not exists clients (
  id serial primary key,
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id serial primary key,
  client_id integer not null references clients(id),
  invoice_number text not null unique,
  -- Unguessable id used in the shareable client-facing URL (/invoicing/:token)
  -- instead of the sequential id, so clients can't browse each other's invoices.
  public_token text not null unique,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue')),
  issue_date date not null default current_date,
  due_date date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists invoice_line_items (
  id serial primary key,
  invoice_id integer not null references invoices(id) on delete cascade,
  description text not null,
  quantity numeric not null default 1,
  unit_price_cents integer not null
);

create index if not exists idx_invoices_public_token on invoices (public_token);
create index if not exists idx_invoice_line_items_invoice_id on invoice_line_items (invoice_id);

-- --- Seed a demo invoice so the public /invoicing/demo link works out of the box ---

insert into clients (name, email) values
  ('Riverside Coffee Co.', 'owner@riversidecoffee.example')
on conflict (email) do nothing;

insert into invoices (client_id, invoice_number, public_token, status, issue_date, due_date, notes)
select c.id, 'INV-1001', 'demo', 'sent', current_date - interval '5 days', current_date + interval '9 days',
  'Thanks for the opportunity to work together — let me know if you have any questions about this invoice.'
from clients c
where c.email = 'owner@riversidecoffee.example'
on conflict (public_token) do nothing;

insert into invoice_line_items (invoice_id, description, quantity, unit_price_cents)
select i.id, x.description, x.quantity, x.unit_price_cents
from invoices i,
  (values
    ('Website design & development', 1, 240000),
    ('Monthly hosting & maintenance (3 months)', 3, 7500)
  ) as x(description, quantity, unit_price_cents)
where i.public_token = 'demo'
  and not exists (select 1 from invoice_line_items li where li.invoice_id = i.id);
