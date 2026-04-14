-- ============================================================
-- Agregar soporte para múltiples fotos por cuento
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

alter table public.microcuentos
  add column if not exists fotos_extra jsonb default null;

-- Fix RLS: permitir lectura pública de todos los cuentos (QR siempre funciona)
drop policy if exists "microcuentos_public_read" on public.microcuentos;

create policy "microcuentos_public_read"
  on public.microcuentos for select
  using (true);
