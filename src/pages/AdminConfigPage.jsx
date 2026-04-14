import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ImageCropperModal from '../components/admin/ImageCropperModal'

// --- Sub-componentes fuera para mayor estabilidad ---

function AdminInput({ label, value, field, onChange, multiline = false }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-cafe-medio uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 bg-marfil border border-arena rounded-xl text-cafe-oscuro focus:outline-none focus:border-terracota transition-colors resize-none"
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full px-4 py-2.5 bg-marfil border border-arena rounded-xl text-cafe-oscuro focus:outline-none focus:border-terracota transition-colors"
        />
      )}
    </div>
  )
}

function AdminImageField({ label, value, field, onStartCrop, updateField, aspectRatio = 1 }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-cafe-medio uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <img src={value} alt={label} className="w-16 h-16 object-cover rounded-lg border border-arena shadow-sm" />
        )}
        <label className="flex-1 cursor-pointer">
          <div className="w-full px-4 py-2.5 bg-marfil border border-arena border-dashed rounded-xl text-cafe-medio text-sm text-center hover:bg-arena/5 transition-colors">
            {value ? 'Cambiar Imagen' : 'Subir Imagen'}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                onStartCrop(file, aspectRatio, (url) => updateField(field, url))
              }
            }}
          />
        </label>
      </div>
    </div>
  )
}

function ItemFields({ item, onChange, onStartCrop }) {
  const { id, content } = item
  if (!content) return <p className="text-cafe-medio text-sm italic">Cargando contenido...</p>

  const updateField = (key, value) => onChange({ ...content, [key]: value })
  
  // --- Renderización por ID ---
  const sectionId = id.toLowerCase().trim()

  if (sectionId === 'settings' || sectionId === 'general') {
    return (
      <div className="space-y-6">
        <AdminInput label="Site Name" value={content.site_name} field="site_name" onChange={updateField} />
        <AdminInput label="Email de contacto" value={content.contact_email} field="contact_email" onChange={updateField} />
        <AdminImageField label="Foto de Maribel (Circular)" value={content.profile_photo} field="profile_photo" aspectRatio={1} onStartCrop={onStartCrop} updateField={updateField} />
      </div>
    )
  }

  if (sectionId === 'hero') {
    return (
      <div className="space-y-6">
        <AdminInput label="Título Principal" value={content.title} field="title" onChange={updateField} />
        <AdminInput label="Subtítulo" value={content.subtitle} field="subtitle" onChange={updateField} multiline />
        <AdminImageField label="Imagen de Fondo" value={content.background_image} field="background_image" aspectRatio={16 / 9} onStartCrop={onStartCrop} updateField={updateField} />
      </div>
    )
  }

  if (sectionId === 'about' || sectionId === 'bio') {
    return (
      <div className="space-y-6">
        <AdminInput label="Título de Sección" value={content.title} field="title" onChange={updateField} />
        <AdminInput label="Contenido (HTML permitido)" value={content.text} field="text" onChange={updateField} multiline />
        <AdminImageField label="Foto Biografía" value={content.photo} field="photo" aspectRatio={3 / 4} onStartCrop={onStartCrop} updateField={updateField} />
      </div>
    )
  }

  if (sectionId === 'festival') {
    const gallery = content.gallery || []
    const updateGalleryItem = (index, newData) => {
      const newGallery = [...gallery]
      newGallery[index] = { ...newGallery[index], ...newData }
      updateField('gallery', newGallery)
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminInput label="Título" value={content.title} field="title" onChange={updateField} />
          <AdminInput label="Lugar/Fecha" value={content.location} field="location" onChange={updateField} />
        </div>
        <AdminInput label="Descripción / Intro" value={content.description} field="description" onChange={updateField} multiline />
        <AdminImageField label="Imagen Principal (Banner)" value={content.main_image} field="main_image" aspectRatio={16 / 9} onStartCrop={onStartCrop} updateField={updateField} />
        
        <div className="pt-4 border-t border-arena/30">
          <h4 className="text-sm font-bold text-cafe-oscuro mb-4">Galería del Festival</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
              <div key={i} className="relative group aspect-[4/5] bg-marfil border border-arena rounded-xl overflow-hidden">
                <img src={img.photo} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-cafe-oscuro/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
                  <label className="cursor-pointer bg-crema text-cafe-oscuro px-2 py-1 rounded text-[10px] font-bold">
                    Cambiar
                    <input type="file" className="hidden" accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) onStartCrop(file, 4/5, (url) => updateGalleryItem(i, {photo: url}))
                      }} 
                    />
                  </label>
                  <button onClick={() => updateField('gallery', gallery.filter((_, idx) => idx !== i))} className="text-white/80 hover:text-white text-[10px] font-medium">Eliminar</button>
                </div>
              </div>
            ))}
            <label className="aspect-[4/5] border-2 border-dashed border-arena rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-arena/5 transition-colors">
              <span className="text-cafe-medio font-bold text-xs">+ Foto</span>
              <input type="file" className="hidden" accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onStartCrop(file, 4/5, (url) => updateField('gallery', [...gallery, {photo: url}]))
                }} 
              />
            </label>
          </div>
        </div>
      </div>
    )
  }

  if (sectionId === 'trayectoria') {
    const projects = content.projects || []
    const updateProject = (index, newData) => {
      const newProjects = [...projects]
      newProjects[index] = { ...newProjects[index], ...newData }
      updateField('projects', newProjects)
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {projects.map((p, i) => (
            <div key={i} className="p-4 bg-marfil border border-arena rounded-2xl space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-cafe-oscuro">Proyecto #{i + 1}</h4>
                <button onClick={() => updateField('projects', projects.filter((_, idx) => idx !== i))} className="text-red-500 text-xs">Eliminar</button>
              </div>
              <AdminInput label="Título Proyecto" value={p.title} field="title" onChange={(f, v) => updateProject(i, {title: v})} />
              <AdminInput label="Año" value={p.year} field="year" onChange={(f, v) => updateProject(i, {year: v})} />
              <AdminImageField label="Foto del Hito" value={p.photo} field="photo" aspectRatio={3 / 4} onStartCrop={onStartCrop} updateField={(f, v) => updateProject(i, {photo: v})} />
            </div>
          ))}
          <button onClick={() => updateField('projects', [...projects, {title: '', year: '', photo: ''}])} className="py-3 border-2 border-dashed border-arena rounded-2xl text-cafe-medio font-bold hover:bg-arena/5">
            + Añadir Proyecto/Hito
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-10 text-center bg-marfil border border-arena rounded-2xl">
      <p className="text-cafe-medio">Esta sección ({id}) no tiene campos configurados para edición directa.</p>
    </div>
  )
}

// --- Componente Principal ---

export default function AdminConfigPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  // Crop state
  const [cropData, setCropData] = useState({
    isOpen: false,
    file: null,
    aspectRatio: 1,
    onDone: null
  })

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      setLoading(true)
      // FIX: El nombre de la tabla correcto es site_settings, no site_config
      const { data: items, error } = await supabase.from('site_settings').select('*').order('id')
      if (isMounted) {
        if (error) console.error('Error fetching site_settings:', error)
        else setData(items || [])
        setLoading(false)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [])

  const handleStartCrop = (file, aspectRatio, onDone) => {
    if (!file) return
    setCropData({
      isOpen: true,
      file,
      aspectRatio,
      onDone
    })
  }

  const handleUpload = async (file, onDone) => {
    if (!file) return
    setSaving(true)
    try {
      const ext = file.name ? file.name.split('.').pop() : 'jpg'
      const path = `site/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('site-assets').upload(path, file)
      if (error) throw error
      
      const { data } = supabase.storage.from('site-assets').getPublicUrl(path)
      if (onDone) onDone(data.publicUrl)
      return data.publicUrl
    } catch (err) {
      alert('Error subiendo imagen: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    if (!selectedItem) return
    setSaving(true)
    setMessage(null)
    
    const { error } = await supabase
      .from('site_settings')
      .update({ content: selectedItem.content })
      .eq('id', selectedItem.id)

    setSaving(false)
    if (error) setMessage({ type: 'error', text: 'Error guardando: ' + error.message })
    else {
      setMessage({ type: 'success', text: '¡Cambios guardados correctamente!' })
      // fetchData equivalent
      const { data: items } = await supabase.from('site_settings').select('*').order('id')
      if (items) setData(items)
    }
  }

  if (loading) return (
    <div className="p-20 flex justify-center">
      <div className="w-8 h-8 border-2 border-terracota border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display text-cafe-oscuro">Configuración del Sitio</h2>
        {selectedItem && (
          <button 
            onClick={() => setSelectedItem(null)}
            className="text-terracota font-bold text-sm hover:underline"
          >
            ← Volver a la lista
          </button>
        )}
      </div>

      {!selectedItem ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="flex items-center justify-between p-6 bg-crema border border-arena/50 rounded-2xl text-left hover:border-terracota hover:shadow-md transition-all group"
            >
              <div>
                <h4 className="font-bold text-cafe-oscuro group-hover:text-terracota transition-colors">{item.section_name}</h4>
                <p className="text-xs text-cafe-medio mt-1">ID: {item.id}</p>
              </div>
              <span className="text-arena group-hover:text-terracota transition-colors">→</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-crema border border-arena/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 bg-arena/10 border-b border-arena/30 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-cafe-medio uppercase tracking-tighter mb-1">Sección</p>
              <h3 className="font-display text-xl text-cafe-oscuro">{selectedItem.section_name}</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-terracota text-crema font-bold rounded-xl hover:bg-ambar transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>

          <div className="p-8">
            <ItemFields 
              item={selectedItem} 
              onStartCrop={handleStartCrop}
              onChange={(newContent) => setSelectedItem({ ...selectedItem, content: newContent })} 
            />
          </div>

          {message && (
            <div className={`p-4 text-center text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
        </div>
      )}

      {/* MODAL GLOBAL DE RECORTE */}
      {cropData.isOpen && (
        <ImageCropperModal 
          file={cropData.file}
          aspectRatio={cropData.aspectRatio}
          onCancel={() => setCropData({ ...cropData, isOpen: false })}
          onCrop={(croppedFile) => {
            setCropData({ ...cropData, isOpen: false })
            handleUpload(croppedFile, cropData.onDone)
          }}
        />
      )}
    </div>
  )
}
