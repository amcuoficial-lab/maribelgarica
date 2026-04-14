import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const emptyForm = { titulo: '', descripcion: '', portadaFile: null }

export default function LibroForm({ onSaved, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setForm((f) => ({ ...f, [name]: files[0] }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  const uploadFile = async (bucket, file, pathPrefix) => {
    const ext = file.name.split('.').pop()
    const path = `${pathPrefix}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })
    if (error) throw new Error(`Error subiendo archivo: ${error.message}`)
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let portada_url = null

      if (form.portadaFile) {
        setProgress('Subiendo portada…')
        portada_url = await uploadFile('portadas-libros', form.portadaFile, 'libro')
      }

      setProgress('Guardando libro…')
      const { error: dbError } = await supabase.from('libros').insert({
        titulo: form.titulo,
        descripcion: form.descripcion || null,
        portada_url,
        activo: true,
      })

      if (dbError) throw new Error(dbError.message)
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setProgress('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-cafe-medio mb-1.5">Título del libro *</label>
        <input
          type="text"
          name="titulo"
          required
          value={form.titulo}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-marfil border border-arena rounded-xl text-cafe-oscuro focus:outline-none focus:border-terracota transition-colors"
          placeholder="Ej: La villa von Bernard"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cafe-medio mb-1.5">Descripción (opcional)</label>
        <textarea
          name="descripcion"
          rows={3}
          value={form.descripcion}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-marfil border border-arena rounded-xl text-cafe-oscuro focus:outline-none focus:border-terracota transition-colors resize-none"
          placeholder="Breve descripción del libro…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cafe-medio mb-1.5">Imagen de portada (JPG / PNG)</label>
        <input
          type="file"
          name="portadaFile"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-sm text-cafe-medio file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-terracota/10 file:text-terracota file:font-semibold hover:file:bg-terracota/20 cursor-pointer"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
      )}
      {progress && (
        <p className="text-terracota text-sm font-medium">{progress}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-terracota hover:bg-ambar disabled:opacity-50 text-crema font-semibold rounded-xl transition-colors"
        >
          {loading ? 'Guardando…' : 'Crear Libro'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-arena hover:border-cafe-medio text-cafe-medio rounded-xl transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
