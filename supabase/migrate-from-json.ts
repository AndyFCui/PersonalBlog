/**
 * Migration Script: Transfer resumeData.json to Supabase
 *
 * Usage:
 *   1. First run the schema.sql in Supabase Dashboard
 *   2. Set up your .env with Supabase keys
 *   3. Run: npx tsx supabase/migrate-from-json.ts
 *
 * This will read your local resumeData.json and upload to Supabase
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load .env manually since this is a Node script
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    })
  }
}

loadEnv()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please check your .env file.')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrate() {
  console.log('🚀 Starting migration...\n')

  // Read local resumeData.json
  const resumeDataPath = path.join(process.cwd(), 'public', 'resumeData.json')

  if (!fs.existsSync(resumeDataPath)) {
    console.error('❌ resumeData.json not found at:', resumeDataPath)
    process.exit(1)
  }

  const resumeData = JSON.parse(fs.readFileSync(resumeData, 'utf-8'))
  console.log('✓ Loaded resumeData.json')

  // Upload main section
  console.log('\n📤 Uploading main section...')
  const { error: mainError } = await supabase
    .from('resume')
    .upsert({ section: 'main', data: resumeData.main }, { onConflict: 'section' })

  if (mainError) {
    console.error('❌ Failed to upload main section:', mainError.message)
  } else {
    console.log('✓ Main section uploaded')
  }

  // Upload resume section
  console.log('\n📤 Uploading resume section...')
  const { error: resumeError } = await supabase
    .from('resume')
    .upsert({ section: 'resume', data: resumeData.resume }, { onConflict: 'section' })

  if (resumeError) {
    console.error('❌ Failed to upload resume section:', resumeError.message)
  } else {
    console.log('✓ Resume section uploaded')
  }

  // Upload portfolio section
  console.log('\n📤 Uploading portfolio section...')
  const { error: portfolioError } = await supabase
    .from('resume')
    .upsert({ section: 'portfolio', data: resumeData.portfolio }, { onConflict: 'section' })

  if (portfolioError) {
    console.error('❌ Failed to upload portfolio section:', portfolioError.message)
  } else {
    console.log('✓ Portfolio section uploaded')
  }

  console.log('\n✅ Migration complete!')
  console.log('\nYou can now:')
  console.log('1. Delete your local resumeData.json (optional)')
  console.log('2. Set VITE_USE_SUPABASE=true in .env to use Supabase data')
  console.log('3. Restart your dev server with npm run dev')
}

migrate().catch(console.error)
