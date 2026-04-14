import { useState, useRef, useEffect } from 'react'

export default function ImageCropperModal({ file, aspectRatio = 3 / 4, onCrop, onCancel }) {
  const [imgUrl, setImgUrl] = useState('')
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setImgUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleSave = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = imgRef.current
    const container = containerRef.current

    if (!img || !container) return

    // Final Resolution (Target for high quality)
    const targetWidth = 800
    const targetHeight = targetWidth / aspectRatio
    canvas.width = targetWidth
    canvas.height = targetHeight

    // Calculate crop
    const containerRect = container.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()

    // Ratio between original image and displayed image
    const scaleX = img.naturalWidth / imgRect.width
    const scaleY = img.naturalHeight / imgRect.height

    // Calculate crop coordinates relative to the original image
    const sourceX = (containerRect.left - imgRect.left) * scaleX
    const sourceY = (containerRect.top - imgRect.top) * scaleY
    const sourceWidth = containerRect.width * scaleX
    const sourceHeight = containerRect.height * scaleY

    ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, targetWidth, targetHeight
    )

    canvas.toBlob((blob) => {
      onCrop(new File([blob], file.name, { type: 'image/jpeg' }))
    }, 'image/jpeg', 0.9)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-cafe-oscuro/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-marfil max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-arena/30 flex justify-between items-center bg-white">
          <div>
            <h3 className="font-display text-xl text-cafe-oscuro">Ajustar Imagen</h3>
            <p className="text-[10px] text-cafe-claro uppercase tracking-widest font-bold">Mové y hacé zoom para encuadrar</p>
          </div>
          <button onClick={onCancel} className="text-cafe-medio hover:text-terracota transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
          </button>
        </div>

        <div className="p-8">
          {/* Crop Area */}
          <div 
            ref={containerRef}
            className="relative mx-auto bg-arena/20 rounded-2xl overflow-hidden cursor-move border-2 border-dashed border-arena select-none"
            style={{ 
              aspectRatio: aspectRatio,
              width: '100%',
              maxWidth: aspectRatio > 1 ? '500px' : '300px'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {imgUrl && (
              <img
                ref={imgRef}
                src={imgUrl}
                alt="Para recortar"
                className="absolute origin-center pointer-events-none"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  maxWidth: 'none'
                }}
              />
            )}
            {/* Guide Lines */}
            <div className="absolute inset-0 pointer-events-none border border-crema/30">
               <div className="absolute inset-0 grid grid-cols-3 divide-x divide-crema/20"><div></div><div></div><div></div></div>
               <div className="absolute inset-0 grid grid-rows-3 divide-y divide-crema/20"><div></div><div></div><div></div></div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <svg className="w-4 h-4 text-cafe-medio" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" strokeWidth={2}/></svg>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.01" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-terracota h-1.5 bg-arena/30 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-bold text-cafe-medio w-8">{Math.round(zoom * 100)}%</span>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={handleSave}
                className="flex-1 py-4 bg-terracota hover:bg-ambar text-white font-bold rounded-2xl shadow-xl shadow-terracota/20 transition-all transform active:scale-95"
              >
                Confirmar Recorte
              </button>
              <button 
                onClick={onCancel}
                className="px-8 py-4 border border-arena text-cafe-medio font-semibold rounded-2xl hover:bg-marfil transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
