-- Tabla para guardar los puntos de interés (markers) en Supabase
create table if not exists public.markers (
  id uuid primary key default gen_random_uuid(),
  map_id text not null default 'provisional-v1',
  title text not null,
  description text default '',
  category text not null default 'custom',
  lat double precision not null, -- Coordenada Y en CRS.Simple
  lng double precision not null, -- Coordenada X en CRS.Simple
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Índice para filtrar rápidamente por mapa (provisional vs definitivo)
create index if not exists idx_markers_map_id on public.markers (map_id);

-- Políticas RLS para uso personal (puedes restringirlo a tu usuario autenticado si activas Auth)
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
