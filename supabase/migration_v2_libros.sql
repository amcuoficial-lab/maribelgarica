-- ============================================================
-- Migración: Sistema de Edición y Ensamblado de Libros
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Actualizar tabla libros
ALTER TABLE public.libros ADD COLUMN IF NOT EXISTS audio_url text;
ALTER TABLE public.libros ADD COLUMN IF NOT EXISTS token_unico text;
ALTER TABLE public.libros ADD COLUMN IF NOT EXISTS fotos_extra text[];
ALTER TABLE public.libros ADD COLUMN IF NOT EXISTS contenido_completo text;

-- 2. Actualizar tabla microcuentos
ALTER TABLE public.microcuentos ADD COLUMN IF NOT EXISTS contenido text;
ALTER TABLE public.microcuentos ADD COLUMN IF NOT EXISTS orden integer DEFAULT 0;

-- 3. (Opcional) Inicializar el orden basado en la fecha de creación si no existe
UPDATE public.microcuentos SET orden = 0 WHERE orden IS NULL;
