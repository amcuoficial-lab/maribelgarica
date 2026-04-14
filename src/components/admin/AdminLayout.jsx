import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * Enhanced Admin Layout with Sidebar Navigation
 */
export default function AdminLayout({ children }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin')
  }

  const navItems = [
    { label: '📚 Audiolibros', path: '/admin/libros', icon: 'books' },
    { label: '🎨 Contenido Web', path: '/admin/config', icon: 'brush' },
  ]

  return (
    <div className="min-h-screen bg-marfil flex">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-cafe-oscuro text-crema flex-shrink-0 hidden md:flex flex-col border-r border-cafe-oscuro">
        <div className="p-8">
          <h2 className="font-display text-xl font-bold text-arena italic leading-tight">
            Maribel García
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-arena/50 mt-1">
            Gestión de Historias
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-terracota text-white shadow-lg shadow-terracota/20'
                    : 'text-arena/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-arena/50 hover:text-red-400 transition-colors text-sm"
          >
            <span>🚪 Salir del panel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-crema border-b border-arena/50 px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-lg text-cafe-oscuro">Maribel García</h1>
          <button onClick={() => navigate('/admin/libros')} className="text-cafe-medio">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </header>

        {/* Dynamic children */}
        <main className="flex-1 overflow-y-auto bg-marfil">
          {children}
        </main>
      </div>
    </div>
  )
}
