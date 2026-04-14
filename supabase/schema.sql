-- ============================================================
-- Maribel García — Schema de Microcuentos
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabla microcuentos
create table if not exists public.microcuentos (
  id           uuid primary key default gen_random_uuid(),
  titulo       text not null,
  token_unico  text not null unique,
  audio_url    text not null,
  foto_url     text not null,
  descripcion  text,
  activo       boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- 2. Row Level Security
alter table public.microcuentos enable row level security;

-- Lectura pública de cuentos activos
create policy "microcuentos_public_read"
  on public.microcuentos for select
  using (activo = true);

-- Solo admin autenticado puede insertar
create policy "microcuentos_admin_insert"
  on public.microcuentos for insert
  with check (auth.role() = 'authenticated');

-- Solo admin autenticado puede actualizar
create policy "microcuentos_admin_update"
  on public.microcuentos for update
  using (auth.role() = 'authenticated');

-- Solo admin autenticado puede eliminar
create policy "microcuentos_admin_delete"
  on public.microcuentos for delete
  using (auth.role() = 'authenticated');

-- 3. Trigger para updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger microcuentos_updated_at
  before update on public.microcuentos
  for each row execute function public.handle_updated_at();

-- 4. Storage buckets
-- Ejecutar estos también en SQL Editor o crear desde Storage > New Bucket

insert into storage.buckets (id, name, public)
values ('audios-cuentos', 'audios-cuentos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('fotos-cuentos', 'fotos-cuentos', true)
on conflict (id) do nothing;

-- Políticas de Storage: lectura pública
create policy "audios_public_read"
  on storage.objects for select
  using (bucket_id = 'audios-cuentos');

create policy "fotos_public_read"
  on storage.objects for select
  using (bucket_id = 'fotos-cuentos');

-- Políticas de Storage: upload solo admin
create policy "audios_admin_upload"
  on storage.objects for insert
  with check (bucket_id = 'audios-cuentos' and auth.role() = 'authenticated');

create policy "fotos_admin_upload"
  on storage.objects for insert
  with check (bucket_id = 'fotos-cuentos' and auth.role() = 'authenticated');

create policy "audios_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'audios-cuentos' and auth.role() = 'authenticated');

create policy "fotos_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'fotos-cuentos' and auth.role() = 'authenticated');
