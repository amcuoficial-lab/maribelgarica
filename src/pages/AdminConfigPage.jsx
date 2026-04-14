import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminConfigPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    const { data: items, error } = await supabase.from('site_settings').select('*').order('id')
    if (error) console.error('Error fetching site_settings:', error)
    else {
      // Si solo existe 'global', intentamos restaurar las secciones básicas
      if (items?.length === 1 && items[0].id === 'global') {
        console.warn('Solo se encontró sección global. Restaurando secciones por defecto...')
        await seedDatabase()
        const { data: reloaded } = await supabase.from('site_settings').select('*').order('id')
        setData(reloaded || items)
      } else {
        setData(items || [])
      }
    }
    setLoading(false)
  }

  const seedDatabase = async () => {
    // Definimos las secciones que faltan con contenido por defecto
    const sections = [
      { id: 'hero', section_name: 'Banner Principal (Hero)', content: { title: 'Maribel García', subtitle: 'Guardiana de Historias', tagline: 'Cuentos y Museos', description: 'Narradora oral, museóloga y gestora cultural.', bg_image: '' } },
      { id: 'about', section_name: 'Biografía / Sobre mí', content: { title: 'Sobre Maribel', bio: 'Me dedico a rescatar historias...', photo: '' } },
      { id: 'festival', section_name: 'Festival Los 50 que Cuentan', content: { title: 'Festival Los 50 que Cuentan', location: 'Olavarría, Argentina', description: 'Un encuentro de narración oral...', main_image: '', gallery: [] } },
      { id: 'trayectoria', section_name: 'Trayectoria & Proyectos', content: { title: 'Trayectoria', description: 'Giras y proyectos internacionales', projects: [] } },
      { id: 'podcast', section_name: 'Podcast & Spotify', content: { title: 'Micro-acentos', description: 'Escucha mis historias en Spotify', spotify_url: '' } },
      { id: 'libros', section_name: 'Sección Libros (Intro)', content: { title: 'Mis Libros', intro: 'Publicaciones y audiolibros' } },
      { id: 'contact', section_name: 'Contacto', content: { title: 'Hablemos', text: 'Envíame un mensaje y te responderé pronto.', email: 'maribelmuseos@hotmail.com' } }
    ]

    for (const s of sections) {
      await supabase.from('site_settings').upsert(s)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async () => {
    if (!selectedItem) return
    setSaving(true)
    setMessage(null)

    // Preparamos los datos
    const updateData = selectedItem.id === 'global' 
      ? { ...selectedItem } // Para global guardamos las columnas directamente
      : { content: selectedItem.content } // Para el resto usamos la columna content

    const { error } = await supabase
      .from('site_settings')
      .update(updateData)
      .eq('id', selectedItem.id)

    setSaving(false)
    if (error) setMessage({ type: 'error', text: 'Error guardando: ' + error.message })
    else {
      setMessage({ type: 'success', text: '¡Cambios guardados correctamente!' })
      setTimeout(() => {
        setMessage(null)
        fetchData()
      }, 2000)
    }
  }

  const onUpload = async (file, onDone) => {
    if (!file) return
    setSaving(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `site/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('site-assets').upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from('site-assets').getPublicUrl(path)
      onDone(data.publicUrl)
    } catch (err) {
      alert('Error subiendo imagen: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="p-20 text-center font-display text-cafe-medio animate-pulse text-2xl">
      Cargando configuración...
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display text-cafe-oscuro">Configuración del Sitio</h2>
          <p className="text-sm text-cafe-medio mt-1 italic">Vuelve a gestionar tu web de forma sencilla.</p>
        </div>
        {selectedItem && (
          <button 
            onClick={() => setSelectedItem(null)}
            className="text-terracota font-bold text-sm bg-terracota/5 px-4 py-2 rounded-xl hover:bg-terracota/10 transition-all"
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
              className="group p-6 bg-white border border-arena/30 rounded-2xl text-left hover:border-terracota hover:shadow-xl transition-all"
            >
              <h4 className="font-bold text-cafe-oscuro group-hover:text-terracota mb-1">{item.section_name || item.id}</h4>
              <p className="text-[10px] text-cafe-medio uppercase tracking-widest bg-marfil px-2 py-0.5 rounded-full inline-block">ID: {item.id}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-crema border border-arena/30 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 bg-marfil/50 border-b border-arena/30 flex justify-between items-center">
            <h3 className="font-display text-2xl text-cafe-oscuro">{selectedItem.section_name || selectedItem.id}</h3>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-terracota text-crema font-bold rounded-xl hover:bg-ambar transition-all shadow-md disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

          <div className="p-8">
            <ItemFields 
              item={selectedItem} 
              onUpload={onUpload}
              onChange={(newData) => {
                if (selectedItem.id === 'global') {
                  setSelectedItem({ ...selectedItem, ...newData }) // merge a nivel de root
                } else {
                  setSelectedItem({ ...selectedItem, content: newData })
                }
              }} 
            />
          </div>

          {message && (
            <div className={`p-4 text-center font-bold text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ItemFields({ item, onChange, onUpload }) {
  const { id } = item
  // Para global, el contenido es el item mismo. Para otros, es item.content.
  const content = id === 'global' ? item : item.content

  if (!content && id !== 'global') return <p className="text-cafe-medio italic">Cargando contenido de sección...</p>

  const updateField = (key, value) => onChange({ ...content, [key]: value })
  const updateNested = (parent, key, value) => onChange({ ...content, [parent]: { ...content[parent], [key]: value } })

  const Input = ({ label, value, field, multiline = false, nested }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-cafe-medio uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => nested ? updateNested(nested, field, e.target.value) : updateField(field, e.target.value)}
          rows={5}
          className="w-full px-4 py-2.5 bg-marfil border border-arena/50 rounded-xl focus:ring-2 focus:ring-terracota/20 outline-none transition-all resize-none text-cafe-oscuro"
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => nested ? updateNested(nested, field, e.target.value) : updateField(field, e.target.value)}
          className="w-full px-4 py-2.5 bg-marfil border border-arena/50 rounded-xl focus:ring-2 focus:ring-terracota/20 outline-none transition-all text-cafe-oscuro font-medium"
        />
      )}
    </div>
  )

  const ImageField = ({ label, value, field }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-cafe-medio uppercase tracking-wider">{label}</label>
      <div className="flex gap-4 items-center p-4 bg-marfil rounded-2xl border border-arena/50">
        <div className="w-40 h-24 bg-arena/20 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
          {value ? <img src={value} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-arena">Sin imagen</div>}
        </div>
        <div className="flex-1 space-y-2">
           <label className="inline-block px-4 py-2 bg-white border border-arena text-cafe-medio text-xs font-bold rounded-lg cursor-pointer hover:bg-arena/10 transition-colors">
             Cambiar Foto
             <input type="file" className="hidden" accept="image/*" onChange={(e) => onUpload(e.target.files[0], (url) => updateField(field, url))} />
           </label>
           <p className="text-[10px] text-cafe-claro truncate">{value || 'No hay archivo seleccionado'}</p>
        </div>
      </div>
    </div>
  )

  if (id === 'global' || id === 'settings' || id === 'general') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Nombre del Sitio" value={content.site_name} field="site_name" />
          <Input label="Email de Contacto" value={content.contact_email} field="contact_email" />
        </div>
        <div className="bg-arena/10 p-6 rounded-2xl border border-arena/20 space-y-4">
           <h4 className="font-display text-lg text-cafe-oscuro">Redes Sociales</h4>
           <div className="grid grid-cols-2 gap-4">
             <Input label="Instagram" value={content.social_links?.instagram} field="instagram" nested="social_links" />
             <Input label="YouTube" value={content.social_links?.youtube} field="youtube" nested="social_links" />
             <Input label="Spotify" value={content.social_links?.spotify} field="spotify" nested="social_links" />
             <Input label="TikTok" value={content.social_links?.tiktok} field="tiktok" nested="social_links" />
           </div>
        </div>
      </div>
    )
  }

  if (id === 'hero') {
    return (
      <div className="space-y-6">
        <Input label="Título Principal" value={content.title} field="title" />
        <Input label="Subtítulo" value={content.subtitle} field="subtitle" />
        <Input label="Tagline" value={content.tagline} field="tagline" />
        <Input label="Descripción" value={content.description} field="description" multiline />
        <ImageField label="Imagen de Fondo" value={content.bg_image} field="bg_image" />
      </div>
    )
  }

  if (id === 'about') {
    return (
      <div className="space-y-6">
        <Input label="Título de Sección" value={content.title} field="title" />
        <Input label="Biografía" value={content.bio} field="bio" multiline />
        <ImageField label="Foto Perfil" value={content.photo} field="photo" />
      </div>
    )
  }

  if (id === 'festival') {
    const gallery = content.gallery || []
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Input label="Título" value={content.title} field="title" />
          <Input label="Lugar/Fecha" value={content.location} field="location" />
        </div>
        <Input label="Descripción" value={content.description} field="description" multiline />
        <ImageField label="Imagen Banner" value={content.main_image} field="main_image" />
        
        <div className="pt-4 border-t border-arena/30">
          <h4 className="font-bold text-cafe-oscuro text-sm mb-4">Galería de Fotos ({gallery.length})</h4>
          <div className="grid grid-cols-3 gap-3">
             {gallery.map((g, i) => (
               <div key={i} className="aspect-square bg-marfil border border-arena rounded-xl overflow-hidden relative group">
                 <img src={g.photo} className="w-full h-full object-cover" />
                 <button 
                   onClick={() => updateField('gallery', gallery.filter((_, idx)=>idx!==i))}
                   className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg>
                 </button>
               </div>
             ))}
             <label className="aspect-square border-2 border-dashed border-arena rounded-xl flex items-center justify-center cursor-pointer hover:bg-arena/10 transition-colors">
               <span className="text-cafe-medio font-bold text-xs">+ Foto</span>
               <input type="file" className="hidden" accept="image/*" onChange={(e) => onUpload(e.target.files[0], (url) => updateField('gallery', [...gallery, {photo: url}]))} />
             </label>
          </div>
        </div>
      </div>
    )
  }

  if (id === 'trayectoria') {
    const projects = content.projects || []
    const updateProject = (i, up) => {
      const np = [...projects]; np[i] = { ...np[i], ...up }; updateField('projects', np)
    }
    return (
      <div className="space-y-8">
        <Input label="Título" value={content.title} field="title" />
        <Input label="Intro" value={content.description} field="description" multiline />
        <div className="space-y-4">
           {projects.map((p, i) => (
             <div key={i} className="p-4 bg-marfil border border-arena/50 rounded-2xl space-y-4">
                <div className="flex justify-between">
                  <h5 className="font-bold text-cafe-oscuro text-sm">Hito #{i+1}</h5>
                  <button onClick={() => updateField('projects', projects.filter((_, idx)=>idx!==i))} className="text-red-500 text-[10px] font-bold">ELIMINAR</button>
                </div>
                <Input label="Título" value={p.title} field="title" onChange={(f, v) => updateProject(i, {title: v})} />
                <Input label="Año/Lugar" value={p.year} field="year" onChange={(f, v) => updateProject(i, {year: v})} />
                <ImageField label="Foto" value={p.photo} field="photo" onUpload={(f, url) => updateProject(i, {photo: url})} />
             </div>
           ))}
           <button onClick={() => updateField('projects', [...projects, {title: '', year: '', photo: ''}])} className="w-full py-3 border-2 border-dashed border-arena rounded-2xl text-cafe-medio font-bold hover:bg-arena/5">
             + Agregar Nuevo Hito a la Trayectoria
           </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-10 text-center border-2 border-dashed border-arena/50 rounded-2xl italic text-cafe-medio">
       Sección especial: esta sección ({id}) no tiene campos simples definidos.
    </div>
  )
}
