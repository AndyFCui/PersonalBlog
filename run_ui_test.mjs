import { chromium } from 'playwright-core'

const CHROMIUM_PATH = '/Users/andycui/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'

async function test() {
  console.log('Launching Chromium...')
  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    headless: true
  })
  
  const page = await browser.newPage()
  
  // Collect console messages
  const consoleLogs = []
  page.on('console', msg => {
    const text = msg.text()
    consoleLogs.push(text)
    if (text.includes('REMOVE') || text.includes('SAVE') || text.includes('Education')) {
      console.log('BROWSER CONSOLE:', text)
    }
  })
  
  console.log('Navigating to resume editor...')
  await page.goto('http://localhost:5174/admin/resume-editor', { timeout: 60000 })
  
  // Wait for React to hydrate
  await page.waitForTimeout(3000)
  
  // Check what's on the page
  const bodyText = await page.textContent('body')
  console.log('Page loaded, contains Resume:', bodyText.includes('Resume'))
  console.log('Page loaded, contains Main Info:', bodyText.includes('Main Info'))
  
  // Find all buttons
  const buttons = await page.locator('button').all()
  console.log('Total buttons found:', buttons.length)
  for (const btn of buttons) {
    const text = await btn.textContent()
    if (text && text.trim()) {
      console.log('  Button:', text.trim())
    }
  }
  
  // Try clicking Resume tab
  try {
    await page.locator('button:has-text("Resume")').click({ timeout: 5000 })
    console.log('Clicked Resume tab')
    await page.waitForTimeout(1000)
  } catch (e) {
    console.log('Could not click Resume tab:', e.message)
  }
  
  // Now try to find and click delete button
  try {
    const deleteButtons = await page.locator('button').all()
    for (const btn of deleteButtons) {
      const html = await btn.innerHTML()
      if (html.includes('Trash2') || (html.includes('trash') || html.includes('delete'))) {
        console.log('Found delete button, clicking...')
        await btn.click()
        console.log('Delete button clicked')
        await page.waitForTimeout(500)
        break
      }
    }
  } catch (e) {
    console.log('Error clicking delete:', e.message)
  }
  
  // Print all console logs that contain our debug output
  console.log('\n=== All relevant console logs ===')
  for (const log of consoleLogs) {
    if (log.includes('REMOVE') || log.includes('SAVE') || log.includes('Education') || log.includes('School')) {
      console.log(log)
    }
  }
  
  await browser.close()
  console.log('Test completed')
}

test().catch(e => {
  console.error('Test failed:', e)
  process.exit(1)
})
