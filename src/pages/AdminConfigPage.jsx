import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminConfigPage() {
  const [sections, setSections] = useState([])
  const [globalSettings, setGlobalSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch sections and global settings in parallel
      const [sectionsRes, settingsRes] = await Promise.all([
        supabase.from('site_sections').select('*').order('section_order'),
        supabase.from('site_settings').select('*').eq('id', 'global').maybeSingle()
      ])

      if (sectionsRes.error) throw sectionsRes.error
      
      // If no sections, try to seed them
      if (!sectionsRes.data || sectionsRes.data.length === 0) {
        console.warn('No se encontraron secciones en site_sections. Inicializando...')
        await seedDatabase()
        const { data: reloaded } = await supabase.from('site_sections').select('*').order('section_order')
        setSections(reloaded || [])
      } else {
        setSections(sectionsRes.data)
      }

      setGlobalSettings(settingsRes.data || { id: 'global', site_name: 'Maribel García', social_links: {} })
    } catch (err) {
      console.error('Error fetching data:', err)
      setMessage({ type: 'error', text: 'Error cargando datos: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  const seedDatabase = async () => {
    const defaultSections = [
      { id: 'hero', section_name: 'Hero / Bienvenida', section_order: 1, content: { title: 'Maribel García', subtitle: 'Fundadora del Encuentro “Los Cincuenta que Cuentan”', tagline: 'Narradora Oral · Escritora · Locutora · Fotógrafa', description: 'Magíster en Museología Social. Fundadora de 10 museos comunitarios.', bg_image: '/fotos/hero.jpg' } },
      { id: 'about', section_name: 'Sobre Mí / Biografía', section_order: 2, content: { title: 'Una vida dedicada a las historias', bio: 'Me dedico a rescatar historias...', photo: '/fotos/sobre-mi.jpg' } },
      { id: 'festival', section_name: 'Festival Los 50 que Cuentan', section_order: 3, content: { title: 'Los 50 que Cuentan', location: 'Olavarría, Argentina', description: 'Un encuentro de narración oral...', main_image: '/fotos/festival.jpg', gallery: ['/fotos/brasil.jpg', '/fotos/mural.jpg'] } },
      { id: 'trayectoria', section_name: 'Espectáculos & Proyectos', section_order: 4, content: { title: 'Trayectoria', description: 'Tres décadas recorriendo escenarios...', projects: [{ title: 'Voces del Sur', description: 'Espectáculo de narración oral...', photo: '/fotos/escena.jpg', tag: 'Narración Oral' }] } },
      { id: 'podcast', section_name: 'Podcast & Spotify', section_order: 5, content: { title: 'Escuchá mi Podcast', description: 'Historias en Spotify', spotify_url: 'https://open.spotify.com/embed/show/3x79YfS5u2YID5U8vofN6n' } },
      { id: 'libros', section_name: 'Sección Libros (Intro)', section_order: 6, content: { title: 'Mis Libros', intro: 'Publicaciones y audiolibros' } },
      { id: 'contact', section_name: 'Contacto', section_order: 7, content: { title: 'Hablemos', text: 'Envíame un mensaje...', email: 'maribelmuseos@hotmail.com' } }
    ]

    for (const s of defaultSections) {
      await supabase.from('site_sections').upsert(s)
    }
    
    // Also ensure global exists
    await supabase.from('site_settings').upsert({ 
      id: 'global', 
      site_name: 'Maribel García', 
      contact_email: 'maribelmuseos@hotmail.com',
      social_links: { instagram: 'https://www.instagram.com/maribelgarciamuseocuentos', youtube: '', spotify: '', tiktok: '' }
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async () => {
    if (!selectedItem) return
    setSaving(true)
    setMessage(null)

    try {
      const isGlobal = selectedItem.id === 'global'
      const table = isGlobal ? 'site_settings' : 'site_sections'
      
      const { error } = await supabase
        .from(table)
        .update(selectedItem)
        .eq('id', selectedItem.id)

      if (error) throw error
      
      setMessage({ type: 'success', text: '¡Cambios guardados correctamente!' })
      setTimeout(() => {
        setMessage(null)
        if (isGlobal) {
          setGlobalSettings(selectedItem)
        } else {
          setSections(sections.map(s => s.id === selectedItem.id ? selectedItem : s))
        }
        setSelectedItem(null)
      }, 1500)
    } catch (err) {
      console.error('Save error:', err)
      setMessage({ type: 'error', text: 'Error guardando: ' + err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleMove = async (id, direction) => {
    const currentIndex = sections.findIndex(s => s.id === id)
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === sections.length - 1) return

    const newSections = [...sections]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    // Swap
    const temp = newSections[currentIndex]
    newSections[currentIndex] = newSections[targetIndex]
    newSections[targetIndex] = temp

    // Update order values
    const reordered = newSections.map((s, idx) => ({ ...s, section_order: idx + 1 }))
    setSections(reordered)

    // Sync to DB
    try {
      for (const s of reordered) {
        await supabase.from('site_sections').update({ section_order: s.section_order }).eq('id', s.id)
      }
    } catch (err) {
      console.error('Error updating order:', err)
    }
  }

  const handleToggleVisibility = async (section) => {
    const newStatus = !section.is_visible
    try {
      const { error } = await supabase
        .from('site_sections')
        .update({ is_visible: newStatus })
        .eq('id', section.id)
      
      if (!error) {
        setSections(sections.map(s => s.id === section.id ? { ...s, is_visible: newStatus } : s))
      }
    } catch (err) {
      console.error('Error toggling visibility:', err)
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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex justify-between items-end bg-crema/40 p-10 rounded-[2.5rem] border border-arena/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-terracota/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="relative z-10">
          <h2 className="text-4xl font-display text-cafe-oscuro">Super Pro CMS</h2>
          <p className="text-cafe-medio mt-2 italic">Control total de textos, fotos y el orden de tu sitio web.</p>
        </div>
        {selectedItem && (
          <button 
            onClick={() => setSelectedItem(null)}
            className="relative z-10 text-terracota font-bold text-sm bg-white border border-terracota/20 px-6 py-3 rounded-2xl hover:bg-terracota/5 transition-all shadow-sm"
          >
            ← Volver al listado
          </button>
        )}
      </div>

      {!selectedItem ? (
        <div className="space-y-8">
          {/* Global Card */}
          <div 
            onClick={() => setSelectedItem(globalSettings)}
            className="group cursor-pointer bg-cafe-oscuro p-8 rounded-[2rem] text-crema shadow-2xl relative overflow-hidden transition-all hover:scale-[1.01]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-arena/60 font-bold">Ajustes del Sitio</span>
                <h3 className="text-3xl font-display mt-1">Datos Generales</h3>
                <p className="text-arena/50 text-sm mt-4 max-w-md">Nombre de la web, redes sociales y contacto principal que aparece en el pie de página y menú.</p>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🌐</div>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-arena group-hover:text-white transition-colors">
              ABRIR CONFIGURACIÓN GLOBAL 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={2}/></svg>
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-arena/20">
            <h3 className="text-2xl font-display text-cafe-oscuro flex items-center gap-3">
              <span className="w-2 h-8 bg-terracota rounded-full" />
              Estructura de la Página
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-cafe-claro font-bold">Arrastra o usa flechas</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sections.map((item, index) => (
              <div
                key={item.id}
                className={`group flex items-center gap-6 p-6 bg-white border border-arena/30 rounded-3xl transition-all hover:shadow-xl hover:border-terracota/30 ${!item.is_visible ? 'opacity-50 grayscale bg-marfil' : ''}`}
              >
                {/* Movement Controls */}
                <div className="flex flex-col gap-2">
                  <button 
                    disabled={index === 0}
                    onClick={(e) => { e.stopPropagation(); handleMove(item.id, 'up'); }}
                    className="p-2 hover:bg-terracota/10 rounded-xl disabled:opacity-5 text-cafe-medio hover:text-terracota transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" strokeWidth={3}/></svg>
                  </button>
                  <button 
                    disabled={index === sections.length - 1}
                    onClick={(e) => { e.stopPropagation(); handleMove(item.id, 'down'); }}
                    className="p-2 hover:bg-terracota/10 rounded-xl disabled:opacity-5 text-cafe-medio hover:text-terracota transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={3}/></svg>
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-display text-cafe-oscuro group-hover:text-terracota transition-colors">
                      {item.section_name}
                    </h4>
                    {!item.is_visible && (
                      <span className="text-[9px] bg-cafe-medio text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Oculto</span>
                    )}
                  </div>
                  <div className="flex gap-4 mt-2">
                    <p className="text-[10px] text-cafe-medio uppercase tracking-widest font-bold bg-marfil px-2 py-1 rounded-lg">ID: {item.id}</p>
                    <p className="text-[10px] text-cafe-medio uppercase tracking-widest font-bold bg-marfil px-2 py-1 rounded-lg">Posición: {item.section_order}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-bold text-cafe-claro uppercase mb-1">Estado</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleVisibility(item); }}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${item.is_visible ? 'bg-terracota' : 'bg-arena'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${item.is_visible ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-8 py-3 bg-crema border border-arena/50 text-cafe-oscuro text-xs font-black rounded-2xl hover:bg-terracota hover:text-white hover:border-terracota transition-all shadow-sm active:scale-95"
                  >
                    EDITAR CONTENIDO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-arena/30 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-10 bg-marfil/50 border-b border-arena/30 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-terracota" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-terracota font-black mb-1">Centro de Edición</p>
              <h3 className="font-display text-4xl text-cafe-oscuro">{selectedItem.section_name || 'Datos Generales'}</h3>
            </div>
            <div className="flex gap-4 items-center">
              <button onClick={() => setSelectedItem(null)} className="px-6 py-2 text-cafe-medio text-xs font-bold hover:text-cafe-oscuro transition-colors">Cancelar</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-12 py-5 bg-terracota text-crema font-bold rounded-2xl hover:bg-ambar transition-all shadow-xl shadow-terracota/20 disabled:opacity-50 active:scale-95 text-sm tracking-wide"
              >
                {saving ? 'Guardando...' : 'Guardar Todos los Cambios'}
              </button>
            </div>
          </div>

          <div className="p-12">
            <ItemFields 
              item={selectedItem} 
              onUpload={onUpload}
              onChange={(newData) => setSelectedItem({ ...selectedItem, ...newData })} 
            />
          </div>

          {message && (
            <div className={`mx-12 mb-12 p-6 rounded-3xl text-center font-bold text-sm shadow-inner transition-all animate-in slide-in-from-bottom-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.type === 'success' ? '✨ ' : '⚠️ '} {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ItemFields({ item, onChange, onUpload }) {
  const { id } = item
  const isGlobal = id === 'global'
  const content = isGlobal ? item : item.content

  if (!content) return <p className="text-cafe-medio italic">Inicializando campos de edición...</p>

  const updateField = (key, value) => {
    if (isGlobal) {
      onChange({ [key]: value })
    } else {
      onChange({ content: { ...content, [key]: value } })
    }
  }

  const updateNested = (parent, key, value) => {
    if (isGlobal) {
      onChange({ [parent]: { ...item[parent], [key]: value } })
    } else {
      onChange({ content: { ...content, [parent]: { ...content[parent], [key]: value } } })
    }
  }

  const Input = ({ label, value, field, multiline = false, nested }) => (
    <div className="space-y-3">
      <label className="block text-[10px] font-black text-cafe-medio uppercase tracking-[0.2em] ml-2">{label.replace(/_/g, ' ')}</label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => nested ? updateNested(nested, field, e.target.value) : updateField(field, e.target.value)}
          rows={7}
          className="w-full px-6 py-5 bg-marfil border-2 border-arena/20 rounded-3xl focus:ring-8 focus:ring-terracota/5 focus:border-terracota outline-none transition-all resize-none text-cafe-oscuro leading-relaxed shadow-sm font-medium"
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => nested ? updateNested(nested, field, e.target.value) : updateField(field, e.target.value)}
          className="w-full px-6 py-5 bg-marfil border-2 border-arena/20 rounded-2xl focus:ring-8 focus:ring-terracota/5 focus:border-terracota outline-none transition-all text-cafe-oscuro font-bold shadow-sm"
        />
      )}
    </div>
  )

  const ImageField = ({ label, value, field }) => (
    <div className="space-y-3">
      <label className="block text-[10px] font-black text-cafe-medio uppercase tracking-[0.2em] ml-2">{label}</label>
      <div className="flex flex-col sm:flex-row gap-8 items-center p-8 bg-marfil rounded-[3rem] border-2 border-arena/10 shadow-inner group">
        <div className="w-full sm:w-64 aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/50 relative">
          {value ? (
            <img src={value} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-arena font-black uppercase tracking-widest gap-2 bg-marfil">
              <span className="text-4xl opacity-20">📷</span>
              Sin imagen
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4 text-center sm:text-left">
           <label className="inline-flex items-center gap-3 px-8 py-4 bg-cafe-oscuro text-crema text-[11px] font-black rounded-2xl cursor-pointer hover:bg-terracota transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth={2.5}/></svg>
             Subir Fotografía
             <input type="file" className="hidden" accept="image/*" onChange={(e) => onUpload(e.target.files[0], (url) => updateField(field, url))} />
           </label>
           <div className="bg-white/50 p-3 rounded-xl border border-arena/20">
             <p className="text-[9px] text-cafe-claro break-all font-mono italic">{value || 'No hay archivo seleccionado'}</p>
           </div>
        </div>
      </div>
    </div>
  )

  if (isGlobal) {
    return (
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Input label="Nombre de la Web" value={content.site_name} field="site_name" />
          <Input label="Correo de Contacto" value={content.contact_email} field="contact_email" />
        </div>
        <div className="bg-marfil p-10 rounded-[3.5rem] border-2 border-arena/10 space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-terracota/5 rounded-full -translate-y-16 translate-x-16" />
           <h4 className="font-display text-2xl text-cafe-oscuro flex items-center gap-4 relative z-10">
             <span className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">🔗</span>
             Perfiles Sociales
           </h4>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
             <Input label="Instagram" value={content.social_links?.instagram} field="instagram" nested="social_links" />
             <Input label="YouTube Channel" value={content.social_links?.youtube} field="youtube" nested="social_links" />
             <Input label="Spotify Show" value={content.social_links?.spotify} field="spotify" nested="social_links" />
             <Input label="TikTok" value={content.social_links?.tiktok} field="tiktok" nested="social_links" />
           </div>
        </div>
      </div>
    )
  }

  // Common fields
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-10">
        {Object.keys(content).map(key => {
          if (key === 'bg_image' || key === 'photo' || key === 'main_image') {
            return <ImageField key={key} label={key === 'bg_image' ? 'Banner Principal' : key === 'photo' ? 'Foto de Perfil' : 'Imagen Destacada'} value={content[key]} field={key} />
          }
          if (key === 'gallery' || key === 'projects' || key === 'stats') return null
          
          const isMultiline = key === 'bio' || key === 'description' || key === 'text' || key === 'intro'
          return <Input key={key} label={key} value={content[key]} field={key} multiline={isMultiline} />
        })}
      </div>

      {content.gallery && (
        <div className="pt-12 border-t-2 border-arena/20">
          <h4 className="font-display text-2xl text-cafe-oscuro mb-8 flex items-center gap-3">
             <span className="w-10 h-10 bg-terracota/10 rounded-xl flex items-center justify-center text-lg">🖼️</span>
             Galería de Imágenes
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {(content.gallery || []).map((img, i) => {
              const url = typeof img === 'string' ? img : img.url
              return (
                <div key={i} className="aspect-square bg-marfil rounded-3xl overflow-hidden relative group border-4 border-white shadow-xl transform transition-transform hover:scale-105 active:scale-95">
                  <img src={url} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => {
                      const newGallery = content.gallery.filter((_, idx)=>idx!==i)
                      updateField('gallery', newGallery)
                    }}
                    className="absolute inset-0 bg-red-600/90 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity font-black text-[10px] gap-2"
                  >
                    <span className="text-xl">🗑️</span>
                    ELIMINAR
                  </button>
                </div>
              )
            })}
            <label className="aspect-square border-4 border-dashed border-arena/30 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-terracota/5 hover:border-terracota/40 transition-all gap-3 bg-marfil/30 group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl text-arena group-hover:bg-terracota group-hover:text-white transition-all shadow-sm">+</div>
              <span className="text-[10px] font-black text-cafe-claro uppercase tracking-widest">Añadir Foto</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => onUpload(e.target.files[0], (url) => {
                // Ensure format matches consumption (FestivalSection uses url property or string)
                const isObjectList = content.gallery.length > 0 && typeof content.gallery[0] === 'object'
                const newItem = isObjectList ? { url: url } : url
                updateField('gallery', [...content.gallery, newItem])
              })} />
            </label>
          </div>
        </div>
      )}

      {content.projects && (
        <div className="pt-12 border-t-2 border-arena/20 space-y-10">
          <h4 className="font-display text-2xl text-cafe-oscuro flex items-center gap-3">
             <span className="w-10 h-10 bg-terracota/10 rounded-xl flex items-center justify-center text-lg">🏛️</span>
             Hitos de Trayectoria
          </h4>
          <div className="grid grid-cols-1 gap-8">
            {content.projects.map((p, i) => (
              <div key={i} className="p-10 bg-marfil rounded-[3rem] border-2 border-arena/10 flex flex-col lg:flex-row gap-10 relative items-center group hover:bg-white hover:shadow-2xl hover:border-terracota/10 transition-all">
                 <div className="w-full lg:w-72 aspect-video lg:aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-xl flex-shrink-0 ring-8 ring-marfil group-hover:ring-crema transition-all">
                    {p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl opacity-10">📷</div>}
                 </div>
                 <div className="flex-1 space-y-6 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <Input label="Título del Hito" value={p.title} field="title" onChange={(f, v) => {
                          const np = [...content.projects]; np[i] = { ...p, title: v }; updateField('projects', np)
                       }} />
                       <Input label="Fecha / Lugar" value={p.year || p.tag} field="year" onChange={(f, v) => {
                          const np = [...content.projects]; np[i] = { ...p, year: v, tag: v }; updateField('projects', np)
                       }} />
                    </div>
                    <Input label="Descripción Corta" value={p.description} field="description" multiline onChange={(f, v) => {
                       const np = [...content.projects]; np[i] = { ...p, description: v }; updateField('projects', np)
                    }} />
                    
                    <div className="flex justify-between items-center pt-4">
                      <label className="px-6 py-3 bg-cafe-oscuro text-crema text-[10px] font-black rounded-xl cursor-pointer hover:bg-terracota shadow-lg transition-all active:scale-95 uppercase tracking-widest">
                        Cambiar Fotografía
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => onUpload(e.target.files[0], (url) => {
                          const np = [...content.projects]; np[i] = { ...p, photo: url }; updateField('projects', np)
                        })} />
                      </label>
                      <button 
                        onClick={() => updateField('projects', content.projects.filter((_, idx)=>idx!==i))}
                        className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-lg"
                      >
                        Eliminar este Hito
                      </button>
                    </div>
                 </div>
              </div>
            ))}
            <button 
              onClick={() => updateField('projects', [...content.projects, { title: 'Nuevo Espectáculo', description: '', photo: '', year: '2024' }])}
              className="w-full py-12 border-4 border-dashed border-arena/20 rounded-[4rem] text-cafe-medio font-display text-2xl hover:bg-terracota/5 hover:border-terracota/20 hover:text-terracota transition-all flex flex-col items-center gap-4"
            >
              <span className="text-4xl">➕</span>
              Añadir Nuevo Hito a la Trayectoria
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
