import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook to fetch and manage website configuration from Supabase.
 * Returns sections (ordered), settings, and loading state.
 */
export function useSiteData() {
  const [sections, setSections] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [sectionsRes, settingsRes] = await Promise.all([
        supabase
          .from('site_sections')
          .select('*')
          .eq('is_visible', true)
          .order('section_order', { ascending: true }),
        supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'global')
          .single()
      ])

      if (sectionsRes.error) throw sectionsRes.error
      if (settingsRes.error) throw settingsRes.error

      setSections(sectionsRes.data || [])
      setSettings(settingsRes.data || {})

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

  return { sections, settings, loading, error, refresh: fetchData }
}
