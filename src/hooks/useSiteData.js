import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook to fetch and manage website configuration from Supabase.
 * Returns sections (ordered), settings, and loading state.
 */
export function useSiteData() {
  const [sections, setSections] = useState([])
  const [settings, setSettings] = useState({})
  const [publicBooks, setPublicBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      console.log('--- FETCH START ---')
      setLoading(true)
      
      console.log('Fetching sections...')
      const sectionsRes = await supabase
        .from('site_sections')
        .select('*')
        .eq('is_visible', true)
        .order('section_order', { ascending: true })
      console.log('Sections status:', sectionsRes.error ? 'ERROR' : 'OK', sectionsRes.data?.length)

      console.log('Fetching settings...')
      const settingsRes = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global')
        .maybeSingle()
      console.log('Settings status:', settingsRes.error ? 'ERROR' : 'OK', settingsRes.data)

      console.log('Fetching books...')
      const booksRes = await supabase
        .from('libros')
        .select('*')
        .eq('es_publico', true)
        .eq('activo', true)
        .order('created_at', { ascending: false })
      console.log('Books status:', booksRes.error ? 'ERROR' : 'OK', booksRes.data?.length)

      if (sectionsRes.error) throw sectionsRes.error
      
      const mappedSections = (sectionsRes.data || []).map(s => ({
        ...s,
        id: s.id // The column name in DB is actually 'id'
      }))

      setSections(mappedSections)
      setSettings(settingsRes.data || { site_name: 'Maribel García', social_links: {} })
      setPublicBooks(booksRes.data || [])
      console.log('--- FETCH SUCCESS ---')
    } catch (err) {
      console.error('--- FETCH ERROR ---', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { sections, settings, publicBooks, loading, error, refresh: fetchData }
}
