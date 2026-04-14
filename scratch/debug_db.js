import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function check() {
  const { data: sections } = await supabase.from('site_sections').select('id')
  const { data: settings } = await supabase.from('site_settings').select('*')
  console.log('SECTIONS:', sections?.map(s => s.id))
  console.log('SETTINGS:', settings)
}

check()
