// fundlink/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cwlgqhlprkpumovkbznl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bGdxaGxwcmtwdW1vdmtiem5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDA4MDgsImV4cCI6MjA2Nzc3NjgwOH0.iyQAal4V8v3EgsDFAvg0g9erOtTrPvStpli6bzDROVM'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
