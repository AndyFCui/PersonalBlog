/**
 * Resume Data Flow Test
 *
 * 测试 admin 页面修改后，前端是否能正确读取并显示数据
 *
 * 运行方式: node tests/resume-data-flow.test.js
 */

import { createClient } from '@supabase/supabase-js'
import https from 'https'

// Supabase 配置
const SUPABASE_URL = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co'
// Use service role key for testing (has full read/write access)
const SERVICE_KEY = 'sb_secret_QO7_ivKEVxKj4ABjtxbYgQ_x2s-pEqA'

// Storage base URL
const STORAGE_BASE = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co/storage/v1/object/public/blog-images/'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

function assert(condition, message) {
  return condition ? { pass: true } : { pass: false, message }
}

async function test(label, fn) {
  try {
    const result = await fn()
    if (result.pass) {
      console.log(`✅ ${label}`)
    } else {
      console.log(`❌ ${label}: ${result.message}`)
    }
  } catch (err) {
    console.log(`❌ ${label}: ${err.message}`)
  }
}

async function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ status: res.statusCode, data }))
    }).on('error', reject)
  })
}

// Helper to get section data (handles nested data structure)
async function getSectionData(section) {
  const { data, error } = await supabase.from('resume').select('data').eq('section', section).single()
  if (error) throw error
  return data.data // Unwrap the nested data
}

async function runTests() {
  console.log('🔍 Resume Data Flow Tests\n')
  console.log('='.repeat(50))

  // Test 1: Main section has required fields
  await test('Main section exists', async () => {
    const data = await getSectionData('main')
    return assert(data && data.name === 'Andy (Xiang-Yu) Cui', 'Main data loaded')
  })

  // Test 2: Main image is a valid Supabase URL
  await test('Main image is valid Supabase URL', async () => {
    const data = await getSectionData('main')
    const isValidUrl = data?.image?.startsWith(STORAGE_BASE)
    return assert(isValidUrl, `Image URL: ${data?.image}`)
  })

  // Test 3: Resume section has education
  await test('Education section has 3 entries', async () => {
    const data = await getSectionData('resume')
    return assert(data?.education?.length === 3, `Found ${data?.education?.length} education entries`)
  })

  // Test 4: Education has Coursework data
  await test('Education has Coursework data', async () => {
    const data = await getSectionData('resume')
    const firstEdu = data?.education?.[0]
    return assert(firstEdu?.Coursework?.length > 0, `Coursework: ${firstEdu?.Coursework?.substring(0, 50)}...`)
  })

  // Test 5: Education has Description (Relevant Coursework)
  await test('Education has Description (Relevant Coursework)', async () => {
    const data = await getSectionData('resume')
    const firstEdu = data?.education?.[0]
    return assert(firstEdu?.description?.length > 0, `Description: ${firstEdu?.description?.substring(0, 50)}...`)
  })

  // Test 6: Education has valid image URL
  await test('Education has valid image URL', async () => {
    const data = await getSectionData('resume')
    const firstEdu = data?.education?.[0]
    const isValidUrl = firstEdu?.image?.startsWith(STORAGE_BASE)
    return assert(isValidUrl, `Image: ${firstEdu?.image}`)
  })

  // Test 7: Work section has entries
  await test('Work section has 6 entries', async () => {
    const data = await getSectionData('resume')
    return assert(data?.work?.length === 6, `Found ${data?.work?.length} work entries`)
  })

  // Test 8: Work has valid image URL
  await test('Work has valid image URL', async () => {
    const data = await getSectionData('resume')
    const firstWork = data?.work?.[0]
    const isValidUrl = firstWork?.image?.startsWith(STORAGE_BASE)
    return assert(isValidUrl, `Image: ${firstWork?.image}`)
  })

  // Test 9: Portfolio section exists
  await test('Portfolio section has projects', async () => {
    const data = await getSectionData('portfolio')
    return assert(data?.projects?.length === 6, `Found ${data?.projects?.length} projects`)
  })

  // Test 10: Portfolio images are valid Supabase URLs
  await test('Portfolio images are valid Supabase URLs', async () => {
    const data = await getSectionData('portfolio')
    const allValid = data?.projects?.every(p => p.image?.startsWith(STORAGE_BASE))
    const invalidOnes = data?.projects?.filter(p => !p.image?.startsWith(STORAGE_BASE)).map(p => p.image)
    return assert(allValid, invalidOnes.length > 0 ? `Invalid: ${invalidOnes.join(', ')}` : 'All valid')
  })

  // Test 11: Verify HTTP status of portfolio images
  await test('Portfolio images are accessible via HTTP', async () => {
    const data = await getSectionData('portfolio')
    const firstProject = data?.projects?.[0]
    if (!firstProject?.image) return { pass: false, message: 'No image URL' }

    const res = await httpGet(firstProject.image)
    return assert(res.status === 200, `Status: ${res.status}`)
  })

  console.log('\n' + '='.repeat(50))
  console.log('✅ Tests completed')
}

runTests().catch(console.error)
