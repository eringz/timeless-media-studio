create extension if not exists "uuid-ossp";

create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text not null,
  email_provider text,
  booking_date date not null,
  package_type text not null,
  message text,
  confirmation_number text unique not null,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'in_process', 'for_pick_up', 'completed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

alter table bookings enable row level security;

drop policy if exists "Allow public booking creation" on bookings;
create policy "Allow public booking creation"
on bookings
for insert
with check (true);

drop policy if exists "Allow booking status reads" on bookings;
create policy "Allow booking status reads"
on bookings
for select
using (true);

-- Updates and deletes are handled by your Next.js API route.
-- Add SUPABASE_SERVICE_ROLE_KEY in .env.local for admin update/delete access.
