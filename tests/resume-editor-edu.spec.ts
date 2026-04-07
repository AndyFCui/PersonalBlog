import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('AdminResumeEditor - Education CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/resume`, { waitUntil: 'networkidle' })
    // Navigate to Resume tab
    await page.click('button:has-text("Resume")')
    await expect(page.locator('text=Education')).toBeVisible()
  })

  test('shows existing education entries', async ({ page }) => {
    // Should show Education card with Add button
    await expect(page.locator('text=Education')).toBeVisible()
    await expect(page.locator('button:has-text("Add")').first()).toBeVisible()
  })

  test('can add new education', async ({ page }) => {
    await page.click('button:has-text("Add")')

    // Should show new empty form with School input
    await expect(page.locator('input[placeholder*="School"]').last()).toBeVisible()
  })

  test('can fill in education fields including schoolLink', async ({ page }) => {
    await page.click('button:has-text("Add")')

    // Fill school
    const schoolInputs = page.locator('input[placeholder*="School"]')
    await schoolInputs.last().fill('Test University')

    // Fill degree
    const degreeInputs = page.locator('input[placeholder*="Degree"]')
    await degreeInputs.last().fill('Bachelor of Science')

    // Fill school link
    const schoolLinkInputs = page.locator('input[placeholder*="https://www.example.edu/"]')
    await schoolLinkInputs.last().fill('https://test.edu/')

    // Verify values are set
    await expect(schoolInputs.last()).toHaveValue('Test University')
    await expect(schoolLinkInputs.last()).toHaveValue('https://test.edu/')
  })

  test('can remove education', async ({ page }) => {
    await page.click('button:has-text("Add")')

    // Find and click the trash button
    const trashBtns = page.locator('button').filter({ has: page.locator('svg.h-4.w-4.text-destructive') })
    await trashBtns.last().click()

    // Should not show the school input anymore
    const schoolInputs = page.locator('input[placeholder*="School"]')
    await expect(schoolInputs).toHaveCount(0)
  })
})
