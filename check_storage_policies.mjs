import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co'
const supabaseKey = 'sb_secret_QO7_ivKEVxKj4ABjtxbYgQ_x2s-pEqA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  // Check storage bucket policies
  const { data: policies, error } = await supabase.rpc('pg_catalog.pg_policies', { table_name: 'blog-images' }).catch(() => null)
  
  if (error) {
    console.log('Cannot fetch storage policies via RPC, trying direct query...')
  }
  
  // Try to list buckets to verify access
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
  console.log('Buckets:', buckets)
  console.log('Bucket error:', bucketError)
  
  // Try to delete a test file to see the actual error
  const testFile = 'test-delete-check.txt'
  
  // First upload a test file
  await supabase.storage.from('blog-images').upload(testFile, new Blob(['test'], { type: 'text/plain' }), { upsert: true })
  
  // Then try to delete it
  const { data: deleteData, error: deleteError } = await supabase.storage.from('blog-images').remove([testFile])
  console.log('Delete test result:', { data: deleteData, error: deleteError })
}

check()
