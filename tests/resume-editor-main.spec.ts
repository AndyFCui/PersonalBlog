import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('AdminResumeEditor - Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/resume`, { waitUntil: 'networkidle' })
  })

  test('page loads with Resume Editor title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Resume Editor')
  })

  test('shows four tabs', async ({ page }) => {
    await expect(page.locator('button:has-text("Main Info")')).toBeVisible()
    await expect(page.locator('button:has-text("Resume")')).toBeVisible()
    await expect(page.locator('button:has-text("Portfolio")')).toBeVisible()
    await expect(page.locator('button:has-text("Images")')).toBeVisible()
  })

  test('Main Info tab is active by default', async ({ page }) => {
    const mainInfoBtn = page.locator('button:has-text("Main Info")')
    await expect(mainInfoBtn).toHaveClass(/bg-primary/)
  })

  test('clicking Resume tab switches content', async ({ page }) => {
    await page.click('button:has-text("Resume")')
    await expect(page.locator('text=Work Experience')).toBeVisible()
  })

  test('clicking Portfolio tab switches content', async ({ page }) => {
    await page.click('button:has-text("Portfolio")')
    await expect(page.locator('text=Projects')).toBeVisible()
  })

  test('clicking Images tab switches content', async ({ page }) => {
    await page.click('button:has-text("Images")')
    await expect(page.locator('text=Image Library')).toBeVisible()
  })
})
