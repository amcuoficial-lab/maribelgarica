import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * Enhanced Admin Layout with Sidebar Navigation
 */
export default function AdminLayout({ children }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const navItems = [
    { label: '🏠 Panel Inicial', path: '/admin', exact: true },
    { label: '📚 Audiolibros', path: '/admin/libros' },
    { label: '🎨 Contenido Web', path: '/admin/config' },
  ]

  const activeItem = navItems.find(item => 
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
  )

  return (
    <div className="min-h-screen bg-marfil flex">
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-cafe-oscuro text-crema flex-shrink-0 hidden md:flex flex-col border-r border-cafe-oscuro shadow-2xl">
        <div className="p-8 mb-4">
          <h2 className="font-display text-2xl font-bold text-crema leading-tight">
            Maribel García
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-arena/40 mt-1 font-bold">
            Administración
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                  isActive
                    ? 'bg-terracota text-white shadow-lg shadow-terracota/20 transform scale-[1.02]'
                    : 'text-arena/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-arena/40 transition-all rounded-xl text-xs font-bold"
          >
            <span>🚪 Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-crema border-b border-arena/30 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
          <div onClick={() => navigate('/admin')}>
            <h1 className="font-display font-bold text-cafe-oscuro">Maribel García</h1>
            <p className="text-[8px] uppercase text-cafe-medio leading-none">{activeItem?.label || 'Panel'}</p>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-cafe-oscuro text-crema rounded-xl">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </header>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-cafe-oscuro text-crema px-6 py-6 space-y-3 shadow-2xl animate-fade-in z-50 fixed top-16 left-0 right-0 border-t border-white/5">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                className="w-full text-left py-4 px-6 rounded-2xl bg-white/5 font-bold text-sm"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="w-full text-left py-4 px-6 rounded-2xl text-red-400 font-bold text-sm border border-red-400/20"
            >
              Cerrar Sesión
            </button>
          </div>
        )}

        {/* Dynamic children */}
        <main className="flex-1 overflow-y-auto bg-marfil">
          {children}
        </main>
      </div>
    </div>
  )
}
