import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co'
const supabaseKey = 'sb_publishable_uQ5ub4ARV9U93Hvf7KZbqg_-frLGE0E'

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const publicDir = join(__dirname, '../public')

// Files to upload (relative paths from public folder)
const filesToUpload = [
  'images/profilepic.jpg',
  'images/education.jpg',
  'images/education2.png',
  'images/education3.png',
  'images/kingsclub.png',
  'images/cacauto.png',
  'images/alpalife_logo.jpg',
  'images/dutchgo.png',
  'images/catchup.png',
  'images/dell_logo.jpg',
  'images/logos/aws.png',
  'images/logos/docker.png',
  'images/logos/supabase.png',
  'images/logos/cursor.png',
  'images/logos/deepseek.png',
  'images/logos/gpt2.png',
  'images/logos/python.png',
  'images/logos/nodejs.png',
  'images/logos/java.png',
  'images/logos/ubuntu.png',
  'images/logos/gentoo.png',
  'images/logos/mysql.png',
  'images/portfolio/EmploymentWebsiteDesign/job_web.png',
  'images/portfolio/aiAgent_CrashLoyal/aiAgent.png',
  'images/portfolio/amazonQArobot/qaRobot.png',
  'images/portfolio/doctorLucky/doctorLucky.png',
  'images/portfolio/goBang_agent/goBang.png',
  'images/portfolio/onlineDatabase/onlineDatabase.png',
]

const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

async function uploadFile(filePath) {
  const fullPath = join(publicDir, filePath)

  try {
    const stat = statSync(fullPath)
    if (!stat.isFile()) {
      console.log(`⏭️  Skipping directory: ${filePath}`)
      return
    }

    const buffer = readFileSync(fullPath)
    const ext = filePath.toLowerCase().match(/\.[^.]+$/)?.[0] || '.bin'
    const mimeType = mimeTypes[ext] || 'application/octet-stream'
    const fileName = filePath.replace(/^images\//, '')

    console.log(`📤 Uploading: ${filePath}...`)

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true,
      })

    if (error) {
      console.error(`❌ Failed: ${filePath} - ${error.message}`)
      return
    }

    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName)

    console.log(`✅ Uploaded: ${filePath}`)
    console.log(`   URL: ${urlData.publicUrl}`)
    console.log('')
  } catch (err) {
    console.error(`❌ Error: ${filePath} - ${err.message}`)
  }
}

async function main() {
  console.log('🚀 Starting image upload to Supabase...\n')

  for (const file of filesToUpload) {
    await uploadFile(file)
  }

  console.log('✨ Done!')
}

main()
