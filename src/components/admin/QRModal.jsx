import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function QRModal({ cuento, onClose }) {
  const canvasRef = useRef(null)
  const appDomain = import.meta.env.VITE_APP_DOMAIN || window.location.origin
  const url = `${appDomain}/cuento/${cuento.token_unico}`

  const downloadQR = () => {
    // Find the canvas rendered by QRCodeCanvas and draw it to a 1200x1200 PNG
    const sourceCanvas = canvasRef.current?.querySelector('canvas')
    if (!sourceCanvas) return

    const size = 1200
    const padding = 80
    const qrSize = size - padding * 2

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#FAF6F0'
    ctx.fillRect(0, 0, size, size)

    // Border accent
    ctx.strokeStyle = '#B85C38'
    ctx.lineWidth = 6
    const margin = 20
    ctx.strokeRect(margin, margin, size - margin * 2, size - margin * 2)

    // QR code
    ctx.drawImage(sourceCanvas, padding, padding, qrSize, qrSize)

    // Title text
    ctx.fillStyle = '#3D2B1F'
    ctx.font = 'bold 36px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText(cuento.titulo, size / 2, size - 40)

    const link = document.createElement('a')
    link.download = `qr-${cuento.token_unico}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cafe-oscuro/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-crema rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
        <h2 className="font-display text-2xl text-cafe-oscuro mb-1">{cuento.titulo}</h2>
        <p className="text-cafe-medio text-xs mb-6 break-all">{url}</p>

        {/* QR code */}
        <div ref={canvasRef} className="flex justify-center mb-6">
          <QRCodeCanvas
            value={url}
            size={240}
            bgColor="#FAF6F0"
            fgColor="#3D2B1F"
            level="H"
            includeMargin
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadQR}
            className="flex-1 py-2.5 bg-terracota hover:bg-ambar text-crema font-semibold rounded-xl transition-colors text-sm"
          >
            Descargar QR 1200×1200
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-arena hover:border-cafe-medio text-cafe-medio rounded-xl transition-colors text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
