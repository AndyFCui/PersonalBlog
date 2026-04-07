import { chromium } from 'playwright-core'

const CHROMIUM_PATH = '/Users/andycui/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'

async function test() {
  console.log('Launching Chromium...')
  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    headless: true
  })
  
  const page = await browser.newPage()
  
  const consoleLogs = []
  page.on('console', msg => {
    const text = msg.text()
    consoleLogs.push({ type: msg.type(), text })
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', text)
    }
  })
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message)
  })
  
  console.log('Navigating to /admin/resume...')
  await page.goto('http://localhost:5174/admin/resume', { timeout: 60000 })
  
  // Wait for React to render
  await page.waitForTimeout(5000)
  
  // Check body content
  const bodyHTML = await page.evaluate(() => document.body.innerHTML)
  console.log('Body HTML length:', bodyHTML.length)
  console.log('Body snippet:', bodyHTML.substring(0, 800))
  
  // Check if 404
  if (bodyHTML.includes('404')) {
    console.log('Page is 404!')
  }
  
  // Check for our tabs
  const hasResume = bodyHTML.includes('Resume')
  const hasMainInfo = bodyHTML.includes('Main Info')
  console.log('Has Resume tab:', hasResume)
  console.log('Has Main Info tab:', hasMainInfo)
  
  await browser.close()
}

test().catch(e => {
  console.error('Test failed:', e)
  process.exit(1)
})
