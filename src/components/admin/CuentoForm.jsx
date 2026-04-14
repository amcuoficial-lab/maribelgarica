import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

const emptyForm = { titulo: '', descripcion: '', audioFile: null, fotoFile: null, fotosExtra: [] }

export default function CuentoForm({ onSaved, onCancel, libroId }) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'fotosExtra') {
      setForm((f) => ({ ...f, fotosExtra: Array.from(files) }))
    } else if (files) {
      setForm((f) => ({ ...f, [name]: files[0] }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  const uploadFile = async (bucket, file, pathPrefix) => {
    const ext = file.name.split('.').pop()
    const path = `${pathPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`
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
      if (!form.audioFile) throw new Error('Seleccioná un archivo de audio.')
      if (!form.fotoFile) throw new Error('Seleccioná al menos una foto principal.')

      const token = uuidv4().replace(/-/g, '').slice(0, 16)

      setProgress('Subiendo audio…')
      const audio_url = await uploadFile('audios-cuentos', form.audioFile, token)

      setProgress('Subiendo foto principal…')
      const foto_url = await uploadFile('fotos-cuentos', form.fotoFile, token)

      // Subir fotos extra si las hay
      let fotos_extra = []
      if (form.fotosExtra.length > 0) {
        for (let i = 0; i < form.fotosExtra.length; i++) {
          setProgress(`Subiendo foto ${i + 2} de ${form.fotosExtra.length + 1}…`)
          const url = await uploadFile('fotos-cuentos', form.fotosExtra[i], `${token}-extra-${i}`)
          fotos_extra.push(url)
        }
      }

      setProgress('Guardando cuento…')
      const { error: dbError } = await supabase.from('microcuentos').insert({
        titulo: form.titulo,
        descripcion: form.descripcion || null,
        token_unico: token,
        audio_url,
        foto_url,
        fotos_extra: fotos_extra.length > 0 ? fotos_extra : null,
        activo: true,
        libro_id: libroId || null,
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
        <label className="block text-sm font-medium text-cafe-medio mb-1.5">Título del cuento *</label>
        <input
          type="text"
          name="titulo"
          required
          value={form.titulo}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-marfil border border-arena rounded-xl text-cafe-oscuro focus:outline-none focus:border-terracota transition-colors"
          placeholder="El nombre del cuento"
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
          placeholder="Breve descripción del cuento…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cafe-medio mb-1.5">Audio (MP3 / M4A) *</label>
        <input
          type="file"
          name="audioFile"
          required
          accept="audio/*"
          onChange={handleChange}
          className="w-full text-sm text-cafe-medio file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-terracota/10 file:text-terracota file:font-semibold hover:file:bg-terracota/20 cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cafe-medio mb-1.5">Foto principal / portada (JPG / PNG) *</label>
        <input
          type="file"
          name="fotoFile"
          required
          accept="image/*"
          onChange={handleChange}
          className="w-full text-sm text-cafe-medio file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-terracota/10 file:text-terracota file:font-semibold hover:file:bg-terracota/20 cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cafe-medio mb-1.5">
          Fotos adicionales (opcional, podés seleccionar varias)
        </label>
        <input
          type="file"
          name="fotosExtra"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="w-full text-sm text-cafe-medio file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-dorado/10 file:text-dorado file:font-semibold hover:file:bg-dorado/20 cursor-pointer"
        />
        {form.fotosExtra.length > 0 && (
          <p className="text-xs text-cafe-claro mt-1">{form.fotosExtra.length} foto{form.fotosExtra.length !== 1 ? 's' : ''} extra seleccionada{form.fotosExtra.length !== 1 ? 's' : ''}</p>
        )}
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
          {loading ? 'Guardando…' : 'Crear Cuento'}
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
