import { chromium } from 'playwright'

const BASE_URL = 'http://localhost:5173'

async function runTest() {
  console.log('Starting Resume CRUD test...')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  // Listen for console errors
  const errors = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })

  page.on('pageerror', err => {
    errors.push(err.message)
  })

  try {
    // 1. Navigate to admin page
    console.log('1. Navigating to admin resume editor...')
    await page.goto(`${BASE_URL}/admin/resume`, { waitUntil: 'networkidle' })

    // Wait for the page to load
    await page.waitForSelector('text=Resume Editor', { timeout: 10000 })
    console.log('   ✓ Resume Editor page loaded')

    // 2. Click on Resume tab
    console.log('2. Clicking Resume tab...')
    await page.click('button:has-text("Resume")')
    await page.waitForTimeout(500)
    console.log('   ✓ Resume tab clicked')

    // 3. Get initial work count
    const initialWorkCount = await page.locator('[data-testid="work-item"]').count()
    console.log(`   Initial work count: ${initialWorkCount} (using selector count)`)

    // Count work items by looking for the company inputs
    const workCompanies = await page.locator('input[placeholder*="Company"]').count()
    console.log(`   Work items (company inputs): ${workCompanies}`)

    // 4. Click Add Work button
    console.log('3. Clicking Add Work button...')
    await page.click('button:has-text("Add"):has-text("Work")')
    await page.waitForTimeout(500)
    console.log('   ✓ Added new work item')

    // 5. Verify work count increased
    const newWorkCount = await page.locator('input[placeholder*="Company"]').count()
    console.log(`   New work count: ${newWorkCount}`)
    if (newWorkCount === workCompanies + 1) {
      console.log('   ✓ Add work: PASS')
    } else {
      console.log('   ✗ Add work: FAIL (count did not increase)')
    }

    // 6. Now delete the newly added work item
    console.log('4. Deleting the newly added work item...')
    const deleteButtons = page.locator('button:has-text("Trash2")')
    const countBeforeDelete = await deleteButtons.count()
    console.log(`   Delete buttons count: ${countBeforeDelete}`)

    // Click the last delete button (the one for the newly added item)
    await deleteButtons.last().click()
    await page.waitForTimeout(500)
    console.log('   ✓ Clicked delete button')

    // 7. Verify work count decreased
    const afterDeleteCount = await page.locator('input[placeholder*="Company"]').count()
    console.log(`   Work count after delete: ${afterDeleteCount}`)
    if (afterDeleteCount === newWorkCount - 1) {
      console.log('   ✓ Delete work: PASS')
    } else {
      console.log('   ✗ Delete work: FAIL (count did not decrease as expected)')
    }

    // 8. Test Education Add
    console.log('5. Testing Education Add...')
    const initialEduCount = await page.locator('input[placeholder*="School"]').count()
    await page.click('button:has-text("Add"):has-text("Education")')
    await page.waitForTimeout(500)
    const newEduCount = await page.locator('input[placeholder*="School"]').count()
    if (newEduCount === initialEduCount + 1) {
      console.log('   ✓ Add education: PASS')
    } else {
      console.log(`   ✗ Add education: FAIL (expected ${initialEduCount + 1}, got ${newEduCount})`)
    }

    // 9. Test Education Delete
    console.log('6. Testing Education Delete...')
    const eduDeleteButtons = page.locator('button:has-text("Trash2")')
    await eduDeleteButtons.last().click()
    await page.waitForTimeout(500)
    const afterEduDeleteCount = await page.locator('input[placeholder*="School"]').count()
    if (afterEduDeleteCount === newEduCount - 1) {
      console.log('   ✓ Delete education: PASS')
    } else {
      console.log(`   ✗ Delete education: FAIL (expected ${newEduCount - 1}, got ${afterEduDeleteCount})`)
    }

    // 10. Report errors
    if (errors.length > 0) {
      console.log('\n❌ Console Errors detected:')
      errors.forEach(e => console.log(`   - ${e}`))
    } else {
      console.log('\n✓ No console errors detected')
    }

    console.log('\n=== TEST COMPLETE ===')

  } catch (err) {
    console.error('Test failed with error:', err.message)
  } finally {
    await browser.close()
  }
}

runTest()