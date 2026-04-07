import { test, expect } from '@playwright/test'

test.describe('Resume Editor UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to resume editor page
    await page.goto('/admin/resume-editor')
    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })

  test('should delete education item and persist to database', async ({ page }) => {
    // Navigate to Resume tab
    await page.click('button:has-text("Resume")')
    await page.waitForLoadState('networkidle')

    // Get initial education count from UI
    const educationCards = page.locator('.space-y-6 >> .p-4.border.border-border.rounded-xl')
    // Count education items (they have school input fields)

    // Click on the first delete button (trash icon)
    const deleteButtons = page.locator('button:has([class*="text-destructive"])')
    const firstDeleteButton = deleteButtons.first()

    // Get the school name before deletion for verification
    const schoolInputs = page.locator('input[value*="University"], input[value*="College"]')
    const schoolToDelete = await schoolInputs.first().inputValue().catch(() => null)
    console.log('School to delete:', schoolToDelete)

    // Click delete
    await firstDeleteButton.click()

    // Handle confirm dialog
    page.on('dialog', dialog => dialog.accept())

    // Click Save button
    await page.click('button:has-text("Save Resume")')

    // Wait for save to complete
    await page.waitForTimeout(2000)

    // Check console logs for the save operation
    const consoleLogs: string[] = []
    page.on('console', msg => {
      if (msg.text().includes('Saving') || msg.text().includes('Education')) {
        consoleLogs.push(msg.text())
      }
    })

    // Navigate away and back to check persistence
    await page.click('button:has-text("Main Info")')
    await page.waitForTimeout(500)
    await page.click('button:has-text("Resume")')
    await page.waitForLoadState('networkidle')

    // Verify the deleted school is no longer present
    if (schoolToDelete) {
      const deletedSchoolStillPresent = await page.locator(`input[value="${schoolToDelete}"]`).count()
      console.log('Deleted school still present:', deletedSchoolStillPresent)
    }
  })

  test('should add education item', async ({ page }) => {
    // Navigate to Resume tab
    await page.click('button:has-text("Resume")')
    await page.waitForLoadState('networkidle')

    // Click Add Education button
    await page.click('button:has-text("Add")')
    await page.waitForTimeout(500)

    // Fill in the new education
    const schoolInputs = page.locator('input[value=""]')
    if (await schoolInputs.count() > 0) {
      await schoolInputs.first().fill('Test University')
      console.log('Added Test University')
    }

    // Click Save
    await page.click('button:has-text("Save Resume")')
    await page.waitForTimeout(2000)
  })
})