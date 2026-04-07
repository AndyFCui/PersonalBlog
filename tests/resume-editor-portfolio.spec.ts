import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('AdminResumeEditor - Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/resume`, { waitUntil: 'networkidle' })
    // Navigate to Portfolio tab
    await page.click('button:has-text("Portfolio")')
    await expect(page.locator('text=Projects')).toBeVisible()
  })

  test('shows Projects section with Add button', async ({ page }) => {
    await expect(page.locator('text=Projects')).toBeVisible()
    await expect(page.locator('button:has-text("Add")')).toBeVisible()
  })

  test('can add new project', async ({ page }) => {
    await page.click('button:has-text("Add")')

    // Should show new empty project form
    await expect(page.locator('input[placeholder*="Title"]').last()).toBeVisible()
  })

  test('can fill in project fields', async ({ page }) => {
    await page.click('button:has-text("Add")')

    // Fill title
    const titleInputs = page.locator('input[placeholder*="Title"]')
    await titleInputs.last().fill('Test Project')

    // Fill category
    const categoryInputs = page.locator('input[placeholder*="Category"]')
    await categoryInputs.last().fill('Web Development')

    // Verify
    await expect(titleInputs.last()).toHaveValue('Test Project')
  })

  test('can remove project', async ({ page }) => {
    await page.click('button:has-text("Add")')

    // Find and click the trash button
    const trashBtns = page.locator('button').filter({ has: page.locator('svg.h-4.w-4.text-destructive') })
    await trashBtns.last().click()

    // Should not show the title input anymore
    const titleInputs = page.locator('input[placeholder*="Title"]')
    await expect(titleInputs).toHaveCount(0)
  })

  test('has Save Portfolio button', async ({ page }) => {
    await expect(page.locator('button:has-text("Save Portfolio")')).toBeVisible()
  })
})
