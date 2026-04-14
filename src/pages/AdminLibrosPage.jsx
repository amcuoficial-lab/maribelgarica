import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import AdminLayout from '../components/admin/AdminLayout'
import LibroForm from '../components/admin/LibroForm'

export default function AdminLibrosPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLibro, setEditingLibro] = useState(null)

  const fetchLibros = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('libros')
      .select('*, microcuentos(count)')
      .order('created_at', { ascending: false })
    setLibros(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchLibros() }, [fetchLibros])

  const togglePublico = async (libro) => {
    const newValue = libro.es_publico !== false ? false : true
    await supabase.from('libros').update({ es_publico: newValue }).eq('id', libro.id)
    fetchLibros()
  }

  const deleteLibro = async (id) => {
    if (!confirm('¿Eliminar este libro y todos sus cuentos? Esta acción no se puede deshacer.')) return
    await supabase.from('libros').delete().eq('id', id)
    fetchLibros()
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-4xl text-cafe-oscuro">Mis Libros</h2>
            <p className="text-cafe-medio text-sm mt-1">{libros.length} libro{libros.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-terracota hover:bg-ambar text-crema font-semibold rounded-xl transition-all shadow-lg shadow-terracota/10 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Libro
          </button>
        </div>

        {/* Form */}
        {(showForm || editingLibro) && (
          <div className="bg-crema border border-arena/50 rounded-2xl p-8 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl text-cafe-oscuro">
                {editingLibro ? 'Editar Libro' : 'Nuevo Libro'}
              </h2>
            </div>
            <LibroForm
              initialData={editingLibro}
              onSaved={() => { setShowForm(false); setEditingLibro(null); fetchLibros() }}
              onCancel={() => { setShowForm(false); setEditingLibro(null) }}
            />
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-terracota border-t-transparent rounded-full animate-spin" />
          </div>
        ) : libros.length === 0 ? (
          <div className="text-center py-20 text-cafe-medio">
            <p className="font-display text-6xl mb-4">📚</p>
            <p className="font-display text-2xl mb-2">Sin libros aún</p>
            <p className="text-sm">Creá tu primer libro con el botón de arriba.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {libros.map((libro) => (
              <div
                key={libro.id}
                className="bg-crema border border-arena/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Portada */}
                 <div className="h-40 bg-arena/20 overflow-hidden relative">
                   {libro.portada_url ? (
                     <img src={libro.portada_url} alt={libro.titulo} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-5xl">📖</div>
                   )}
                   <div className="absolute inset-0 bg-cafe-oscuro/0 group-hover:bg-cafe-oscuro/10 transition-colors" />
                   
                   {/* Visibility Badge */}
                   <div className="absolute top-3 right-3">
                     <button 
                       onClick={(e) => { e.stopPropagation(); togglePublico(libro) }}
                       className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-transform active:scale-90 ${libro.es_publico !== false ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'}`}
                       title={libro.es_publico !== false ? 'Público: Visible en la web' : 'Oculto: Solo vía QR'}
                     >
                       {libro.es_publico !== false ? (
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth={2}/></svg>
                       ) : (
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.27 4.27m5.61 5.61l-5.61-5.61m10.12 10.12l5.61 5.61m-5.61-5.61l5.61 5.61M3 21l18-18" strokeWidth={2}/></svg>
                       )}
                     </button>
                   </div>
                 </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-display text-base text-cafe-oscuro font-semibold mb-1 truncate">{libro.titulo}</h3>
                  {libro.descripcion && (
                    <p className="text-cafe-medio text-xs mb-3 line-clamp-2">{libro.descripcion}</p>
                  )}
                  <p className="text-cafe-claro text-xs mb-4">
                    {libro.microcuentos?.[0]?.count ?? 0} cuento{(libro.microcuentos?.[0]?.count ?? 0) !== 1 ? 's' : ''}
                  </p>

                   <div className="flex gap-2">
                     <button
                       onClick={() => navigate(`/admin/libros/${libro.id}`)}
                       className="flex-1 py-2 bg-terracota hover:bg-ambar text-crema text-sm font-semibold rounded-lg transition-colors"
                     >
                       Cuentos
                     </button>
                     <button
                       onClick={() => setEditingLibro(libro)}
                       className="p-2 text-cafe-medio hover:text-terracota transition-colors rounded-lg hover:bg-arena/10"
                       title="Editar libro"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                       </svg>
                     </button>
                     <button
                       onClick={() => deleteLibro(libro.id)}
                       className="p-2 text-cafe-medio hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                       title="Eliminar libro"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                     </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
