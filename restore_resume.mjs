import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscnptcWJkcGprcHhiZmRnbmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDIxMjYsImV4cCI6MjA5MDQxODEyNn0.QcXUG3AgkSHN33E6WPfwyYdDzE9uPTHYKlcMAO1ZmV8'

const jsonData = JSON.parse(readFileSync('./public/resumeData.json', 'utf-8'))
const resumeSection = jsonData.resume

console.log('Resume data to restore:')
console.log('- skillmessage:', resumeSection.skillmessage)
console.log('- education count:', resumeSection.education.length)
console.log('- work count:', resumeSection.work.length)
console.log('- skills count:', resumeSection.skills.length)

// First get the id of the resume row
const selectResponse = await fetch(
  `${SUPABASE_URL}/rest/v1/resume?select=id&section=eq.resume`,
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
  console.log('Found resume id:', id)

  // Update the resume row
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
      body: JSON.stringify({ data: resumeSection })
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
  console.error('No resume row found!')
}