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
