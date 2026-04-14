import AudioPlayer from './AudioPlayer'

export default function ImmersiveView({ cuento }) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-end overflow-hidden">
      {/* Full-screen background photo */}
      <div className="absolute inset-0">
        <img
          src={cuento.foto_url}
          alt={cuento.titulo}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cafe-oscuro via-cafe-oscuro/50 to-cafe-oscuro/20" />
      </div>

      {/* Branding top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <p className="text-arena/60 text-xs font-medium tracking-[0.2em] uppercase">
          Maribel García
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 pb-16 pt-24 text-center">
        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl text-crema font-bold mb-3 leading-tight">
          {cuento.titulo}
        </h1>

        {/* Description */}
        {cuento.descripcion && (
          <p className="text-crema/70 text-base mb-8 leading-relaxed max-w-sm mx-auto">
            {cuento.descripcion}
          </p>
        )}

        {/* Audio player */}
        <AudioPlayer src={cuento.audio_url} title="Escuchá el cuento" />

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
