import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscnptcWJkcGprcHhiZmRnbmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDIxMjYsImV4cCI6MjA5MDQxODEyNn0.QcXUG3AgkSHN33E6WPfwyYdDzE9uPTHYKlcMAO1ZmV8'

const jsonData = JSON.parse(readFileSync('./public/resumeData.json', 'utf-8'))
const mainSection = jsonData.main

// Update the image to the correct one
mainSection.image = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co/storage/v1/object/public/blog-images/image-1775483680689.png'

console.log('Main data to restore:')
console.log('- name:', mainSection.name)
console.log('- image:', mainSection.image)

// Get the id of the main row
const selectResponse = await fetch(
  `${SUPABASE_URL}/rest/v1/resume?select=id&section=eq.main`,
  {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  }
)
const selectResult = await selectResponse.json()
console.log('SELECT result:', selectResult)

if (selectResult && selectResult.length > 0) {
  const id = selectResult[0].id
  console.log('Found main id:', id)

  // Update the main row
  const updateResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/resume?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ data: mainSection })
    }
  )

  console.log('Update response status:', updateResponse.status)
  if (updateResponse.ok) {
    const result = await updateResponse.json()
    console.log('Restore successful!')
    console.log('Updated rows:', result.length)
  } else {
    const text = await updateResponse.text()
    console.error('Update failed:', text)
  }
} else {
  console.error('No main row found!')
}