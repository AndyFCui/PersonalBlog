import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co'
const supabaseKey = 'sb_secret_QO7_ivKEVxKj4ABjtxbYgQ_x2s-pEqA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function fix() {
  const newAvatarUrl = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co/storage/v1/object/public/blog-images/image-1775479626722.png'

  // Check if authors table exists and has data
  const { data: authors, error: fetchError } = await supabase
    .from('authors')
    .select('*')
    .limit(1)

  if (fetchError) {
    console.error('Fetch error (authors table may not exist):', fetchError)
    return
  }

  console.log('Current authors:', JSON.stringify(authors, null, 2))
}

fix()
