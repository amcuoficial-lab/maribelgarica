import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminLoginPage() {
  const { session, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && session) navigate('/admin/cuentos', { replace: true })
  }, [session, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await signIn(form.email, form.password)
    if (error) {
      setError('Credenciales incorrectas. Verificá tu email y contraseña.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-marfil flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-terracota border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-marfil flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-terracota font-semibold text-xs tracking-widest uppercase mb-2">Admin</p>
          <h1 className="font-display text-3xl text-cafe-oscuro">Maribel García</h1>
          <p className="text-cafe-medio text-sm mt-2">Panel de administración</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-crema border border-arena/50 rounded-2xl p-8 shadow-sm space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-cafe-medio mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-marfil border border-arena rounded-xl text-cafe-oscuro focus:outline-none focus:border-terracota transition-colors"
              placeholder="admin@maribelgarcia.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cafe-medio mb-1.5">Contraseña</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 bg-marfil border border-arena rounded-xl text-cafe-oscuro focus:outline-none focus:border-terracota transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-terracota hover:bg-ambar disabled:opacity-50 text-crema font-semibold rounded-xl transition-colors"
          >
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
