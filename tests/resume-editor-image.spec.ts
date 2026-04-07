import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('AdminResumeEditor - Image Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/resume`, { waitUntil: 'networkidle' })
    // Navigate to Images tab
    await page.click('button:has-text("Images")')
    await expect(page.locator('text=Image Library')).toBeVisible()
  })

  test('shows Image Library title', async ({ page }) => {
    await expect(page.locator('text=Image Library').first()).toBeVisible()
  })

  test('shows Upload Images button', async ({ page }) => {
    await expect(page.locator('button:has-text("Upload Images")')).toBeVisible()
  })

  test('shows URL Format section', async ({ page }) => {
    await expect(page.locator('text=URL Format')).toBeVisible()
  })

  test('shows image count', async ({ page }) => {
    // Should show "X images uploaded"
    await expect(page.locator('text=images uploaded')).toBeVisible()
  })
})
