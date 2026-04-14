import AdminLayout from '../components/admin/AdminLayout'
import LibroForm from '../components/admin/LibroForm'

export default function AdminLibrosPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

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
        {showForm && (
          <div className="bg-crema border border-arena/50 rounded-2xl p-8 mb-8 shadow-sm">
            <h2 className="font-display text-xl text-cafe-oscuro mb-6">Nuevo Libro</h2>
            <LibroForm
              onSaved={() => { setShowForm(false); fetchLibros() }}
              onCancel={() => setShowForm(false)}
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

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/libros/${libro.id}`)}
                      className="flex-1 py-2 bg-terracota hover:bg-ambar text-crema text-sm font-semibold rounded-lg transition-colors"
                    >
                      Gestionar cuentos
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
      </main>
    </div>
  )
}
