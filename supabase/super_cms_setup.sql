-- ============================================================
-- SUPER PRO CMS: Site Configuration & Layout
-- ============================================================

-- 1. Table for sections and their dynamic content
create table if not exists public.site_sections (
  id           text primary key, -- hero, about, festival, podcast, trajectory, contact
  section_name text not null,
  section_order int not null default 0,
  is_visible   boolean default true,
  content      jsonb not null default '{}',
  updated_at   timestamptz default now()
);

-- 2. Global settings (social links, contact info, etc)
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null default '{}',
  updated_at  timestamptz default now()
);

-- 3. Storage bucket for site assets
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- 4. RLS Policies
alter table public.site_sections enable row level security;
alter table public.site_settings enable row level security;

-- Public read
create policy "sections_public_read" on public.site_sections for select using (true);
create policy "settings_public_read" on public.site_settings for select using (true);

-- Admin write
create policy "sections_admin_all" on public.site_sections for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "settings_admin_all" on public.site_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- 5. SEED INITIAL DATA (based on current hardcoded values)
insert into public.site_sections (id, section_name, section_order, content) values
(
  'hero',
  'Hero / Bienvenida',
  1,
  '{
    "title": "Maribel García",
    "subtitle": "Guardiana de Historias",
    "description": "Magíster en Museología Social. Fundadora de 10 museos comunitarios. Creadora del festival Los 50 que Cuentan.",
    "bg_image": "/fotos/hero.jpg",
    "tagline": "Narradora Oral · Museóloga · Locutora"
  }'
),
(
  'about',
  'Sobre Mí / Biografía',
  2,
  '{
    "title": "Una vida dedicada a las historias",
    "bio": "Soy narradora oral, museóloga social, locutora, gestora cultural y escritora argentina. A lo largo de mi carrera he dedicado cada momento a rescatar, preservar y compartir las historias que nos construyen como comunidad.\n\nComo Magíster en Museología Social, fundé 10 museos comunitarios en diferentes rincones del país, espacios donde la memoria colectiva cobra vida y las voces de los que no tienen voz encuentran su lugar.\n\nLa narración oral es mi herramienta más poderosa: creo que las historias sanan, unen y transforman. En cada actuación, en cada cuento, intento tender un puente entre el pasado que nos dio forma y el futuro que estamos construyendo juntos.\n\nConduzco programas de radio y podcast, donde cada semana comparto relatos, entrevistas y reflexiones sobre la cultura, la identidad y el poder de las palabras.",
    "photo": "/fotos/sobre-mi.jpg",
    "stats": [
      {"value": "10", "label": "Museos Fundados"},
      {"value": "30+", "label": "Años de Carrera"},
      {"value": "Magíster", "label": "Museología Social"}
    ]
  }'
),
(
  'festival',
  'Festival Los 50 que Cuentan',
  3,
  '{
    "title": "Los 50 que Cuentan",
    "description": "Los 50 que Cuentan es un festival de narración oral que fundé con la convicción de que cada historia merece ser escuchada y cada narrador merece un escenario.\n\nEl festival convoca a narradores de todo el país — voces que cargan con la memoria de sus comunidades, tradiciones orales que de otro modo se perderían, historias que cruzan generaciones y geografías.\n\nTrabajamos especialmente con niños y jóvenes, llevando la narración oral a escuelas, plazas y centros comunitarios, porque creemos que el futuro de las historias está en quienes las reciben hoy.",
    "main_image": "/fotos/festival.jpg",
    "gallery": [
      "/fotos/brasil.jpg",
      "/fotos/mural.jpg",
      "/fotos/playa.jpg",
      "/fotos/museo-2.jpg"
    ],
    "stats": [
      {"v": "50+", "l": "Narradores por edición"},
      {"v": "12+", "l": "Años de historia"},
      {"v": "Todo el país", "l": "Alcance federal"}
    ]
  }'
),
(
  'podcast',
  'Podcast / Spotify',
  4,
  '{
    "title": "Escuchá mi Podcast",
    "description": "Historias, reflexiones y entrevistas en profundidad sobre el mundo de la narración y la memoria social.",
    "spotify_url": "https://open.spotify.com/embed/show/3x79YfS5u2YID5U8vofN6n?utm_source=generator&theme=0"
  }'
),
(
  'trayectoria',
  'Espectáculos & Proyectos',
  5,
  '{
    "title": "Espectáculos & Proyectos",
    "description": "Tres décadas recorriendo escenarios, museos y comunidades con el poder transformador de las historias.",
    "projects": [
      {
        "photo": "/fotos/escena.jpg",
        "title": "Voces del Sur",
        "description": "Espectáculo de narración oral con vestuario tradicional en el Salón Auditorio.",
        "tag": "Narración Oral"
      },
      {
        "photo": "/fotos/conventilleras.jpg",
        "title": "Las Conventilleras",
        "description": "Una obra que rescata las historias de las mujeres que forjaron los conventillos porteños.",
        "tag": "Teatro"
      },
      {
        "photo": "/fotos/cuba.jpg",
        "title": "Raíces del Caribe",
        "description": "Narración oral con elementos del folclore caribeño. Una inmersión en la memoria afrolatina.",
        "tag": "Folclore"
      }
    ]
  }'
)
on conflict (id) do nothing;

-- 6. Site Settings Seeding (Centralized 'global' object)
insert into public.site_settings (key, value) values
(
  'global',
  '{
    "site_name": "Maribel García",
    "contact_email": "maribelmuseos@hotmail.com",
    "social_links": {
      "instagram": "https://www.instagram.com/maribelgarciamuseoscuentos",
      "spotify": "https://open.spotify.com/show/3x79YfS5u2YID5U8vofN6n",
      "whatsapp": "https://wa.me/549123456789",
      "youtube": "",
      "tiktok": ""
    }
  }'
)
on conflict (key) do update set value = excluded.value;
