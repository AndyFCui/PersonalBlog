# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/resume-editor-main.spec.ts >> AdminResumeEditor - Tab Navigation >> page loads with Resume Editor title
- Location: tests/resume-editor-main.spec.ts:10:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "Resume Editor"
Received string:    "Admin Access"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1')
    9 × locator resolved to <h1 class="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Admin Access</h1>
      - unexpected value "Admin Access"

```

# Page snapshot

```yaml
- generic [ref=e40]:
  - generic [ref=e41]:
    - img [ref=e43]
    - heading "Admin Access" [level=1] [ref=e45]
    - paragraph [ref=e46]: Enter your credentials to continue
  - generic [ref=e47]:
    - generic [ref=e48]:
      - text: Email
      - generic [ref=e49]:
        - img [ref=e50]
        - textbox "admin@example.com" [ref=e53]
    - generic [ref=e54]:
      - text: Password
      - generic [ref=e55]:
        - img [ref=e56]
        - textbox "••••••••" [ref=e59]
    - button "Sign In" [ref=e60] [cursor=pointer]:
      - text: Sign In
      - img
  - link "← Back to Portfolio" [ref=e62] [cursor=pointer]:
    - /url: /
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | const BASE_URL = 'http://localhost:5173'
  4  | 
  5  | test.describe('AdminResumeEditor - Tab Navigation', () => {
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto(`${BASE_URL}/admin/resume`, { waitUntil: 'networkidle' })
  8  |   })
  9  | 
  10 |   test('page loads with Resume Editor title', async ({ page }) => {
> 11 |     await expect(page.locator('h1')).toContainText('Resume Editor')
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  12 |   })
  13 | 
  14 |   test('shows four tabs', async ({ page }) => {
  15 |     await expect(page.locator('button:has-text("Main Info")')).toBeVisible()
  16 |     await expect(page.locator('button:has-text("Resume")')).toBeVisible()
  17 |     await expect(page.locator('button:has-text("Portfolio")')).toBeVisible()
  18 |     await expect(page.locator('button:has-text("Images")')).toBeVisible()
  19 |   })
  20 | 
  21 |   test('Main Info tab is active by default', async ({ page }) => {
  22 |     const mainInfoBtn = page.locator('button:has-text("Main Info")')
  23 |     await expect(mainInfoBtn).toHaveClass(/bg-primary/)
  24 |   })
  25 | 
  26 |   test('clicking Resume tab switches content', async ({ page }) => {
  27 |     await page.click('button:has-text("Resume")')
  28 |     await expect(page.locator('text=Work Experience')).toBeVisible()
  29 |   })
  30 | 
  31 |   test('clicking Portfolio tab switches content', async ({ page }) => {
  32 |     await page.click('button:has-text("Portfolio")')
  33 |     await expect(page.locator('text=Projects')).toBeVisible()
  34 |   })
  35 | 
  36 |   test('clicking Images tab switches content', async ({ page }) => {
  37 |     await page.click('button:has-text("Images")')
  38 |     await expect(page.locator('text=Image Library')).toBeVisible()
  39 |   })
  40 | })
  41 | 
```