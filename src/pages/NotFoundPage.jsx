import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-marfil flex flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-8xl font-bold text-terracota/20 mb-4">404</p>
      <h1 className="font-display text-3xl text-cafe-oscuro mb-4">Página no encontrada</h1>
      <p className="text-cafe-medio mb-8">Esta historia aún no ha sido escrita.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-terracota hover:bg-ambar text-crema font-semibold rounded-full transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
