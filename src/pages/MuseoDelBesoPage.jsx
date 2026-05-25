import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

// -------------------------------------------------------
//  Colección de "piezas" del museo adaptadas a la nueva temática
// -------------------------------------------------------
const piezas = [
  {
    id: 1,
    titulo: 'El Primer Beso',
    categoria: 'Memoria',
    descripcion:
      'Ese instante suspendido en el tiempo donde el mundo deja de girar. En Hinojo, el viento de la tarde suele ser testigo de los primeros encuentros bajo la sombra de los árboles.',
    icon: '💋',
    color: '#cc1111',
  },
  {
    id: 2,
    titulo: 'El Beso de Buenas Noches',
    categoria: 'Cotidianidad',
    descripcion:
      'El más silencioso, el más honesto. Como una semilla que se siembra en la noche esperando florecer en el nuevo día, cuida los sueños de quienes amamos.',
    icon: '🌙',
    color: '#ffffff',
  },
  {
    id: 3,
    titulo: 'El Beso en la Frente',
    categoria: 'Ternura & Cobijo',
    descripcion:
      'Beso de madres, abuelas, y ancestros. Un pacto intergeneracional de protección que se transmite en silencio y dura para siempre.',
    icon: '🌸',
    color: '#cc1111',
  },
  {
    id: 4,
    titulo: 'El Beso de la Despedida',
    categoria: 'Duelo y Distancia',
    descripcion:
      'El que queda grabado en la piel del alma al partir. En la historia de la inmigración en Hinojo, cuántos besos quedaron grabados en las estaciones de tren.',
    icon: '🕊️',
    color: '#ffffff',
  },
  {
    id: 5,
    titulo: 'El Beso Prohibido',
    categoria: 'Valentía',
    descripcion:
      'El que se resguarda en las sombras para proteger su luz. La historia de los pueblos guarda en secreto los besos que desafiaron el tiempo y la norma.',
    icon: '🔐',
    color: '#cc1111',
  },
  {
    id: 6,
    titulo: 'Semillas de Esperanza',
    categoria: 'Eternidad',
    descripcion:
      'Como dicen los abuelos de Hinojo: "Un beso es una semilla de esperanza". El amor sembrado hoy dará frutos en las generaciones del mañana.',
    icon: '🌾',
    color: '#ffffff',
  },
]

const testimonios = [
  {
    texto:
      '"Mi abuela me contaba que cuando llegó a Hinojo desde Alemania, lo único que traía era una carta de amor con un beso marcado en carmín y unas semillas de hinojo entre las páginas."',
    autor: 'Vecina de Hinojo, 82 años',
  },
  {
    texto:
      '"Un beso es una semilla de esperanza. En los tiempos difíciles de nuestro pueblo, un abrazo y un beso en la mejilla eran el motor para seguir trabajando la tierra."',
    autor: 'Don Héctor, historiador local',
  },
  {
    texto:
      '"Hay besos que se guardan como tesoros en el baúl de los recuerdos. Este museo nos permite volver a vivirlos."',
    autor: 'Visitante del Museo',
  },
]

export default function MuseoDelBesoPage() {
  const [piezaActiva, setPiezaActiva] = useState(null)
  const [testimonioIdx, setTestimonioIdx] = useState(0)
  const [visible, setVisible] = useState({})
  const [videoPlaying, setVideoPlaying] = useState(false)
  
  const videoRef = useRef(null)
  const piezasRef = useRef([])

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
    return () => obs.disconnect()
  }, [])

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
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 px-6">
          <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Texto Hero */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 bg-[#cc1111]/10 border border-[#cc1111]/30 px-4 py-1.5 rounded-full">
                <span className="text-[#cc1111] animate-pulse">💋</span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cc1111]">
                  Hinojo · Argentina
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold font-display text-white leading-tight">
                El Museo de los <br />
                <span className="text-[#cc1111] relative">
                  Besos
                  <span className="absolute bottom-1 left-0 w-full h-1 bg-[#cc1111] rounded-full"></span>
                </span>
              </h1>

              <p className="text-xl italic font-display text-gray-300">
                "Un beso es una semilla de esperanza"
              </p>

              <p className="text-gray-400 max-w-lg leading-relaxed text-sm md:text-base">
                Inspirado en la memoria afectiva de Hinojo, provincia de Buenos Aires. 
                Un rincón digital y comunitario dedicado a salvaguardar los gestos, las historias, 
                los adioses y los reencuentros sellados con un beso.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="#introduccion"
                  className="px-8 py-3.5 bg-[#cc1111] hover:bg-red-700 text-white font-bold rounded-full transition-all duration-300 text-sm tracking-wider uppercase inline-flex items-center gap-2 shadow-lg shadow-[#cc1111]/35 hover:-translate-y-0.5"
                >
                  Ver introducción
                </a>
                <a
                  href="#coleccion"
                  className="px-8 py-3.5 border-2 border-white hover:bg-white hover:text-black text-white font-bold rounded-full transition-all duration-300 text-sm tracking-wider uppercase inline-flex items-center gap-2 hover:-translate-y-0.5"
                >
                  Explorar Sala
                </a>
              </div>
            </div>

            {/* Logo de Referencia en el Hero */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Glow efecto de fondo */}
                <div className="absolute inset-0 bg-[#cc1111]/25 rounded-full filter blur-xl group-hover:bg-[#cc1111]/35 transition-all duration-500"></div>
                <div className="relative bg-black border-4 border-white p-6 rounded-full w-72 h-72 md:w-80 md:h-80 flex items-center justify-center shadow-2xl transition-transform duration-500 hover:rotate-6">
                  <img
                    src="/fotos/logo-museo.png"
                    alt="Logo El Museo de los Besos"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
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
                Bienvenida de la fundadora
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display text-white">
                Las historias detrás del beso
              </h2>
              <div className="w-16 h-1 bg-[#cc1111] mx-auto rounded-full"></div>
            </div>

            {/* Reproductor de Video Premium */}
            <div className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-black aspect-video group">
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
                    aria-label="Reproducir video de bienvenida"
                  >
                    ▶
                  </button>
                  <p className="mt-4 text-xs tracking-widest uppercase font-semibold text-white/80">
                    Reproducir video de presentación
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Maribel García nos introduce al concepto de la museología social a través de los besos 
              en Hinojo. Escuchá el testimonio del origen de este museo sin paredes.
            </p>

          </div>
        </section>

        {/* ══════════════════════════════════════
            COLECCIÓN DE PIEZAS
        ══════════════════════════════════════ */}
        <section id="coleccion" className="py-24 px-6 bg-black relative">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center space-y-4 mb-16">
              <span className="text-[#cc1111] text-xs font-extrabold uppercase tracking-[0.3em]">
                Exposición Permanente
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display text-white">
                Las Piezas del Museo
              </h2>
              <p className="text-gray-400 text-sm">
                Seleccioná una pieza para abrir su vitrina e interactuar con su historia.
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
                      {/* Categoria & Icono */}
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#cc1111] bg-[#cc1111]/10 border border-[#cc1111]/20 px-2.5 py-1 rounded-full">
                          {pieza.categoria}
                        </span>
                        <span className="text-2xl">{pieza.icon}</span>
                      </div>

                      {/* Título de Pieza */}
                      <h3 className="text-xl font-bold font-display text-white mb-4">
                        {pieza.titulo}
                      </h3>

                      {/* Expandible de historia */}
                      <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-56 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        <p className="text-xs text-gray-300 leading-relaxed border-t border-neutral-800 pt-4 mt-2">
                          {pieza.descripcion}
                        </p>
                      </div>
                    </div>

                    {/* Botón de acción / estado */}
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#cc1111] transition-colors">
                      <span className={`transition-transform duration-300 ${isActive ? 'rotate-180 text-[#cc1111]' : ''}`}>
                        ▼
                      </span>
                      {isActive ? 'Cerrar historia' : 'Detalles de la pieza'}
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
        <section className="py-24 px-6 bg-[#090909] border-t border-white/5 relative">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            
            <div className="space-y-4">
              <span className="text-[#cc1111] text-xs font-extrabold uppercase tracking-[0.3em]">
                Voces Comunitarias
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display text-white">
                Los Besos de Nuestra Tierra
              </h2>
            </div>

            {/* Testimonio Card con fade */}
            <div 
              key={testimonioIdx}
              className="bg-black border border-neutral-800 p-8 md:p-12 rounded-2xl relative max-w-2xl mx-auto shadow-2xl animate-fade-in"
            >
              <span className="text-6xl text-[#cc1111] font-display absolute top-4 left-6 opacity-30">“</span>
              <p className="text-base md:text-lg italic font-display text-gray-200 leading-relaxed relative z-10 px-4">
                {testimonios[testimonioIdx].texto}
              </p>
              <div className="mt-6 w-8 h-0.5 bg-[#cc1111] mx-auto"></div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#cc1111]">
                {testimonios[testimonioIdx].autor}
              </p>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 pt-4">
              {testimonios.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonioIdx(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === testimonioIdx ? 'w-8 bg-[#cc1111]' : 'w-2 bg-neutral-700'}`}
                  aria-label={`Ir al testimonio ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA - COMPARTE TU HISTORIA
        ══════════════════════════════════════ */}
        <section className="py-28 px-6 bg-black relative text-center">
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <span className="text-4xl">💌</span>
            <h2 className="text-4xl md:text-6xl font-bold font-display text-white">
              ¿Querés donar un beso al museo?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              Los museos comunitarios se construyen colectivamente. Si tenés una historia, 
              una carta, una foto o el recuerdo de un beso que quieras compartir, escribile a Maribel. 
              Ayudanos a sembrar más esperanza.
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

      {/* Estilos e inyecciones de CSS personalizadas para anular colores en Navbar del Museo */}
      <style>{`
        /* Anulaciones para que la Navbar genérica se adapte al tema negro/rojo/blanco en esta subpágina */
        .museo-body nav {
          background-color: rgba(0, 0, 0, 0.9) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(8px) !important;
        }
        .museo-body nav a, 
        .museo-body nav button {
          color: #ffffff !important;
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
