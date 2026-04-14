-- ============================================================
-- Fix: Permitir lectura pública de TODOS los cuentos (para QR)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- Eliminar la política vieja que solo permite leer activos
drop policy if exists "microcuentos_public_read" on public.microcuentos;

-- Crear nueva política: lectura pública de todos los cuentos
-- Los QR deben funcionar siempre, sin importar el estado activo
create policy "microcuentos_public_read"
  on public.microcuentos for select
  using (true);
