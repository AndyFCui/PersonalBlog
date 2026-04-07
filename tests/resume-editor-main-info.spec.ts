import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('AdminResumeEditor - Main Info', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/resume`, { waitUntil: 'networkidle' })
    // Should be on Main Info tab by default
  })

  test('shows basic information fields', async ({ page }) => {
    await expect(page.locator('text=Basic Information')).toBeVisible()
    await expect(page.locator('text=Name')).toBeVisible()
    await expect(page.locator('text=Occupation')).toBeVisible()
    await expect(page.locator('text=Bio')).toBeVisible()
  })

  test('shows intro section', async ({ page }) => {
    await expect(page.locator('text=Intro')).toBeVisible()
    await expect(page.locator('text=Role')).toBeVisible()
    await expect(page.locator('text=Company')).toBeVisible()
  })

  test('shows contact section', async ({ page }) => {
    await expect(page.locator('text=Contact')).toBeVisible()
    await expect(page.locator('text=Email')).toBeVisible()
    await expect(page.locator('text=Phone')).toBeVisible()
    await expect(page.locator('text=City')).toBeVisible()
    await expect(page.locator('text=Website')).toBeVisible()
  })

  test('shows social links section', async ({ page }) => {
    await expect(page.locator('text=Social Links')).toBeVisible()
    await expect(page.locator('button:has-text("Add")')).toBeVisible()
  })

  test('has Save Main Info button', async ({ page }) => {
    await expect(page.locator('button:has-text("Save Main Info")')).toBeVisible()
  })
})
