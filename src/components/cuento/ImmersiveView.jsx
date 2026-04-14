import { useState } from 'react'
import AudioPlayer from './AudioPlayer'

export default function ImmersiveView({ cuento }) {
  // Combine main photo + extras into one array
  const allPhotos = [cuento.foto_url, ...(cuento.fotos_extra || [])].filter(Boolean)
  const [activePhoto, setActivePhoto] = useState(0)

  // Nombre del libro (viene del join en CuentoPage)
  const libroNombre = cuento.libros?.titulo || 'Maribel García — Guardiana de Historias'

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Full-screen blurred background photo */}
      <div className="fixed inset-0 -z-10">
        <img
          src={allPhotos[activePhoto] || cuento.foto_url}
          alt=""
          className="w-full h-full object-cover scale-110 blur-md brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cafe-oscuro/60 via-cafe-oscuro/40 to-cafe-oscuro/90" />
      </div>

      {/* Branding top: nombre del libro */}
      <div className="text-center pt-6 pb-2">
        <p className="text-arena/60 text-xs font-medium tracking-[0.2em] uppercase">
          {libroNombre}
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-6 py-8">

        {/* === FOTO PRINCIPAL prominente arriba del título === */}
        <div className="w-full mb-8">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl border-2 border-white/10">
            <img
              src={allPhotos[activePhoto] || cuento.foto_url}
              alt={cuento.titulo}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails si hay más de una foto */}
          {allPhotos.length > 1 && (
            <div className="flex gap-2 justify-center mt-4">
              {allPhotos.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    activePhoto === i
                      ? 'border-terracota shadow-lg scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl text-crema font-bold mb-3 leading-tight text-center">
          {cuento.titulo}
        </h1>

        {/* Description */}
        {cuento.descripcion && (
          <p className="text-crema/70 text-base mb-8 leading-relaxed max-w-sm mx-auto text-center">
            {cuento.descripcion}
          </p>
        )}

        {/* Audio player — solo si hay audio */}
        {cuento.audio_url ? (
          <AudioPlayer src={cuento.audio_url} title="Escuchá el cuento" />
        ) : (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 text-center">
            <p className="text-crema/40 text-sm">🎙️ Audio próximamente</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col items-center gap-2">
          <p className="text-crema/40 text-xs">Narración oral de</p>
          <p className="font-display text-crema/70 text-sm font-semibold">Maribel García</p>
          <a
            href="https://www.instagram.com/maribelgarciamuseoscuentos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-arena/50 hover:text-arena text-xs transition-colors mt-1"
          >
            @maribelgarciamuseoscuentos
          </a>
        </div>
      </div>
    </div>
  )
}
