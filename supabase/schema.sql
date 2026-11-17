-- Tabla para guardar los puntos de interés (markers) en Supabase
create table if not exists public.markers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  category text not null default 'custom',
  owner text not null default 'Anónimo',
  lat double precision not null, -- Coordenada Y en CRS.Simple
  lng double precision not null, -- Coordenada X en CRS.Simple
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Índice para filtrar rápidamente por autor (owner)
create index if not exists idx_markers_owner on public.markers (owner);

-- Políticas RLS para uso personal y de amigos
alter table public.markers enable row level security;

create policy "Permitir lectura publica o personal"
  on public.markers for select
  using (true);

create policy "Permitir insercion personal"
  on public.markers for insert
  with check (true);

create policy "Permitir actualizacion personal"
  on public.markers for update
  using (true);

create policy "Permitir borrado personal"
  on public.markers for delete
  using (true);
