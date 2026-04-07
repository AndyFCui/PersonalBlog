import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscnptcWJkcGprcHhiZmRnbmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDIxMjYsImV4cCI6MjA5MDQxODEyNn0.QcXUG3AgkSHN33E6WPfwyYdDzE9uPTHYKlcMAO1ZmV8'

async function testCRUD() {
  console.log('=== Testing Resume CRUD Operations ===\n')

  // Step 1: Fetch current resume data
  console.log('1. Fetching current resume data...')
  const selectResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/resume?select=id,data&section=eq.resume`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  )
  const selectResult = await selectResponse.json()

  if (!selectResult || selectResult.length === 0) {
    console.log('   ERROR: No resume data found!')
    return
  }

  const resumeId = selectResult[0].id
  let resumeData = selectResult[0].data
  console.log(`   ✓ Found resume data`)
  console.log(`   Work count: ${resumeData.work.length}`)
  console.log(`   Education count: ${resumeData.education.length}`)
  console.log(`   First work: ${resumeData.work[0]?.company}`)

  // Step 2: Simulate deleting "Dell Inc" (last work entry)
  console.log('\n2. Simulating delete of last work entry (Dell Inc)...')
  const originalWorkCount = resumeData.work.length
  resumeData.work = resumeData.work.filter(w => w.company !== 'Dell Inc')
  console.log(`   Removed Dell Inc, new work count: ${resumeData.work.length}`)

  // Step 3: Save back to database
  console.log('\n3. Saving to database...')
  const updateResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/resume?id=eq.${resumeId}`,
    {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ data: resumeData })
    }
  )

  if (!updateResponse.ok) {
    console.log(`   ERROR: Update failed with status ${updateResponse.status}`)
    const text = await updateResponse.text()
    console.log(`   Response: ${text}`)
    return
  }
  console.log('   ✓ Save successful')

  // Step 4: Verify deletion
  console.log('\n4. Verifying deletion...')
  const verifyResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/resume?select=data&section=eq.resume`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  )
  const verifyResult = await verifyResponse.json()
  const verifyData = verifyResult[0].data
  console.log(`   Work count after delete: ${verifyData.work.length}`)
  console.log(`   Last work now: ${verifyData.work[verifyData.work.length - 1]?.company}`)

  if (verifyData.work.length === originalWorkCount - 1 &&
      !verifyData.work.find(w => w.company === 'Dell Inc')) {
    console.log('\n✅ DELETE TEST: PASSED')
  } else {
    console.log('\n❌ DELETE TEST: FAILED')
  }

  // Step 5: Restore Dell Inc for future testing
  console.log('\n5. Restoring original data from file...')
  const jsonData = JSON.parse(readFileSync('./public/resumeData.json', 'utf-8'))
  const originalResume = jsonData.resume

  const restoreResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/resume?id=eq.${resumeId}`,
    {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ data: originalResume })
    }
  )

  if (restoreResponse.ok) {
    console.log('   ✓ Original data restored')
    console.log(`   Work count restored to: ${originalResume.work.length}`)
  } else {
    console.log('   ⚠️ Restore failed - please run restore_resume.mjs manually')
  }

  console.log('\n=== Test Complete ===')
}

testCRUD().catch(console.error)