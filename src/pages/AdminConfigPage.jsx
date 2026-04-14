import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AdminLayout from '../components/admin/AdminLayout'

export default function AdminConfigPage() {
  const [sections, setSections] = useState([])
  const [settings, setSettings] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null) // Can be a section object or { id: 'settings', ... }
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch Sections
    const { data: secData, error: secErr } = await supabase
      .from('site_sections')
      .select('*')
      .order('section_order', { ascending: true })

    // Fetch Settings
    // The table uses 'key' and 'value'. We look for the 'global' configuration.
    const { data: settData, error: settErr } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'global')
      .single()

    if (secErr) console.error("Error fetching sections:", secErr)
    
    // We treat settings error (like no rows) gracefully to not block the page
    // Pattern B: The row itself contains the fields (site_name, social_links, etc)
    const settingsObj = settData ? { id: 'settings', section_name: 'Ajustes Generales', content: settData } : { id: 'settings', section_name: 'Ajustes Generales', content: {} }

    setSections(secData || [])
    setSettings(settingsObj.content)
    
    if (!selectedItem) {
      setSelectedItem(settingsObj)
    } else {
      // Refresh selected item
      if (selectedItem.id === 'settings') {
        setSelectedItem(settingsObj)
      } else {
        const updated = (secData || []).find(s => s.id === selectedItem.id)
        if (updated) setSelectedItem(updated)
      }
    }
    setLoading(false)
  }

  const handleMove = async (id, direction) => {
    const index = sections.findIndex(s => s.id === id)
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === sections.length - 1) return

    const newSections = [...sections]
    const swapWith = direction === 'up' ? index - 1 : index + 1
    
    const tempOrder = newSections[index].section_order
    newSections[index].section_order = newSections[swapWith].section_order
    newSections[swapWith].section_order = tempOrder

    setSaving(true)
    const { error } = await supabase.from('site_sections').upsert([
      { id: newSections[index].id, section_order: newSections[index].section_order },
      { id: newSections[swapWith].id, section_order: newSections[swapWith].section_order }
    ])

    if (error) alert(error.message)
    else fetchData()
    setSaving(false)
  }

  const handleToggleVisibility = async (section) => {
    await supabase.from('site_sections').update({ is_visible: !section.is_visible }).eq('id', section.id)
    fetchData()
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    let error
    if (selectedItem.id === 'settings') {
      const { id: _id, updated_at: _ua, ...updateData } = selectedItem.content
      const { error: err } = await supabase
        .from('site_settings')
        .upsert({ id: 'global', ...updateData })
      error = err
    } else {
      const { error: err } = await supabase
        .from('site_sections')
        .update({ content: selectedItem.content })
        .eq('id', selectedItem.id)
      error = err
    }

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Cambios guardados correctamente' })
      setTimeout(() => setMessage(null), 3000)
      fetchData()
    }
    setSaving(false)
  }

  const handleUpload = async (file, onDone) => {
    if (!file) return
    setSaving(true)
    try {
      const path = `assets/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`
      const { error: upErr } = await supabase.storage.from('site-assets').upload(path, file)
      if (upErr) throw upErr
      const { data } = supabase.storage.from('site-assets').getPublicUrl(path)
      onDone(data.publicUrl)
    } catch (err) {
      alert('Error subiendo imagen: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-10 lg:flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl text-cafe-oscuro">Super Pro CMS</h2>
            <p className="text-cafe-medio mt-1">Control total sobre textos, fotos y orden de tu plataforma.</p>
          </div>
          <a href="/" target="_blank" className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-arena/50 text-cafe-medio rounded-xl hover:text-terracota transition-all mt-4 lg:mt-0 shadow-sm">
             <svg className="w-4 h-4 text-terracota" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
             Ver Sitio Live
          </a>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-terracota border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Settings Section */}
              <div className="bg-white border border-arena/50 rounded-2xl shadow-sm overflow-hidden">
                <div 
                  className={`flex items-center gap-3 p-4 transition-colors cursor-pointer ${selectedItem?.id === 'settings' ? 'bg-terracota/5 border-l-4 border-terracota' : 'hover:bg-marfil'}`}
                  onClick={() => setSelectedItem({ id: 'settings', section_name: 'Ajustes Generales', content: settings })}
                >
                  <div className="w-8 h-8 rounded-lg bg-dorado/10 flex items-center justify-center text-dorado">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-cafe-oscuro">Ajustes Generales</p>
                    <p className="text-[10px] text-cafe-claro uppercase">Redes & Global</p>
                  </div>
                </div>
              </div>

              {/* Sections List */}
              <div className="bg-white border border-arena/50 rounded-2xl shadow-sm overflow-hidden text-sm">
                <div className="p-4 bg-arena/10 border-b border-arena/20">
                   <span className="text-xs font-bold text-cafe-medio uppercase tracking-widest">Estructura de la Web</span>
                </div>
                <div className="divide-y divide-arena/30">
                  {sections.map((section, index) => (
                    <div 
                      key={section.id}
                      className={`flex items-center gap-3 p-4 transition-colors cursor-pointer ${selectedItem?.id === section.id ? 'bg-terracota/5 border-l-4 border-terracota' : 'hover:bg-marfil'}`}
                      onClick={() => setSelectedItem(section)}
                    >
                      <div className="flex flex-col gap-1 mr-2 scale-75">
                        <button onClick={(e) => { e.stopPropagation(); handleMove(section.id, 'up') }} disabled={index === 0 || saving} className="text-cafe-claro hover:text-terracota disabled:opacity-20"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" strokeWidth={3}/></svg></button>
                        <button onClick={(e) => { e.stopPropagation(); handleMove(section.id, 'down') }} disabled={index === sections.length - 1 || saving} className="text-cafe-claro hover:text-terracota disabled:opacity-20"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={3}/></svg></button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${section.is_visible ? 'text-cafe-oscuro' : 'text-cafe-claro italic'}`}>{section.section_name}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleToggleVisibility(section) }} className={`p-1 rounded-lg ${section.is_visible ? 'text-green-600 hover:bg-green-50' : 'text-arena/50 hover:bg-arena/10'}`}>
                        {section.is_visible ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.27 4.27m5.61 5.61l-5.61-5.61m10.12 10.12l5.61 5.61m-5.61-5.61l5.61 5.61M3 21l18-18" /></svg>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor Area */}
            <div className="lg:col-span-8">
              {selectedItem && (
                <div className="bg-white border border-arena/50 rounded-2xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                  <div className="p-6 bg-marfil border-b border-arena/50 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl text-cafe-oscuro">Editando: {selectedItem.section_name}</h3>
                      <p className="text-cafe-medio text-[10px] uppercase font-bold tracking-widest">{selectedItem.id === 'settings' ? 'Panel de Ajustes' : `Sección: ${selectedItem.id}`}</p>
                    </div>
                    {message && <div className={`px-4 py-2 rounded-lg text-sm font-semibold animate-fade-in ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>}
                  </div>

                  <form onSubmit={handleSave} className="p-8 space-y-6 flex-1">
                    <ItemFields 
                      item={selectedItem} 
                      onUpload={handleUpload}
                      onChange={(newContent) => setSelectedItem({ ...selectedItem, content: newContent })} 
                    />

                    <div className="flex justify-end pt-8 mt-10 border-t border-arena/30">
                      <button type="submit" disabled={saving} className="px-12 py-4 bg-terracota hover:bg-ambar text-white font-bold rounded-2xl transition-all shadow-xl shadow-terracota/20 transform active:scale-95 disabled:opacity-50">
                        {saving ? 'Guardando...' : '¡Guardar y Publicar!'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

function ItemFields({ item, onChange, onUpload }) {
  const { id, content } = item
  if (!content) return null

  const updateField = (key, value) => onChange({ ...content, [key]: value })
  const updateNested = (parent, key, value) => onChange({ ...content, [parent]: { ...content[parent], [key]: value } })

  const Input = ({ label, value, field, multiline = false, nested }) => (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-cafe-oscuro">{label}</label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => nested ? updateNested(nested, field, e.target.value) : updateField(field, e.target.value)}
          rows={id === 'about' ? 12 : 4}
          className="w-full px-4 py-3 bg-marfil border border-arena/50 rounded-xl focus:ring-2 focus:ring-terracota/20 outline-none transition-all resize-none text-cafe-medio"
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => nested ? updateNested(nested, field, e.target.value) : updateField(field, e.target.value)}
          className="w-full px-4 py-3 bg-marfil border border-arena/50 rounded-xl focus:ring-2 focus:ring-terracota/20 outline-none transition-all text-cafe-medio"
        />
      )}
    </div>
  )

  const ImageField = ({ label, value, field }) => (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-cafe-oscuro">{label}</label>
      <div className="flex gap-4 items-center p-4 bg-marfil rounded-xl border border-arena/50">
        <div className="w-40 h-24 bg-arena/20 rounded-lg overflow-hidden flex-shrink-0 border border-arena/30">
          {value ? <img src={value} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-arena/50 italic">Sin imagen</div>}
        </div>
        <div className="flex-1 space-y-3">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-arena/50 text-cafe-medio text-xs font-bold rounded-lg cursor-pointer hover:bg-arena/10">
            <svg className="w-4 h-4 text-terracota" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth={2}/></svg>
            Subir Foto
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files[0], (url) => updateField(field, url))} />
          </label>
          <input type="text" value={value || ''} onChange={(e) => updateField(field, e.target.value)} placeholder="O link directo" className="w-full px-4 py-2 bg-transparent border-b border-arena/30 text-[10px] text-cafe-claro focus:border-terracota outline-none" />
        </div>
      </div>
    </div>
  )

  if (id === 'settings') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <Input label="Nombre del Sitio" value={content.site_name} field="site_name" />
          <Input label="Email de Contacto" value={content.contact_email} field="contact_email" />
        </div>
        <div className="bg-arena/5 p-6 rounded-2xl border border-arena/20 space-y-4">
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
        <Input label="Eslogan Superior" value={content.tagline} field="tagline" />
        <Input label="Descripción" value={content.description} field="description" multiline />
        <ImageField label="Imagen de Fondo" value={content.bg_image} field="bg_image" />
      </div>
    )
  }

  if (id === 'about') {
    return (
      <div className="space-y-6">
        <Input label="Título" value={content.title} field="title" />
        <Input label="Biografía" value={content.bio} field="bio" multiline />
        <ImageField label="Foto de Perfil" value={content.photo} field="photo" />
      </div>
    )
  }

  if (id === 'festival') {
    const gallery = content.gallery || []
    const updateGalleryItem = (i, up) => {
      const ng = [...gallery]; ng[i] = { ...ng[i], ...up }; updateField('gallery', ng)
    }
    return (
      <div className="space-y-8">
        <Input label="Título de la Sección" value={content.title} field="title" />
        <Input label="Subtítulo" value={content.subtitle} field="subtitle" />
        <Input label="Descripción / Intro" value={content.description} field="description" multiline />
        <ImageField label="Imagen Principal (Banner)" value={content.main_image} field="main_image" />
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-display text-lg">Galería / Historias ({gallery.length})</h4>
            <button type="button" onClick={() => updateField('gallery', [...gallery, {title:'Nueva Historia', description:'', photo:'', visible: true}])} className="text-xs font-bold text-terracota underline">+ Agregar Foto a Galería</button>
          </div>
          <div className="grid gap-4">
            {gallery.map((g, i) => (
              <div key={i} className={`p-4 bg-marfil rounded-xl border transition-all ${g.visible === false ? 'opacity-50 border-arena border-dashed' : 'border-arena/30 shadow-sm'}`}>
                <div className="flex gap-4 items-start">
                   <div className="w-24 h-24 bg-arena/20 rounded-lg overflow-hidden flex-shrink-0 border border-arena/20">
                     <img src={g.photo || '/fotos/hero.jpg'} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input placeholder="Título de la foto" value={g.title} onChange={e=>updateGalleryItem(i, {title: e.target.value})} className="flex-1 bg-white border border-arena/20 rounded p-2 text-sm font-bold" />
                        <button 
                          type="button" 
                          onClick={() => updateGalleryItem(i, {visible: g.visible !== false ? false : true})}
                          className={`p-2 rounded-lg transition-colors ${g.visible !== false ? 'text-green-600 bg-green-50' : 'text-arena bg-arena/10'}`}
                          title={g.visible !== false ? 'Visible en la web' : 'Oculto en la web'}
                        >
                          {g.visible !== false ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.27 4.27m5.61 5.61l-5.61-5.61m10.12 10.12l5.61 5.61m-5.61-5.61l5.61 5.61M3 21l18-18" /></svg>}
                        </button>
                      </div>
                      <label className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-arena/50 text-cafe-medio text-[10px] font-bold rounded cursor-pointer hover:bg-arena/10">
                        Cambiar Foto
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files[0], (url) => updateGalleryItem(i, {photo: url}))} />
                      </label>
                   </div>
                   <button type="button" onClick={() => updateField('gallery', gallery.filter((_, idx)=>idx!==i))} className="text-red-400 hover:text-red-600">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
                   </button>
                </div>
                <textarea 
                  placeholder="La historia detrás de esta foto..." 
                  value={g.description} 
                  onChange={e=>updateGalleryItem(i, {description: e.target.value})} 
                  rows={3}
                  className="w-full bg-white border border-arena/20 rounded p-2 text-xs text-cafe-medio resize-none"
                />
              </div>
            ))}
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
        <Input label="Título de la Sección" value={content.title} field="title" />
        <Input label="Introducción" value={content.description} field="description" multiline />
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-display text-lg">Proyectos / Espectáculos ({projects.length})</h4>
            <button type="button" onClick={() => updateField('projects', [...projects, {title:'Nuevo Proyecto', description:'', tag:'Narración', photo:'', visible: true}])} className="text-xs font-bold text-terracota underline">+ Agregar Card</button>
          </div>
          <div className="grid gap-4">
            {projects.map((p, i) => (
              <div key={i} className={`p-4 bg-marfil rounded-xl border transition-all ${p.visible === false ? 'opacity-50 border-arena border-dashed' : 'border-arena/30 shadow-sm'}`}>
                <div className="flex gap-4 items-start">
                   <div className="w-24 h-24 bg-arena/20 rounded-lg overflow-hidden flex-shrink-0 border border-arena/20">
                     <img src={p.photo || '/fotos/hero.jpg'} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input placeholder="Título" value={p.title} onChange={e=>updateProject(i, {title: e.target.value})} className="w-full bg-white border border-arena/20 rounded p-2 text-sm font-bold" />
                          <input placeholder="Etiqueta (Ej: Gira)" value={p.tag} onChange={e=>updateProject(i, {tag: e.target.value})} className="w-full bg-white border border-arena/20 rounded p-2 text-[10px]" />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => updateProject(i, {visible: p.visible !== false ? false : true})}
                          className={`p-2 rounded-lg transition-colors ${p.visible !== false ? 'text-green-600 bg-green-50' : 'text-arena bg-arena/10'}`}
                        >
                          {p.visible !== false ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.27 4.27m5.61 5.61l-5.61-5.61m10.12 10.12l5.61 5.61m-5.61-5.61l5.61 5.61M3 21l18-18" /></svg>}
                        </button>
                      </div>
                      <label className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-arena/50 text-cafe-medio text-[10px] font-bold rounded cursor-pointer hover:bg-arena/10">
                        Cambiar Imagen
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files[0], (url) => updateProject(i, {photo: url}))} />
                      </label>
                   </div>
                   <button type="button" onClick={() => updateField('projects', projects.filter((_, idx)=>idx!==i))} className="text-red-400 hover:text-red-600">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
                   </button>
                </div>
                <textarea 
                  placeholder="Descripción o historia detallada..." 
                  value={p.description} 
                  onChange={e=>updateProject(i, {description: e.target.value})} 
                  rows={4}
                  className="w-full bg-white border border-arena/20 rounded p-2 text-xs text-cafe-medio resize-none italic font-serif"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (id === 'libros') {
    const books = content.books || []
    const updateBook = (i, up) => {
      const nb = [...books]; nb[i] = { ...nb[i], ...up }; updateField('books', nb)
    }

    const loadDefaultMilestones = () => {
      const defaults = [
        { title: 'Presentación en Feria', sub: 'Feria Internacional del Libro, Buenos Aires', description: 'Participación destacada en la Feria Internacional del Libro de Buenos Aires, compartiendo historias y conectando con lectores de todo el país.', img: '/fotos/feria.jpg', visible: true },
        { title: 'En los Medios', sub: 'Locutora y conductora de radio y podcast', description: 'Trayectoria en medios de comunicación, llevando la narración oral al formato radiofónico y digital a través de podcasts especializados.', img: '/fotos/radio.jpg', visible: true },
        { title: 'Reconocimientos', sub: 'Premios y reconocimientos a la trayectoria cultural', description: 'Distinciones otorgadas por diversas instituciones en reconocimiento a la labor de preservación y difusión de la cultura y la narración oral.', img: '', visible: true },
        { title: 'Misiones Internacionales', sub: 'Brasil — Trabajo con comunidades Quilombola', description: 'Intercambio cultural y talleres de narración con comunidades Quilombola en Brasil, rescatando la raíz africana de nuestras historias.', img: '', visible: true },
        { title: 'México', sub: 'Día de Muertos — Intercambio latinoamericano', description: 'Participación en las celebraciones del Día de Muertos en México, explorando las conexiones rituales y narrativas de Latinoamérica.', img: '', visible: true },
        { title: 'Turquía', sub: 'Pamukkale — Gira internacional de narración oral', description: 'Gira por Turquía, incluyendo presentaciones en el marco incomparable de Pamukkale, llevando historias argentinas a tierras lejanas.', img: '', visible: true }
      ]
      updateField('books', [...books, ...defaults])
    }

    return (
      <div className="space-y-8">
        <Input label="Título de la Sección" value={content.title} field="title" />
        <Input label="Introducción" value={content.intro} field="intro" multiline />
        
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h4 className="font-display text-lg text-cafe-oscuro">Publicaciones & Hitos ({books.length})</h4>
              <p className="text-[10px] text-cafe-medio uppercase font-bold tracking-tight">Estas son las tarjetas que aparecen en tu Biblioteca</p>
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={loadDefaultMilestones}
                className="text-xs font-bold text-dorado border border-dorado/30 px-3 py-1.5 rounded-lg hover:bg-dorado/5 transition-colors"
              >
                + Cargar Sugerencias
              </button>
              <button 
                type="button" 
                onClick={() => updateField('books', [...books, {title:'Nuevo Hito', sub:'', description: '', img:'', visible: true}])} 
                className="text-xs font-bold text-terracota border border-terracota/30 px-3 py-1.5 rounded-lg hover:bg-terracota/5 transition-colors"
              >
                + Agregar Manualmente
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            {books.map((b, i) => (
              <div key={i} className={`p-6 bg-marfil rounded-2xl border transition-all ${b.visible === false ? 'opacity-50 border-arena border-dashed shadow-none' : 'border-arena/30 shadow-md shadow-cafe-oscuro/5'}`}>
                <div className="flex flex-col md:flex-row gap-6">
                   {/* Foto */}
                   <div className="w-full md:w-32 space-y-3">
                     <div className="aspect-[3/4] bg-arena/20 rounded-xl overflow-hidden border border-arena/20 shadow-inner">
                       {b.img ? (
                         <img src={b.img} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-[10px] text-arena/60 italic text-center p-2">Sin imagen</div>
                       )}
                     </div>
                     <label className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-arena/50 text-cafe-medio text-[10px] font-bold rounded-lg cursor-pointer hover:bg-arena/10 transition-colors">
                        <svg className="w-3 h-3 text-terracota" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth={2.5}/></svg>
                        Cambiar
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files[0], (url) => updateBook(i, {img: url}))} />
                     </label>
                   </div>

                   {/* Campos */}
                   <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          <input 
                            placeholder="Título" 
                            value={b.title} 
                            onChange={e=>updateBook(i, {title: e.target.value})} 
                            className="w-full bg-white border border-arena/20 rounded-xl p-3 text-base font-bold text-cafe-oscuro focus:ring-2 focus:ring-terracota/10" 
                          />
                          <input 
                            placeholder="Detalle (Lugar/Fecha)" 
                            value={b.sub} 
                            onChange={e=>updateBook(i, {sub: e.target.value})} 
                            className="w-full bg-white border border-arena/20 rounded-xl p-2 text-xs text-cafe-medio" 
                          />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <button 
                            type="button" 
                            onClick={() => updateBook(i, {visible: b.visible !== false ? false : true})}
                            className={`p-3 rounded-xl transition-all shadow-sm ${b.visible !== false ? 'text-green-600 bg-green-50' : 'text-arena bg-arena/10'}`}
                            title={b.visible !== false ? 'Público' : 'Oculto'}
                          >
                            {b.visible !== false ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.27 4.27m5.61 5.61l-5.61-5.61m10.12 10.12l5.61 5.61m-5.61-5.61l5.61 5.61M3 21l18-18" /></svg>}
                          </button>
                          <button 
                            type="button" 
                            onClick={() => updateField('books', books.filter((_, idx)=>idx!==i))} 
                            className="p-2 text-arena hover:text-red-500 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
                          </button>
                        </div>
                      </div>
                      <textarea 
                        placeholder="Descripción amplia..." 
                        value={b.description} 
                        onChange={e=>updateBook(i, {description: e.target.value})} 
                        rows={4}
                        className="w-full bg-white border border-arena/20 rounded-xl p-3 text-sm text-cafe-medio resize-none italic font-serif"
                      />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }


  if (id === 'contact') {
    return (
      <div className="space-y-6">
        <Input label="Título de la Sección" value={content.title} field="title" />
        <Input label="Texto de Invitación" value={content.text} field="text" multiline />
        <Input label="Email receptor (Formulario)" value={content.email} field="email" />
      </div>
    )
  }

  return (
    <div className="p-10 text-center border-2 border-dashed border-arena/50 rounded-2xl">
      <p className="text-cafe-medio italic">Esta sección usa un formato complejo. Consultá la documentación.</p>
    </div>
  )
}
