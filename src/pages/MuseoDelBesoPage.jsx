import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

// Colección de "piezas" del museo adaptadas a la nueva temática y estilo de cuentacuentos
const piezas = [
  {
    id: 1,
    titulo: 'El Primer Beso',
    categoria: 'Memoria',
    descripcion:
      'Ese instante suspendido en el tiempo donde el mundo deja de girar. Los primeros besos son el prólogo de todos los cuentos que viviremos.',
    icon: '💋',
    color: '#cc1111',
  },
  {
    id: 2,
    titulo: 'El Beso de Buenas Noches',
    categoria: 'Cotidianidad',
    descripcion:
      'El más silencioso, el más honesto. Como una semilla que se siembra en la noche esperando florecer en el nuevo día, cobija los sueños.',
    icon: '🌙',
    color: '#ffffff',
  },
  {
    id: 3,
    titulo: 'El Beso en la Frente',
    categoria: 'Ternura & Cobijo',
    descripcion:
      'Beso de madres, abuelas, y ancestros. Un pacto invisible de protección que se transmite a través del tiempo.',
    icon: '🌸',
    color: '#cc1111',
  },
  {
    id: 4,
    titulo: 'El Beso de la Despedida',
    categoria: 'Duelo y Distancia',
    descripcion:
      'El que queda grabado en la piel del alma al partir. Promesas mudas escritas en el viento que esperan el reencuentro.',
    icon: '🕊️',
    color: '#ffffff',
  },
  {
    id: 5,
    titulo: 'El Beso Prohibido',
    categoria: 'Valentía',
    descripcion:
      'El que se resguarda en las sombras para proteger su luz. Historias secretas que desafiaron el olvido y la norma.',
    icon: '🔐',
    color: '#cc1111',
  },
  {
    id: 6,
    titulo: 'Semillas de Esperanza',
    categoria: 'Eternidad',
    descripcion:
      '"Un beso es una semilla de esperanza". El amor sembrado hoy en un gesto simple dará frutos en el mañana.',
    icon: '🌾',
    color: '#ffffff',
  },
]

const testimonios = [
  {
    texto:
      '"Hay besos que se guardan como tesoros en el baúl de los recuerdos. Este museo nos permite volver a abrirlos y escuchar su latido."',
    autor: 'Visitante del Museo',
  },
  {
    texto:
      '"Los cuentos no solo se escriben con palabras, también se narran con los labios, en cada abrazo y en cada beso que dejamos marcado en la memoria del otro."',
    autor: 'Maribel García',
  },
  {
    texto:
      '"Un beso es una semilla de esperanza. En cualquier rincón del mundo, un beso es el puente más corto entre dos almas."',
    autor: 'Abuela de la comunidad',
  },
]

// Array con las 17 imágenes copiadas
const imagenesGaleria = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  url: `/fotos/museo/img-${i + 1}.jpeg`,
  tipo: 'foto',
  titulo: `Recuerdo fotográfico #${i + 1}`,
}))

// Array con los 14 videos copiados (poniendo la Historia narrada #10 en primer lugar)
const videosIds = [10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14]
const videosGaleria = videosIds.map((id) => ({
  id: id,
  url: `/fotos/museo/video-${id}.mp4`,
  tipo: 'video',
  titulo: id === 10 ? 'Historia narrada #10 (Fundación del Museo)' : `Historia narrada #${id}`,
}))

export default function MuseoDelBesoPage() {
  const [piezaActiva, setPiezaActiva] = useState(null)
  const [testimonioIdx, setTestimonioIdx] = useState(0)
  const [visible, setVisible] = useState({})
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [filtro, setFiltro] = useState('todos') // 'todos' | 'videos' | 'fotos'
  
  // Lightbox modal state
  const [lightbox, setLightbox] = useState({ isOpen: false, item: null })
  
  // Estados para la animación de tirar besos
  const [kisses, setKisses] = useState([])
  const [isKissing, setIsKissing] = useState(false)

  const triggerKiss = () => {
    setIsKissing(true)
    setTimeout(() => setIsKissing(false), 600)

    const id = Date.now() + Math.random()
    const x = (Math.random() - 0.5) * 160 // -80px a 80px
    const y = 100 + Math.random() * 120 // 100px a 220px hacia arriba
    const rotate = (Math.random() - 0.5) * 45 // rotación aleatoria

    const newKiss = { id, x, y, rotate }
    setKisses((prev) => [...prev, newKiss])

    setTimeout(() => {
      setKisses((prev) => prev.filter((k) => k.id !== id))
    }, 2000)
  }

  // Tirar un beso automático cada 3.5 segundos
  useEffect(() => {
    const interval = setInterval(triggerKiss, 3500)
    return () => clearInterval(interval)
  }, [])

  const videoRef = useRef(null)
  const piezasRef = useRef([])
  const galeriaRef = useRef([])

  // Carousel automático de testimonios
  useEffect(() => {
    const t = setInterval(
      () => setTestimonioIdx((i) => (i + 1) % testimonios.length),
      5000,
    )
    return () => clearInterval(t)
  }, [])

  // Intersection Observer para animaciones de entrada
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((v) => ({ ...v, [e.target.dataset.id]: true }))
          }
        })
      },
      { threshold: 0.1 },
    )
    piezasRef.current.forEach((el) => el && obs.observe(el))
    galeriaRef.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [filtro])

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setVideoPlaying(!videoPlaying)
    }
  }

  const [inauguracionPlaying, setInauguracionPlaying] = useState(false)
  const inauguracionVideoRef = useRef(null)

  const handlePlayInauguracion = () => {
    if (inauguracionVideoRef.current) {
      if (inauguracionPlaying) {
        inauguracionVideoRef.current.pause()
      } else {
        inauguracionVideoRef.current.play()
      }
      setInauguracionPlaying(!inauguracionPlaying)
    }
  }

  // Combinación de elementos para la galería
  const itemsGaleria = [...videosGaleria, ...imagenesGaleria].filter((item) => {
    if (filtro === 'videos') return item.tipo === 'video'
    if (filtro === 'fotos') return item.tipo === 'foto'
    return true
  })

  return (
    <div className="museo-body min-h-screen bg-[#000000] text-white overflow-hidden relative selection:bg-[#cc1111] selection:text-white">
      
      {/* ══════════════════════════════════════
          FONDO PATRÓN DE BESOS Y SEMILLAS DE HINOJO
      ══════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] z-0" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hinojo-beso-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Beso / Labios en Rojo */}
              <path
                d="M 20,45 C 28,40 33,45 35,45 C 37,45 42,40 50,45 C 57,48 60,38 50,35 C 43,33 38,37 35,37 C 32,37 27,33 20,35 C 10,38 13,48 20,45 Z M 20,47 C 28,50 33,47 35,47 C 37,47 42,50 50,47 C 58,50 56,56 50,56 C 43,56 40,52 35,52 C 30,52 27,56 20,56 C 14,56 12,50 20,47 Z"
                fill="#cc1111"
                transform="rotate(15, 35, 45) scale(0.65)"
              />
              {/* Semilla de Hinojo 1 */}
              <g transform="translate(85, 25) rotate(45) scale(0.55)">
                <path d="M 15,5 C 22,7 22,23 15,25 C 8,23 8,7 15,5 Z" fill="#ffffff" stroke="#ffffff" strokeWidth="0.5" />
                <line x1="15" y1="5" x2="15" y2="25" stroke="#000000" strokeWidth="0.8" />
                <path d="M 11,8 C 13,11 13,19 11,22" fill="none" stroke="#000000" strokeWidth="0.5" />
                <path d="M 19,8 C 17,11 17,19 19,22" fill="none" stroke="#000000" strokeWidth="0.5" />
              </g>
              {/* Semilla de Hinojo 2 */}
              <g transform="translate(30, 85) rotate(-30) scale(0.5)">
                <path d="M 15,5 C 22,7 22,23 15,25 C 8,23 8,7 15,5 Z" fill="#ffffff" stroke="#ffffff" strokeWidth="0.5" />
                <line x1="15" y1="5" x2="15" y2="25" stroke="#000000" strokeWidth="0.8" />
                <path d="M 11,8 C 13,11 13,19 11,22" fill="none" stroke="#000000" strokeWidth="0.5" />
                <path d="M 19,8 C 17,11 17,19 19,22" fill="none" stroke="#000000" strokeWidth="0.5" />
              </g>
              {/* Otro beso más pequeño */}
              <path
                d="M 20,45 C 28,40 33,45 35,45 C 37,45 42,40 50,45 C 57,48 60,38 50,35 C 43,33 38,37 35,37 C 32,37 27,33 20,35 C 10,38 13,48 20,45 Z M 20,47 C 28,50 33,47 35,47 C 37,47 42,50 50,47 C 58,50 56,56 50,56 C 43,56 40,52 35,52 C 30,52 27,56 20,56 C 14,56 12,50 20,47 Z"
                fill="#ffffff"
                transform="translate(75, 75) rotate(-10) scale(0.4)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hinojo-beso-pattern)" />
        </svg>
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* ══════════════════════════════════════
            HERO SECTION (Negro, Blanco, Rojo)
        ══════════════════════════════════════ */}
        <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-28 px-6">
          <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Texto Hero */}
            <div className="lg:col-span-7 space-y-8 text-left">
              {/* Badge - Cambiado a 'Cualquier rincón del mundo' */}
              <div className="inline-flex items-center gap-3 bg-[#cc1111]/10 border border-[#cc1111]/30 px-4 py-2 rounded-full">
                <span className="text-[#cc1111] animate-pulse">💋</span>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#cc1111]">
                  Cualquier rincón del mundo
                </span>
              </div>

              <h1 className="text-5xl md:text-7.5xl font-bold font-alice text-white leading-tight">
                El Museo de los <br />
                <span className="text-[#cc1111] relative inline-block mt-1">
                  Besos
                  <span className="absolute bottom-2 left-0 w-full h-1 bg-[#cc1111] rounded-full"></span>
                </span>
              </h1>

              <p className="text-2xl italic font-lora text-gray-300">
                "Un beso es una semilla de esperanza"
              </p>

              <p className="text-gray-400 max-w-lg leading-relaxed text-base font-lora">
                Bienvenidos a un rincón donde las palabras se vuelven suspiros y la memoria se guarda en los labios. 
                Aquí atesoramos los relatos, cartas, fotografías y gestos que marcan la historia emocional 
                de los pueblos.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="#introduccion"
                  className="px-8 py-3.5 bg-[#cc1111] hover:bg-red-700 text-white font-bold rounded-full transition-all duration-300 text-sm tracking-wider uppercase inline-flex items-center gap-2 shadow-lg shadow-[#cc1111]/35 hover:-translate-y-0.5"
                >
                  Escuchar bienvenida
                </a>
                <a
                  href="#galeria"
                  className="px-8 py-3.5 border-2 border-white hover:bg-white hover:text-black text-white font-bold rounded-full transition-all duration-300 text-sm tracking-wider uppercase inline-flex items-center gap-2 hover:-translate-y-0.5"
                >
                  Ver la Colección completa
                </a>
              </div>
            </div>

            {/* Logo en el Hero (Interactivo y animado) */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                className="relative group cursor-pointer"
                onClick={triggerKiss}
                onMouseEnter={triggerKiss}
              >
                {/* Glow efecto de fondo */}
                <div className="absolute inset-0 bg-[#cc1111]/25 rounded-full filter blur-2xl group-hover:bg-[#cc1111]/35 transition-all duration-500"></div>
                
                {/* Contenedor circular con máscara perfecta */}
                <div 
                  className={`relative bg-[#080808] border-4 border-white rounded-full w-72 h-72 md:w-85 md:h-85 overflow-hidden flex items-center justify-center shadow-2xl transition-all duration-500 ${
                    isKissing ? 'scale-[0.9] md:scale-[0.9]' : 'hover:scale-[1.02]'
                  }`}
                  style={{
                    animation: isKissing ? 'mwah 0.6s ease-in-out' : 'none'
                  }}
                >
                  <img
                    src="/fotos/logo-museo.png"
                    alt="Logo El Museo de los Besos"
                    className="w-full h-full object-cover scale-[1.02] rounded-full select-none pointer-events-none"
                  />
                </div>

                {/* Emojis de besos flotantes animados */}
                {kisses.map((k) => (
                  <span
                    key={k.id}
                    className="absolute text-5xl pointer-events-none select-none z-30 animate-float-kiss"
                    style={{
                      '--kiss-x': `${k.x}px`,
                      '--kiss-y': `${k.y}px`,
                      '--kiss-rotate': `${k.rotate}deg`,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    💋
                  </span>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN INTRODUCCIÓN CON VIDEO (REQUERIDO)
        ══════════════════════════════════════ */}
        <section id="introduccion" className="py-24 px-6 bg-[#090909] border-y border-white/5 relative">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            
            <div className="space-y-4">
              <span className="text-[#cc1111] text-xs font-extrabold uppercase tracking-[0.3em]">
                Presentación
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-alice text-white">
                Las historias detrás del beso
              </h2>
              <div className="w-16 h-0.5 bg-[#cc1111] mx-auto"></div>
            </div>

            {/* Reproductor de Video Premium en Formato Historia (9:16) */}
            <div className="relative max-w-[330px] mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-black aspect-[9/16] group">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/fotos/video-intro.mp4"
                playsInline
                controls={videoPlaying}
                onClick={handlePlayVideo}
              />
              
              {/* Overlay de Play inicial */}
              {!videoPlaying && (
                <div 
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group-hover:bg-black/40"
                  onClick={handlePlayVideo}
                >
                  <button 
                    className="w-20 h-20 bg-[#cc1111] text-white rounded-full flex items-center justify-center text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110 active:scale-95"
                    aria-label="Reproducir presentación"
                  >
                    ▶
                  </button>
                  <p className="mt-4 text-xs tracking-widest uppercase font-semibold text-white/80 font-lora">
                    Escuchar relato inicial
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-400 max-w-xl mx-auto text-base font-lora leading-relaxed">
              Maribel García nos introduce a este museo comunitario a través de las historias y los besos 
              que tejieron las comunidades. Un recordatorio de lo que realmente importa.
            </p>

          </div>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN INAUGURACIÓN DEL MUSEO
        ══════════════════════════════════════ */}
        <section id="inauguracion" className="py-24 px-6 bg-black border-b border-white/5 relative">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            
            <div className="space-y-4">
              <span className="text-[#cc1111] text-xs font-extrabold uppercase tracking-[0.3em]">
                Gran Hito
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-alice text-white">
                La Inauguración del Museo
              </h2>
              <div className="w-16 h-0.5 bg-[#cc1111] mx-auto"></div>
            </div>

            {/* Reproductor de Video de la Inauguración (Formato Historia 9:16) */}
            <div className="relative max-w-[330px] mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-black aspect-[9/16] group">
              <video
                ref={inauguracionVideoRef}
                className="w-full h-full object-cover"
                src="/fotos/video-inauguracion.mp4"
                playsInline
                controls={inauguracionPlaying}
                onClick={handlePlayInauguracion}
              />
              
              {/* Overlay de Play inicial */}
              {!inauguracionPlaying && (
                <div 
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group-hover:bg-black/40"
                  onClick={handlePlayInauguracion}
                >
                  <button 
                    className="w-20 h-20 bg-[#cc1111] text-white rounded-full flex items-center justify-center text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110 active:scale-95"
                    aria-label="Reproducir video de la inauguración"
                  >
                    ▶
                  </button>
                  <p className="mt-4 text-xs tracking-widest uppercase font-semibold text-white/80 font-lora">
                    Ver video de la inauguración
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-400 max-w-xl mx-auto text-base font-lora leading-relaxed">
              El emotivo momento de la apertura y el corte de cinta oficial de nuestro museo. Un logro comunitario compartido que marca el nacimiento de este espacio de afecto y memoria.
            </p>

          </div>
        </section>

        {/* ══════════════════════════════════════
            SALA VIRTUAL / GALERÍA COMPLETA (NUEVO CONTENIDO REQUERIDO)
        ══════════════════════════════════════ */}
        <section id="galeria" className="py-24 px-6 bg-black relative">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center space-y-4 mb-16">
              <span className="text-[#cc1111] text-xs font-extrabold uppercase tracking-[0.3em]">
                Archivo de Memorias
              </span>
              <h2 className="text-4xl md:text-6xl font-bold font-alice text-white">
                La Vitrina de Historias
              </h2>
              <p className="text-gray-400 font-lora max-w-xl mx-auto">
                Explorá los relatos grabados en video y las imágenes de archivo del Museo. Hacé clic en cualquier recuerdo para verlo a tamaño completo.
              </p>

              {/* Filtros */}
              <div className="flex justify-center gap-3 pt-8 flex-wrap">
                {[
                  { id: 'todos', label: 'Todos los Recuerdos' },
                  { id: 'videos', label: 'Historias en Video 🎥' },
                  { id: 'fotos', label: 'Instantes en Fotos 📷' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setFiltro(btn.id)}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      filtro === btn.id
                        ? 'bg-[#cc1111] text-white shadow-md shadow-[#cc1111]/20'
                        : 'bg-neutral-900 text-gray-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de la Galería */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {itemsGaleria.map((item, i) => {
                const isVis = visible[`gal-${item.tipo}-${item.id}`]
                return (
                  <div
                    key={`${item.tipo}-${item.id}`}
                    data-id={`gal-${item.tipo}-${item.id}`}
                    ref={(el) => (galeriaRef.current[i] = el)}
                    onClick={() => setLightbox({ isOpen: true, item })}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border border-neutral-900 group aspect-[3/4] bg-neutral-950 transition-all duration-500 hover:border-[#cc1111] hover:-translate-y-1 ${
                      isVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${(i % 4) * 0.05}s` }}
                  >
                    {item.tipo === 'foto' ? (
                      <img
                        src={item.url}
                        alt={item.titulo}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                    ) : (
                      <div className="w-full h-full relative">
                        {/* Video Thumbnail (Poster/Preview) */}
                        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                          <span className="text-4xl">🎥</span>
                        </div>
                        <video
                          src={item.url}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-108"
                        />
                      </div>
                    )}

                    {/* Hover Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <span className="text-[10px] font-bold text-[#cc1111] tracking-widest uppercase">
                        {item.tipo === 'video' ? 'Video Historia' : 'Fotografía'}
                      </span>
                      <h4 className="text-sm font-bold text-white font-alice mt-1">
                        {item.titulo}
                      </h4>
                    </div>

                    {/* Icono de Reproducción / Zoom decorativo */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-xs backdrop-blur-sm">
                      {item.tipo === 'video' ? '▶' : '🔍'}
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════
            COLECCIÓN DE PIEZAS CONCEPTUALES
        ══════════════════════════════════════ */}
        <section className="py-24 px-6 bg-[#090909] border-t border-white/5 relative">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center space-y-4 mb-16">
              <span className="text-[#cc1111] text-xs font-extrabold uppercase tracking-[0.3em]">
                Exposición Permanente
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-alice text-white">
                Las Vitrinas Conceptuales
              </h2>
              <p className="text-gray-400 font-lora text-sm">
                Seleccioná una vitrina para abrirla y leer su relato.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {piezas.map((pieza, i) => {
                const isActive = piezaActiva === pieza.id
                const isVis = visible[`pieza-${pieza.id}`]
                return (
                  <article
                    key={pieza.id}
                    data-id={`pieza-${pieza.id}`}
                    ref={(el) => (piezasRef.current[i] = el)}
                    onClick={() => setPiezaActiva(isActive ? null : pieza.id)}
                    className={`relative p-8 rounded-xl cursor-pointer border-2 transition-all duration-500 ease-out flex flex-col justify-between ${
                      isActive 
                        ? 'bg-neutral-900 border-[#cc1111] shadow-xl shadow-[#cc1111]/10 -translate-y-2' 
                        : 'bg-[#0c0c0c] border-neutral-800 hover:border-white/20 hover:-translate-y-1'
                    } ${isVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${i * 0.05}s` }}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#cc1111] bg-[#cc1111]/10 border border-[#cc1111]/20 px-2.5 py-1 rounded-full font-lora">
                          {pieza.categoria}
                        </span>
                        <span className="text-2xl">{pieza.icon}</span>
                      </div>

                      <h3 className="text-xl font-bold font-alice text-white mb-4">
                        {pieza.titulo}
                      </h3>

                      <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-56 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        <p className="text-sm text-gray-300 leading-relaxed font-lora border-t border-neutral-800 pt-4 mt-2">
                          {pieza.descripcion}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#cc1111] transition-colors font-lora">
                      <span className={`transition-transform duration-300 ${isActive ? 'rotate-180 text-[#cc1111]' : ''}`}>
                        ▼
                      </span>
                      {isActive ? 'Cerrar relato' : 'Abrir vitrina'}
                    </div>
                  </article>
                )
              })}
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════
            TESTIMONIOS SLIDER
        ══════════════════════════════════════ */}
        <section className="py-24 px-6 bg-black border-t border-white/5 relative">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            
            <div className="space-y-4">
              <span className="text-[#cc1111] text-xs font-extrabold uppercase tracking-[0.3em]">
                Cuentos y Latidos
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-alice text-white">
                Historias Susurradas
              </h2>
            </div>

            {/* Testimonio Card con fade */}
            <div 
              key={testimonioIdx}
              className="bg-neutral-950 border border-neutral-850 p-8 md:p-12 rounded-2xl relative max-w-2xl mx-auto shadow-2xl animate-fade-in"
            >
              <span className="text-6xl text-[#cc1111] font-alice absolute top-4 left-6 opacity-30">“</span>
              <p className="text-lg italic font-lora text-gray-200 leading-relaxed relative z-10 px-4">
                {testimonios[testimonioIdx].texto}
              </p>
              <div className="mt-6 w-8 h-0.5 bg-[#cc1111] mx-auto"></div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#cc1111] font-lora">
                — {testimonios[testimonioIdx].autor}
              </p>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 pt-4">
              {testimonios.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonioIdx(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === testimonioIdx ? 'w-8 bg-[#cc1111]' : 'w-2 bg-neutral-700'}`}
                  aria-label={`Ir al relato ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA - COMPARTE TU HISTORIA
        ══════════════════════════════════════ */}
        <section className="py-28 px-6 bg-[#090909] relative text-center">
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <span className="text-4xl">💌</span>
            <h2 className="text-4xl md:text-6xl font-bold font-alice text-white">
              ¿Querés donar un beso al museo?
            </h2>
            <p className="text-gray-400 font-lora max-w-lg mx-auto text-base leading-relaxed">
              Los cuentos se enriquecen cuando los compartimos. Si tenés una historia, 
              una carta, una foto o el recuerdo de un beso que quieras atesorar aquí, escribile a Maribel.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 justify-center">
              <a
                href="/#contacto"
                className="px-8 py-3.5 bg-white text-black hover:bg-[#cc1111] hover:text-white font-bold rounded-full transition-all duration-300 text-sm tracking-wider uppercase inline-flex items-center gap-2 shadow-lg"
              >
                Enviar mi historia
              </a>
              <Link
                to="/"
                className="px-8 py-3.5 border border-neutral-700 hover:border-white text-white font-bold rounded-full transition-all duration-300 text-sm tracking-wider uppercase inline-flex items-center gap-2"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ══════════════════════════════════════
          LIGHTBOX MODAL PARA IMÁGENES Y VIDEOS
      ══════════════════════════════════════ */}
      {lightbox.isOpen && lightbox.item && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={() => setLightbox({ isOpen: false, item: null })}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar */}
            <button 
              onClick={() => setLightbox({ isOpen: false, item: null })}
              className="absolute -top-12 right-0 text-white hover:text-[#cc1111] text-3xl font-bold cursor-pointer transition-colors"
            >
              ✕
            </button>

            {/* Render del Item */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
              {lightbox.item.tipo === 'foto' ? (
                <img
                  src={lightbox.item.url}
                  alt={lightbox.item.titulo}
                  className="max-w-full max-h-[75vh] object-contain"
                />
              ) : (
                <video
                  src={lightbox.item.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-[75vh] object-contain aspect-video"
                />
              )}
            </div>

            {/* Titulo en Lightbox */}
            <div className="mt-4 text-center">
              <h4 className="text-lg font-alice text-white font-bold">{lightbox.item.titulo}</h4>
              <p className="text-xs text-gray-400 font-lora mt-1">
                {lightbox.item.tipo === 'video' ? 'Historia narrada en video' : 'Registro de archivo'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estilos e inyecciones de CSS personalizadas para tipografías y Navbar */}
      <style>{`
        /* Animaciones para el logo y besos flotantes */
        @keyframes float-kiss {
          0% {
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.3) rotate(var(--kiss-rotate));
          }
          100% {
            transform: translate(
              calc(-50% + var(--kiss-x)),
              calc(-50% - var(--kiss-y))
            ) scale(0.5) rotate(calc(var(--kiss-rotate) * 1.5));
            opacity: 0;
          }
        }

        .animate-float-kiss {
          animation: float-kiss 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes mwah {
          0% { transform: scale(1); }
          25% { transform: scale(0.85); }
          50% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }

        /* Tipografías especiales para cuentacuentos */
        .font-alice {
          font-family: 'Alice', Georgia, serif !important;
        }
        .font-lora {
          font-family: 'Lora', Georgia, serif !important;
        }

        .museo-body nav {
          background-color: rgba(0, 0, 0, 0.9) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(8px) !important;
        }
        .museo-body nav a, 
        .museo-body nav button {
          color: #ffffff !important;
          font-family: 'Lora', Georgia, serif !important;
        }
        .museo-body nav a:hover, 
        .museo-body nav button:hover {
          color: #cc1111 !important;
        }
        .museo-body nav .border-arena\\/40 {
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
        .museo-body nav .text-terracota {
          color: #cc1111 !important;
          border-color: rgba(204, 17, 17, 0.4) !important;
        }
        .museo-body nav .text-terracota:hover {
          color: #ffffff !important;
          border-color: #cc1111 !important;
          background-color: #cc1111 !important;
        }
        .museo-body footer {
          background-color: #050505 !important;
          border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        .museo-body footer .text-arena {
          color: #cc1111 !important;
        }
        .museo-body footer .hover\\:text-dorado:hover {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  )
}
