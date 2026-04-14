-- ============================================================
-- Maribel García — Migración: Sistema de Libros
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabla libros
create table if not exists public.libros (
  id           uuid primary key default gen_random_uuid(),
  titulo       text not null,
  descripcion  text,
  portada_url  text,
  activo       boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- 2. RLS para libros
alter table public.libros enable row level security;

-- Lectura pública de libros activos
create policy "libros_public_read"
  on public.libros for select
  using (activo = true);

-- Solo admin autenticado puede gestionar libros
create policy "libros_admin_insert"
  on public.libros for insert
  with check (auth.role() = 'authenticated');

create policy "libros_admin_update"
  on public.libros for update
  using (auth.role() = 'authenticated');

create policy "libros_admin_delete"
  on public.libros for delete
  using (auth.role() = 'authenticated');

-- 3. Trigger updated_at para libros
create trigger libros_updated_at
  before update on public.libros
  for each row execute function public.handle_updated_at();

-- 4. Agregar libro_id a microcuentos
alter table public.microcuentos
  add column if not exists libro_id uuid references public.libros(id) on delete cascade;

-- 5. Bucket para portadas de libros
insert into storage.buckets (id, name, public)
values ('portadas-libros', 'portadas-libros', true)
on conflict (id) do nothing;

-- Políticas storage portadas
create policy "portadas_public_read"
  on storage.objects for select
  using (bucket_id = 'portadas-libros');

create policy "portadas_admin_upload"
  on storage.objects for insert
  with check (bucket_id = 'portadas-libros' and auth.role() = 'authenticated');

create policy "portadas_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'portadas-libros' and auth.role() = 'authenticated');
