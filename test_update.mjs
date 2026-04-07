import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co'
const serviceKey = 'sb_secret_QO7_ivKEVxKj4ABjtxbYgQ_x2s-pEqA'

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
})

async function testUpdate() {
  // First get current data
  const { data: before } = await supabase
    .from('resume')
    .select('id, data')
    .eq('section', 'resume')
    .single()
  
  console.log('Before - work count:', before.data.work.length)
  
  // Add a test item
  const updatedData = {
    ...before.data,
    work: [...before.data.work, { company: 'TEST_COMPANY', title: 'Test', years: '2024', image: '', description: ['test'] }]
  }
  
  console.log('Updating with work count:', updatedData.work.length)
  
  // Try update
  const { data: updateResult, error: updateError } = await supabase
    .from('resume')
    .update({ data: updatedData })
    .eq('id', before.id)
    .select()
  
  console.log('Update error:', updateError)
  console.log('Update result:', JSON.stringify(updateResult))
  
  // Check if it actually updated
  const { data: after } = await supabase
    .from('resume')
    .select('id, data')
    .eq('section', 'resume')
    .single()
  
  console.log('After - work count:', after.data.work.length)
  console.log('TEST_COMPANY added?', after.data.work.some(w => w.company === 'TEST_COMPANY'))
}

testUpdate()
