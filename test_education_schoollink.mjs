import { chromium } from 'playwright'

const BASE_URL = 'http://localhost:5173'

async function testSchoolLink() {
  console.log('Testing School Link display in admin page...')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Navigate to admin page
    console.log('1. Navigating to admin resume editor...')
    await page.goto(`${BASE_URL}/admin/resume`, { waitUntil: 'networkidle', timeout: 15000 })

    // Wait for page load
    await page.waitForSelector('text=Resume Editor', { timeout: 10000 })
    console.log('   ✓ Page loaded')

    // Click Resume tab
    console.log('2. Clicking Resume tab...')
    await page.click('button:has-text("Resume")')
    await page.waitForTimeout(500)

    // Look for School Link input fields
    console.log('3. Looking for School Link input fields...')
    const schoolLinkInputs = await page.locator('input[placeholder*="example.edu"]').count()
    console.log(`   Found ${schoolLinkInputs} School Link input(s)`)

    // Get all inputs in Education section
    const inputs = await page.locator('input[type="text"]').all()
    console.log(`   Total text inputs on page: ${inputs.length}`)

    // Try to find inputs near "School Link" label
    const schoolLinkLabel = await page.locator('text=School Link').count()
    console.log(`   "School Link" labels found: ${schoolLinkLabel}`)

    // Check if there are any inputs with values that look like URLs
    for (let i = 0; i < inputs.length; i++) {
      const value = await inputs[i].inputValue()
      if (value && value.includes('http')) {
        console.log(`   Input ${i} has URL value: ${value}`)
      }
    }

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test_screenshot.png', fullPage: true })
    console.log('   Screenshot saved to test_screenshot.png')

    console.log('\n=== Test Complete ===')

  } catch (err) {
    console.error('Test failed:', err.message)
  } finally {
    await browser.close()
  }
}

testSchoolLink()