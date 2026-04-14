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
      setLoading(true)
      
      const [sectionsRes, settingsRes, booksRes] = await Promise.all([
        supabase
          .from('site_sections')
          .select('*')
          .eq('is_visible', true)
          .order('section_order', { ascending: true }),
        supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'global')
          .single(),
        supabase
          .from('libros')
          .select('*, microcuentos(count)')
          .eq('es_publico', true)
          .eq('activo', true)
          .order('created_at', { ascending: false })
      ])

      if (sectionsRes.error) throw sectionsRes.error
      
      setSections(sectionsRes.data || [])
      setSettings(settingsRes.data || {})
      setPublicBooks(booksRes.data || [])

    } catch (err) {
      console.error('Error fetching site data:', err)
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
