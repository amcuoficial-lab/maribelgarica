import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
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
  const [qrCuento, setQrCuento] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [{ data: libroData }, { data: cuentosData }] = await Promise.all([
      supabase.from('libros').select('*').eq('id', libroId).single(),
      supabase.from('microcuentos').select('*').eq('libro_id', libroId).order('created_at', { ascending: false }),
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

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin')
  }

  const appDomain = import.meta.env.VITE_APP_DOMAIN || window.location.origin

  return (
    <div className="min-h-screen bg-marfil">
      {/* Header */}
      <header className="bg-crema border-b border-arena/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/libros')}
            className="p-2 text-cafe-medio hover:text-terracota transition-colors rounded-lg hover:bg-terracota/10"
            title="Volver a libros"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="font-display text-xl text-cafe-oscuro">{libro?.titulo || 'Cargando…'}</h1>
            <p className="text-cafe-medio text-xs">Cuentos de este libro</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-cafe-medio hover:text-terracota transition-colors">Ver sitio</a>
          <button onClick={handleSignOut} className="text-sm text-cafe-medio hover:text-red-600 transition-colors">Salir</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Actions bar */}
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

        {/* New cuento form */}
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

        {/* List */}
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
            {cuentos.map((c) => (
              <CuentoRow
                key={c.id}
                cuento={c}
                appDomain={appDomain}
                onQR={() => setQrCuento(c)}
                onToggle={() => toggleActivo(c.id, c.activo)}
                onDelete={() => deleteCuento(c.id)}
                onUpdated={fetchData}
              />
            ))}
          </div>
        )}
      </main>

      {/* QR Modal */}
      {qrCuento && <QRModal cuento={qrCuento} onClose={() => setQrCuento(null)} />}
    </div>
  )
}
