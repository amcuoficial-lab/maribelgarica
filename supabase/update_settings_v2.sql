-- ============================================================
-- ACTUALIZACIÓN DE TABLA DE AJUSTES (SINGLE-ROW PATTERN)
-- ============================================================

-- 1. Eliminar la tabla anterior (si existe con el formato key-value)
drop table if exists public.site_settings;

-- 2. Crear la tabla con estructura de fila única
create table public.site_settings (
  id            text primary key default 'global',
  site_name     text default 'Maribel García',
  contact_email text default 'maribelmuseos@hotmail.com',
  social_links  jsonb default '{"instagram": "", "youtube": "", "spotify": "", "tiktok": ""}',
  updated_at    timestamptz default now()
);

-- 3. Habilitar RLS
alter table public.site_settings enable row level security;

-- 4. Políticas de Acceso
create policy "settings_public_read" on public.site_settings for select using (true);
create policy "settings_admin_all" on public.site_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- 5. Insertar los datos iniciales (Seed)
insert into public.site_settings (id, site_name, contact_email, social_links) 
values ('global', 'Maribel García', 'maribelmuseos@hotmail.com', '{
  "instagram": "https://www.instagram.com/maribelgarciamuseocuentos",
  "spotify": "https://open.spotify.com/show/3x79YfS5u2YID5U8vofN6n",
  "youtube": "https://youtube.com/@maribelgarcia",
  "tiktok": ""
}');

-- 6. Asegurar que site_sections esté correcto
-- (Ejecutar solo si la tabla site_sections no existe o está vacía)
-- insert into public.site_sections... (ya debería estar creada de pasos anteriores)
