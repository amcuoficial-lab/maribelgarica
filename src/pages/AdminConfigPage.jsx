import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ImageCropperModal from '../components/admin/ImageCropperModal'

/**
 * Los IDs reales en la base de datos son:
 * - global: Configuración General
 * - hero: Configuración del Banner
 * - about: Configuración Biografía
 * - festival: Configuración Festival
 * - trayectoria: Configuración Trayectoria
 */

// --- Sub-componentes fuera para mayor estabilidad ---

function AdminInput({ label, value, field, onChange, multiline = false }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-cafe-medio uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
          rows={5}
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
          <img src={value} alt={label} className="w-20 h-20 object-cover rounded-lg border border-arena shadow-sm" />
        )}
        <label className="flex-1 cursor-pointer">
          <div className="w-full px-4 py-3 bg-marfil border border-arena border-dashed rounded-xl text-cafe-medio text-sm text-center hover:bg-arena/5 transition-colors">
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
  const sectionId = id.toLowerCase().trim()

  // --- SECCIÓN: GLOBAL (Configuración General) ---
  if (sectionId === 'global' || sectionId === 'settings' || sectionId === 'general') {
    return (
      <div className="space-y-6">
        <AdminInput label="Nombre del Sitio" value={content.site_name} field="site_name" onChange={updateField} />
        <AdminInput label="Email de contacto" value={content.contact_email} field="contact_email" onChange={updateField} />
        <AdminImageField label="Foto de Maribel (Circular)" value={content.profile_photo} field="profile_photo" aspectRatio={1} onStartCrop={onStartCrop} updateField={updateField} />
      </div>
    )
  }

  // --- SECCIÓN: HERO (Banner Principal) ---
  if (sectionId === 'hero') {
    return (
      <div className="space-y-6">
        <AdminInput label="Título Principal" value={content.title} field="title" onChange={updateField} />
        <AdminInput label="Subtítulo" value={content.subtitle} field="subtitle" onChange={updateField} multiline />
        <AdminImageField label="Imagen de Fondo" value={content.background_image} field="background_image" aspectRatio={16 / 9} onStartCrop={onStartCrop} updateField={updateField} />
      </div>
    )
  }

  // --- SECCIÓN: ABOUT (Biografía) ---
  if (sectionId === 'about' || sectionId === 'bio') {
    return (
      <div className="space-y-6">
        <AdminInput label="Título de Sección" value={content.title} field="title" onChange={updateField} />
        <AdminInput label="Contenido (HTML permitido)" value={content.text} field="text" onChange={updateField} multiline />
        <AdminImageField label="Foto Biografía" value={content.photo} field="photo" aspectRatio={3 / 4} onStartCrop={onStartCrop} updateField={updateField} />
      </div>
    )
  }

  // --- SECCIÓN: FESTIVAL (Festival Los 50 que Cuentan) ---
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
              <div key={i} className="relative group aspect-[4/5] bg-marfil border border-arena rounded-xl overflow-hidden shadow-sm">
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

  // --- SECCIÓN: TRAYECTORIA ---
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
            <div key={i} className="p-6 bg-marfil border border-arena rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-cafe-oscuro">Proyecto #{i + 1}</h4>
                <button 
                  onClick={() => updateField('projects', projects.filter((_, idx) => idx !== i))} 
                  className="px-3 py-1 text-red-500 text-[10px] font-bold uppercase border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
              <AdminInput label="Título Proyecto" value={p.title} field="title" onChange={(f, v) => updateProject(i, {title: v})} />
              <AdminInput label="Año" value={p.year} field="year" onChange={(f, v) => updateProject(i, {year: v})} />
              <AdminImageField label="Foto del Hito" value={p.photo} field="photo" aspectRatio={3 / 4} onStartCrop={onStartCrop} updateField={(f, v) => updateProject(i, {photo: v})} />
            </div>
          ))}
          <button onClick={() => updateField('projects', [...projects, {title: '', year: '', photo: ''}])} className="py-4 border-2 border-dashed border-arena rounded-2xl text-cafe-medio font-bold hover:bg-arena/5 hover:text-terracota transition-all">
            + Añadir Proyecto/Hito a la Trayectoria
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

  const fetchData = async () => {
    setLoading(true)
    const { data: items, error } = await supabase.from('site_settings').select('*').order('id')
    if (error) console.error('Error fetching site_settings:', error)
    else setData(items || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
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
      
      const { data: uploadRes } = supabase.storage.from('site-assets').getPublicUrl(path)
      if (onDone) onDone(uploadRes.publicUrl)
      return uploadRes.publicUrl
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
      // Pequeña pausa y recargar lista
      setTimeout(() => {
        setMessage(null)
        fetchData()
      }, 2000)
    }
  }

  if (loading) return (
    <div className="p-20 flex justify-center">
      <div className="w-10 h-10 border-4 border-terracota border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display text-cafe-oscuro">Configuración del Sitio</h2>
          <p className="text-xs text-cafe-medio mt-1">Gestiona el contenido dinámico de las secciones principales.</p>
        </div>
        {selectedItem && (
          <button 
            onClick={() => setSelectedItem(null)}
            className="flex items-center gap-2 px-4 py-2 text-terracota font-bold text-sm bg-terracota/5 rounded-xl hover:bg-terracota/10 transition-colors"
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
              className="flex items-center justify-between p-6 bg-crema border border-arena/50 rounded-2xl text-left hover:border-terracota hover:shadow-lg transition-all group"
            >
              <div>
                <h4 className="font-bold text-cafe-oscuro group-hover:text-terracota transition-colors">{item.section_name}</h4>
                <p className="text-[10px] text-cafe-medio mt-1 uppercase tracking-widest bg-marfil px-2 py-0.5 rounded-full inline-block">ID: {item.id}</p>
              </div>
              <span className="w-10 h-10 rounded-full bg-marfil flex items-center justify-center text-arena group-hover:text-terracota group-hover:bg-crema shadow-sm transition-all">→</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-crema border border-arena/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 bg-arena/10 border-b border-arena/30 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-cafe-medio uppercase tracking-tighter mb-1">Editando Sección</p>
              <h3 className="font-display text-2xl text-cafe-oscuro">{selectedItem.section_name}</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-terracota text-crema font-bold rounded-xl hover:bg-ambar hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-md"
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
            <div className={`p-4 text-center text-sm font-bold animate-in slide-in-from-bottom duration-300 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
