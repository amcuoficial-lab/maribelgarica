import { useEffect } from 'react'

/**
 * A museum-inspired media modal that displays images and their stories.
 * Supports single images or a list (carousel mode).
 */
export default function MediaModal({ isOpen, onClose, items = [], currentIndex = 0, onNavigate }) {
  const item = items[currentIndex] || items[0]
  const hasMultiple = items.length > 1

  // Close on Escape key
  useEffect(() => {
    if (!isOpen || items.length === 0) return
    const handleEsc = (e) => { e.key === 'Escape' && onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, items.length, onClose])

  // Prevent background scroll
  useEffect(() => {
    if (!isOpen || items.length === 0) {
      document.body.style.overflow = 'unset'
      return
    }
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen, items.length])

  if (!isOpen || items.length === 0) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-cafe-oscuro/95 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-full bg-crema rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-in border border-arena/30">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-cafe-oscuro/50 text-white rounded-full md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
        </button>

        {/* Media Side */}
        <div className="md:w-3/5 lg:w-2/3 h-[40vh] md:h-auto bg-arena/10 relative flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-arena/20">
          <img 
            src={item.photo || item.url || item.img || '/fotos/hero.jpg'} 
            alt={item.title || 'Detalle'} 
            className="w-full h-full object-contain md:object-cover"
          />
          
          {/* Navigation Arrows */}
          {hasMultiple && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onNavigate((currentIndex - 1 + items.length) % items.length) }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-md border border-white/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={3}/></svg>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onNavigate((currentIndex + 1) % items.length) }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-md border border-white/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3}/></svg>
              </button>
            </>
          )}

          {/* Item Counter */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-cafe-oscuro/40 text-crema text-xs font-mono rounded-full backdrop-blur-sm">
              {currentIndex + 1} / {items.length}
            </div>
          )}
        </div>

        {/* Info Side */}
        <div className="md:w-2/5 lg:w-1/3 p-8 md:p-12 overflow-y-auto flex flex-col bg-marfil">
          <div className="mb-auto">
            <p className="text-terracota font-semibold text-xs tracking-widest uppercase mb-4">
              {item.tag || 'Historia'}
            </p>
            <h3 className="font-display text-3xl text-cafe-oscuro leading-tight mb-6">
              {item.title || 'Detalle del Proyecto'}
            </h3>
            <div className="w-12 h-0.5 bg-arena/50 mb-8" />
            
            <div className="text-cafe-medio text-base leading-relaxed whitespace-pre-line font-serif italic">
              {item.description || item.sub || 'No hay descripción disponible para esta imagen.'}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-arena/20 flex items-center justify-between">
            <button 
              onClick={onClose}
              className="text-cafe-claro hover:text-terracota text-sm font-bold transition-colors flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7 7-7" strokeWidth={2}/></svg>
              Volver a la galería
            </button>
            
            <div className="w-8 h-8 rounded-full bg-arena/20 flex items-center justify-center opacity-40">
                <svg className="w-4 h-4 text-cafe-oscuro" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
