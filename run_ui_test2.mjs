import { chromium } from 'playwright-core'

const CHROMIUM_PATH = '/Users/andycui/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'

async function test() {
  console.log('Launching Chromium...')
  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    headless: true
  })
  
  const page = await browser.newPage()
  
  // Collect ALL console messages
  page.on('console', msg => {
    console.log('CONSOLE:', msg.type(), msg.text())
  })
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message)
  })
  
  console.log('Navigating to resume editor...')
  const response = await page.goto('http://localhost:5174/admin/resume-editor', { 
    timeout: 60000,
    waitUntil: 'domcontentloaded'
  })
  console.log('Response status:', response?.status())
  
  // Wait longer for React to render
  await page.waitForTimeout(5000)
  
  // Get the HTML content
  const content = await page.content()
  console.log('HTML length:', content.length)
  console.log('HTML includes root:', content.includes('root'))
  console.log('HTML includes resume:', content.toLowerCase().includes('resume'))
  
  // Check what's in the body
  const bodyHTML = await page.evaluate(() => document.body.innerHTML)
  console.log('Body HTML length:', bodyHTML.length)
  console.log('Body snippet:', bodyHTML.substring(0, 500))
  
  await browser.close()
}

test().catch(e => {
  console.error('Test failed:', e)
  process.exit(1)
})
