import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import AdminLayout from '../components/admin/AdminLayout'
import CuentoForm from '../components/admin/CuentoForm'
import QRModal from '../components/admin/QRModal'

export default function AdminLibroCuentosPage() {
  const { libroId } = useParams()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [libro, setLibro] = useState(null)
  const [cuentos, setCuentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [qrCuento, setQrCuento] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [{ data: libroData }, { data: cuentosData }] = await Promise.all([
      supabase.from('libros').select('*').eq('id', libroId).single(),
      supabase.from('microcuentos').select('*').eq('libro_id', libroId).order('orden', { ascending: true }),
    ])
    setLibro(libroData)
    setCuentos(cuentosData || [])
    setLoading(false)
  }, [libroId])

  useEffect(() => { fetchData() }, [fetchData])

  const toggleActivo = async (id, activo) => {
    await supabase.from('microcuentos').update({ activo: !activo }).eq('id', id)
    fetchData()
  }

  const deleteCuento = async (id) => {
    if (!confirm('¿Eliminar este cuento? Esta acción no se puede deshacer.')) return
    await supabase.from('microcuentos').delete().eq('id', id)
    fetchData()
  }

  const handleMove = async (id, direction) => {
    const currentIndex = cuentos.findIndex(c => c.id === id)
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === cuentos.length - 1) return

    const newCuentos = [...cuentos]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    // Swap
    const temp = newCuentos[currentIndex]
    newCuentos[currentIndex] = newCuentos[targetIndex]
    newCuentos[targetIndex] = temp

    // Update order values
    const reordered = newCuentos.map((c, idx) => ({ ...c, orden: idx + 1 }))
    setCuentos(reordered)

    // Sync to DB
    try {
      for (const c of reordered) {
        await supabase.from('microcuentos').update({ orden: c.orden }).eq('id', c.id)
      }
    } catch (err) {
      console.error('Error updating order:', err)
    }
  }

  const assembleBookText = () => {
    const fullText = cuentos
      .filter(c => c.activo)
      .map(c => `### ${c.titulo}\n\n${c.contenido || '*(Sin contenido)*'}`)
      .join('\n\n---\n\n')
    
    const blob = new Blob([`# ${libro.titulo}\n\n${libro.descripcion || ''}\n\n${fullText}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${libro.titulo.replace(/\s+/g, '_')}_Completo.txt`
    a.click()
  }

  const appDomain = import.meta.env.VITE_APP_DOMAIN || window.location.origin

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/libros')}
              className="p-3 bg-white border border-arena/50 text-cafe-medio hover:text-terracota transition-all rounded-xl hover:shadow-md"
              title="Volver a Libros"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-terracota uppercase tracking-widest mb-1">
                <span>Libro</span>
                <span className="text-arena/50">/</span>
                <span>Cuentos</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-cafe-oscuro">{libro?.titulo || 'Cargando…'}</h1>
            </div>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-terracota hover:bg-ambar text-crema font-semibold rounded-xl transition-all shadow-lg shadow-terracota/10 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Cuento
          </button>
        </header>
        <div className="flex items-center justify-between mb-8">
          <p className="text-cafe-medio text-sm">{cuentos.length} cuento{cuentos.length !== 1 ? 's' : ''}</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-terracota hover:bg-ambar text-crema font-semibold rounded-xl transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Cuento
          </button>
        </div>

        {showForm && (
          <div className="bg-crema border border-arena/50 rounded-2xl p-8 mb-8 shadow-sm">
            <h2 className="font-display text-xl text-cafe-oscuro mb-6">Nuevo Microcuento</h2>
            <CuentoForm
              libroId={libroId}
              onSaved={() => { setShowForm(false); fetchData() }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-terracota border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cuentos.length === 0 ? (
          <div className="text-center py-20 text-cafe-medio">
            <p className="font-display text-5xl mb-4">✨</p>
            <p className="font-display text-2xl mb-2">Sin cuentos aún</p>
            <p className="text-sm">Creá el primer cuento de este libro.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Assembler Banner */}
            {cuentos.length > 0 && (
              <div className="bg-cafe-oscuro text-crema p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <h3 className="font-display text-xl font-bold">Ensamblador de Libro</h3>
                  <p className="text-arena/60 text-sm">Generá el documento completo con todos los cuentos en orden.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2 border border-white/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth={2}/></svg>
                    Vista Previa
                  </button>
                  <button
                    onClick={assembleBookText}
                    className="px-6 py-3 bg-terracota hover:bg-ambar text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg>
                    Descargar .txt
                  </button>
                </div>
              </div>
            )}

            {/* Preview Modal */}
            {showPreview && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cafe-oscuro/80 backdrop-blur-sm">
                <div className="bg-crema w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b border-arena/30 flex justify-between items-center bg-marfil">
                    <h2 className="font-display text-2xl text-cafe-oscuro">Vista Previa del Libro</h2>
                    <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-arena/20 rounded-full transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-10 font-serif leading-relaxed text-lg text-cafe-oscuro whitespace-pre-wrap selection:bg-terracota/20">
                    <h1 className="text-4xl font-display mb-4 text-center">{libro.titulo}</h1>
                    <p className="text-cafe-medio italic mb-12 text-center">{libro.descripcion}</p>
                    
                    {cuentos.map((c, i) => (
                      <div key={c.id} className="mb-12">
                        <h3 className="text-terracota font-display text-2xl mb-4">Capítulo {i+1}: {c.titulo}</h3>
                        <div className="prose max-w-none">
                          {c.contenido || <em className="text-cafe-claro">Este capítulo no tiene texto escrito aún.</em>}
                        </div>
                        {i < cuentos.length - 1 && <div className="mt-12 text-center text-arena font-display">✦ ✦ ✦</div>}
                      </div>
                    ))}
                  </div>
                  <div className="p-6 border-t border-arena/30 bg-marfil flex justify-end gap-3">
                    <button onClick={() => setShowPreview(false)} className="px-6 py-2 text-cafe-medio font-bold hover:text-cafe-oscuro">Cerrar</button>
                    <button 
                      onClick={() => {
                        const text = `${libro.titulo}\n\n${libro.descripcion}\n\n` + cuentos.map((c, i) => `Capítulo ${i+1}: ${c.titulo}\n\n${c.contenido}`).join('\n\n---\n\n')
                        navigator.clipboard.writeText(text)
                        alert('¡Texto copiado al portapapeles!')
                      }}
                      className="px-6 py-2 bg-dorado text-white font-bold rounded-xl shadow-md hover:bg-terracota transition-all"
                    >
                      Copiar Todo
                    </button>
                    <button onClick={assembleBookText} className="px-6 py-2 bg-terracota text-white font-bold rounded-xl shadow-md hover:bg-ambar transition-all">
                      Descargar TXT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {cuentos.map((c, index) => (
              <CuentoRow
                key={c.id}
                cuento={c}
                isFirst={index === 0}
                isLast={index === cuentos.length - 1}
                appDomain={appDomain}
                onQR={() => setQrCuento(c)}
                onToggle={() => toggleActivo(c.id, c.activo)}
                onDelete={() => deleteCuento(c.id)}
                onMove={(dir) => handleMove(c.id, dir)}
                onUpdated={fetchData}
              />
            ))}
          </div>
        )}
        </div>
      {qrCuento && <QRModal cuento={qrCuento} onClose={() => setQrCuento(null)} />}
    </AdminLayout>
  )
}

/* ── CuentoRow: cada cuento con opción de agregar audio después ── */
function CuentoRow({ cuento: c, isFirst, isLast, appDomain, onQR, onToggle, onDelete, onMove, onUpdated }) {
  const [uploading, setUploading] = useState(false)

  const handleAddAudio = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${c.token_unico}-audio-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('audios-cuentos').upload(path, file)
      if (upErr) throw upErr
      const { data } = supabase.storage.from('audios-cuentos').getPublicUrl(path)
      await supabase.from('microcuentos').update({ audio_url: data.publicUrl }).eq('id', c.id)
      onUpdated()
    } catch (err) {
      alert('Error subiendo audio: ' + err.message)
    }
    setUploading(false)
  }

  return (
    <div className={`bg-crema border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-opacity ${c.activo ? 'border-arena/50' : 'border-arena/30 opacity-60'}`}>
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-arena/30">
        <img src={c.foto_url} alt={c.titulo} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-display text-base text-cafe-oscuro font-semibold truncate">{c.titulo}</p>
        {c.descripcion && <p className="text-cafe-medio text-xs mt-0.5 truncate">{c.descripcion}</p>}
        <div className="flex items-center gap-3 mt-1">
          <p className="text-cafe-claro text-xs font-mono">{c.token_unico}</p>
          {c.audio_url ? (
            <span className="text-green-600 text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              Audio ✓
            </span>
          ) : (
            <label className={`text-xs flex items-center gap-1 cursor-pointer ${uploading ? 'text-cafe-claro' : 'text-amber-600 hover:text-amber-700'}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              {uploading ? 'Subiendo…' : 'Agregar audio'}
              <input type="file" accept="audio/*" className="hidden" onChange={handleAddAudio} disabled={uploading} />
            </label>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex flex-col gap-1 mr-2 border-r border-arena/30 pr-2">
          <button 
            disabled={isFirst}
            onClick={() => onMove('up')}
            className="p-1 hover:bg-terracota/10 rounded disabled:opacity-10 text-cafe-medio hover:text-terracota transition-all"
            title="Subir"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" strokeWidth={3}/></svg>
          </button>
          <button 
            disabled={isLast}
            onClick={() => onMove('down')}
            className="p-1 hover:bg-terracota/10 rounded disabled:opacity-10 text-cafe-medio hover:text-terracota transition-all"
            title="Bajar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={3}/></svg>
          </button>
        </div>
        <a href={`${appDomain}/cuento/${c.token_unico}`} target="_blank" rel="noopener noreferrer" className="p-2 text-cafe-medio hover:text-terracota transition-colors rounded-lg hover:bg-terracota/10" title="Ver cuento">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
        <button onClick={onQR} className="p-2 text-cafe-medio hover:text-dorado transition-colors rounded-lg hover:bg-dorado/10" title="Generar QR">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
        </button>
        <button onClick={onToggle} className={`p-2 transition-colors rounded-lg ${c.activo ? 'text-green-600 hover:text-orange-500 hover:bg-orange-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`} title={c.activo ? 'Desactivar' : 'Activar'}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.activo ? "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} /></svg>
        </button>
        <button onClick={onDelete} className="p-2 text-cafe-medio hover:text-red-500 transition-colors rounded-lg hover:bg-red-50" title="Eliminar">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  )
}
