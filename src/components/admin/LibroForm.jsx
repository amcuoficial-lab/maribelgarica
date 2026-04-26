import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const emptyForm = { titulo: '', descripcion: '', audioFile: null, portadaFile: null }

export default function LibroForm({ onSaved, onCancel, initialData }) {
  const [form, setForm] = useState(initialData || emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files && name === 'portadaFile') {
      setForm((f) => ({ ...f, portadaFile: files[0] }))
    } else if (files && name === 'audioFile') {
      setForm((f) => ({ ...f, audioFile: files[0] }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  const uploadFile = async (bucket, file, pathPrefix) => {
    const ext = file.name ? file.name.split('.').pop() : 'jpg'
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

      let audio_url = null
      if (form.audioFile) {
        setProgress('Subiendo audio del libro completo…')
        audio_url = await uploadFile('audios-cuentos', form.audioFile, 'libro-completo')
      }

      setProgress('Guardando libro…')
      
      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion || null,
        es_publico: form.es_publico !== false,
        activo: true,
      }
      
      if (portada_url) payload.portada_url = portada_url
      if (audio_url) payload.audio_url = audio_url

      if (initialData?.id) {
        const { error: dbError } = await supabase
          .from('libros')
          .update(payload)
          .eq('id', initialData.id)
        if (dbError) throw new Error(dbError.message)
      } else {
        const { error: dbError } = await supabase
          .from('libros')
          .insert(payload)
        if (dbError) throw new Error(dbError.message)
      }

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

      <div className="flex items-center gap-3 py-2 px-4 bg-marfil border border-arena rounded-xl shadow-inner">
        <input
          type="checkbox"
          id="es_publico"
          name="es_publico"
          checked={form.es_publico !== false}
          onChange={(e) => setForm(f => ({ ...f, es_publico: e.target.checked }))}
          className="w-5 h-5 accent-terracota cursor-pointer"
        />
        <label htmlFor="es_publico" className="text-sm font-medium text-cafe-oscuro cursor-pointer">
          Libro Público (Visible en la web general)
        </label>
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
        <label className="block text-sm font-medium text-cafe-medio mb-1.5">Audio del Libro Completo (opcional)</label>
        <div className="p-4 bg-marfil border border-arena border-dashed rounded-xl">
          <input
            type="file"
            name="audioFile"
            accept="audio/*"
            onChange={handleChange}
            className="w-full text-sm text-cafe-medio file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-dorado file:text-white file:font-semibold hover:file:bg-amber cursor-pointer transition-all"
          />
          <p className="text-[10px] text-cafe-claro mt-2">Sube la versión completa del audiolibro si la tienes.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cafe-medio mb-1.5">Imagen de portada (JPG / PNG)</label>
        <div className="p-4 bg-marfil border border-arena border-dashed rounded-xl">
          <input
            type="file"
            name="portadaFile"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-cafe-medio file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-terracota file:text-white file:font-semibold hover:file:bg-ambar cursor-pointer transition-all"
          />
          <p className="text-[10px] text-cafe-claro mt-2">Sube la imagen ya recortada para obtener el mejor resultado.</p>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
      )}
      {progress && (
        <p className="text-terracota text-sm font-medium animate-pulse">{progress}</p>
      )}

      <div className="flex gap-4 pt-4 border-t border-arena/20">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-terracota hover:bg-ambar disabled:opacity-50 text-crema font-bold rounded-xl transition-all shadow-md transform hover:scale-[1.02]"
        >
          {loading ? 'Guardando…' : initialData ? 'Guardar Cambios' : 'Crear Libro'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-arena hover:bg-arena/10 text-cafe-medio font-bold rounded-xl transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
