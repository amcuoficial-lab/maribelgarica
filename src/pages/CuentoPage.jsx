import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ImmersiveView from '../components/cuento/ImmersiveView'

export default function CuentoPage() {
  const { token } = useParams()
  const [cuento, setCuento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        // Traer el cuento con el nombre del libro
        const { data, error } = await supabase
          .from('microcuentos')
          .select('*, libros(titulo)')
          .eq('token_unico', token)
          .maybeSingle()

        if (error || !data) {
          console.error('Error cargando cuento:', error)
          setNotFound(true)
        } else {
          setCuento(data)
        }
      } catch (err) {
        console.error('Error inesperado:', err)
        setNotFound(true)
      }
      setLoading(false)
    }
    load()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-cafe-oscuro flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-terracota border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-cafe-oscuro flex flex-col items-center justify-center text-center px-6">
        <p className="font-display text-5xl text-terracota/30 mb-4">✦</p>
        <h1 className="font-display text-3xl text-crema mb-3">Este cuento no existe</h1>
        <p className="text-crema/50 text-sm">El enlace puede estar inactivo o ser incorrecto.</p>
        <a
          href="/"
          className="mt-8 px-6 py-3 border border-arena/30 hover:border-arena text-arena rounded-full text-sm transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    )
  }

  return <ImmersiveView cuento={cuento} />
}
