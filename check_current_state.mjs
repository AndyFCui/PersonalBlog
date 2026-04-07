import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co'
const anonKey = 'sb_publishable_W74gnUi_k_oIOnvmq6ueuA_sokhCOPj'

const supabase = createClient(supabaseUrl, anonKey)

async function check() {
  const { data, error } = await supabase
    .from('resume')
    .select('data')
    .eq('section', 'resume')
    .single()
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log('Education count:', data.data.education.length)
  console.log('Education schools:', data.data.education.map(e => e.school))
  console.log('Work count:', data.data.work.length)
  console.log('Work companies:', data.data.work.map(w => w.company))
}

check()
