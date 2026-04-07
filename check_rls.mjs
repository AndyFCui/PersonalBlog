import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co'
const serviceKey = 'sb_secret_QO7_ivKEVxKj4ABjtxbYgQ_x2s-pEqA'

const supabase = createClient(supabaseUrl, serviceKey)

async function checkRLS() {
  // Check policies on resume table
  const { data, error } = await supabase.rpc('pg_catalog.pg_policies', { 
    schemaname: 'public', 
    tablename: 'resume' 
  }).catch(() => null)
  
  if (error) {
    console.log('Cannot query pg_policies directly')
  }
  
  // Try a different approach - check storage policies
  const { data: storagePolicies } = await supabase.rpc('pg_catalog.pg_policies', {
    schemaname: 'storage', 
    tablename: 'objects' 
  }).catch(() => null)
  
  console.log('Storage policies:', storagePolicies)
  
  // Check what policies exist for resume
  const { data: resumePolicies } = await supabase.from('resume').select('id').limit(1)
  console.log('Resume table accessible:', !!resumePolicies)
}

checkRLS()
