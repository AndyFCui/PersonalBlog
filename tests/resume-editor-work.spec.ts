import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('AdminResumeEditor - Work Experience CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/resume`, { waitUntil: 'networkidle' })
    // Navigate to Resume tab
    await page.click('button:has-text("Resume")')
    await expect(page.locator('text=Work Experience')).toBeVisible()
  })

  test('shows existing work experiences', async ({ page }) => {
    // Should show Work Experience card with Add button
    await expect(page.locator('text=Work Experience')).toBeVisible()
    await expect(page.locator('button:has-text("Add")').first()).toBeVisible()
  })

  test('can add new work experience', async ({ page }) => {
    const initialCount = await page.locator('.border-border.rounded-xl').count()

    await page.click('button:has-text("Add")')

    // Should show new empty form
    await expect(page.locator('input[placeholder*="Company"]').last()).toBeVisible()
  })

  test('can fill in work experience fields', async ({ page }) => {
    await page.click('button:has-text("Add")')

    // Fill company
    const companyInputs = page.locator('input[placeholder*="Company"]')
    await companyInputs.last().fill('Test Company')

    // Fill title
    const titleInputs = page.locator('input[placeholder*="Title"]')
    await titleInputs.last().fill('Software Engineer')

    // Fill years
    const yearsInputs = page.locator('input[placeholder*="Years"]')
    await yearsInputs.last().fill('2020-2024')

    // Verify values are set
    await expect(companyInputs.last()).toHaveValue('Test Company')
  })

  test('can remove work experience', async ({ page }) => {
    await page.click('button:has-text("Add")')

    // Find and click the trash button
    const trashBtns = page.locator('button').filter({ has: page.locator('svg.h-4.w-4.text-destructive') })
    await trashBtns.last().click()

    // Should not show the form anymore
    const companyInputs = page.locator('input[placeholder*="Company"]')
    await expect(companyInputs).toHaveCount(0)
  })
})
