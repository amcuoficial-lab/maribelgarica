import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'

export default function AdminDashboardPage() {
  const navigate = useNavigate()

  const cards = [
    {
      title: 'Audiolibros & Cuentos',
      subtitle: 'Gestionar biblioteca de libros y sus audios individuales.',
      icon: '📚',
      path: '/admin/libros',
      color: 'bg-cafe-claro'
    },
    {
      title: 'Configuración Web',
      subtitle: 'Editar textos, fotos, redes sociales y orden de la página.',
      icon: '🎨',
      path: '/admin/config',
      color: 'bg-terracota'
    }
  ]

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="font-display text-4xl text-cafe-oscuro">¡Hola, Maribel!</h1>
          <p className="text-cafe-medio mt-2 text-lg">Bienvenida a tu centro de mando. ¿Qué quieres gestionar hoy?</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className="group text-left bg-white border border-arena/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-cafe-oscuro/5 transition-all transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-[0.03] rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform`} />
              
              <div className="text-4xl mb-6">{card.icon}</div>
              <h3 className="font-display text-2xl text-cafe-oscuro mb-3">{card.title}</h3>
              <p className="text-cafe-medio text-sm leading-relaxed mb-6">{card.subtitle}</p>
              
              <div className={`inline-flex items-center gap-2 p-1 pl-4 pr-2 ${card.color} text-white rounded-full text-xs font-bold`}>
                Ir al panel
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3}/></svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 p-8 bg-marfil border-2 border-dashed border-arena/40 rounded-3xl flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">💡</div>
          <div className="flex-1">
            <h4 className="font-bold text-cafe-oscuro">Acceso Rápido</h4>
            <p className="text-cafe-medio text-sm italic">Usa la barra lateral izquierda (o el menú superior en celular) para saltar entre estas secciones sin volver aquí.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
