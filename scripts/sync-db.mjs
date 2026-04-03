import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sbp_fa080333fbba91d18cba977483daf37a430d7397'

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// STORAGE_BASE for building full URLs
const STORAGE_BASE = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co/storage/v1/object/public/blog-images/'

async function updateSection(section, data) {
  // Check if record exists
  const { data: existing } = await supabase
    .from('resume')
    .select('id')
    .eq('section', section)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('resume')
      .update({ data })
      .eq('id', existing.id)
    if (error) throw error
    console.log(`✅ Updated ${section}`)
  } else {
    const { error } = await supabase
      .from('resume')
      .insert({ section, data })
    if (error) throw error
    console.log(`✅ Inserted ${section}`)
  }
}

async function main() {
  console.log('🔄 Reading local resumeData.json...\n')

  const filePath = join(__dirname, '../public/resumeData.json')
  const jsonData = JSON.parse(readFileSync(filePath, 'utf-8'))

  // Update each section
  console.log('📤 Syncing to Supabase database...\n')

  try {
    await updateSection('main', jsonData.main)
    await updateSection('resume', jsonData.resume)
    await updateSection('portfolio', jsonData.portfolio)

    console.log('\n✨ Done! Database synced with local JSON.')
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

main()
