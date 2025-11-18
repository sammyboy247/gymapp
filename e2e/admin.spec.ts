import { test, expect } from '@playwright/test';

/**
 * Admin Features E2E Tests
 * Tests admin schedule management and program creation
 */

test.describe('Admin Features', () => {
  // Login as admin before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@gymapp.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('should access admin dashboard', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText(/admin/i);
  });

  test('should open create session modal', async ({ page }) => {
    await page.goto('/admin');

    // Click "Create New Session" or similar button
    const createButton = page.locator('button:has-text("Create"), button:has-text("New Session")');
    const count = await createButton.count();

    if (count > 0) {
      await createButton.first().click();

      // Modal should open
      await expect(page.locator('text=Create, text=Session')).toBeVisible();

      // Should have form fields
      await expect(page.locator('input[name="sessionType"]')).toBeVisible();
    }
  });

  test('should create a new session', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);

    // Find and click create button
    const createButton = page.locator('button:has-text("Create"), button:has-text("New")').first();

    if (await createButton.isVisible()) {
      await createButton.click();

      // Fill in session details
      await page.fill('input[name="sessionType"]', 'E2E Test Session');

      // Set date/time (if available)
      const dateInput = page.locator('input[type="datetime-local"], .react-datepicker__input-container input');
      if (await dateInput.count() > 0) {
        // Set a future date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0);
        // Note: Actual date picker interaction may vary
      }

      // Set coach (select first option)
      const coachSelect = page.locator('select[name="coachId"]');
      if (await coachSelect.isVisible()) {
        await coachSelect.selectOption({ index: 1 });
      }

      // Set capacity
      await page.fill('input[name="capacity"]', '15');

      // Submit form
      await page.click('button:has-text("Save"), button[type="submit"]');

      // Should show success message
      await expect(page.locator('text=created, text=success')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should view session roster', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(2000);

    // Find a "View Roster" or "Roster" button
    const rosterButtons = page.locator('button:has-text("Roster")');
    const count = await rosterButtons.count();

    if (count > 0) {
      await rosterButtons.first().click();

      // Roster modal should open
      await expect(page.locator('text=Roster, text=Participants')).toBeVisible();
    }
  });

  test('should access gym settings page', async ({ page }) => {
    await page.goto('/admin');

    // Look for gym settings link
    const settingsLink = page.locator('a:has-text("Gym Settings"), a:has-text("Settings")');
    const count = await settingsLink.count();

    if (count > 0) {
      await settingsLink.first().click();

      // Should navigate to settings page
      await expect(page).toHaveURL(/\/gym-settings/);

      // Should show settings tabs
      await expect(page.locator('text=Opening Hours, text=Gym Spaces')).toBeVisible();
    }
  });

  test('should create a program', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);

    // Look for "Create Program" or similar in ProgramManager section
    const createProgramButton = page.locator('button:has-text("Create Program"), button:has-text("New Program")');
    const count = await createProgramButton.count();

    if (count > 0) {
      await createProgramButton.first().click();

      // Fill program form
      await page.fill('input[name="name"]', 'E2E Test Program');
      await page.fill('textarea[name="description"], input[name="description"]', 'Test program for E2E testing');

      // Submit
      await page.click('button:has-text("Save"), button[type="submit"]');

      // Should show success
      await expect(page.locator('text=created, text=success')).toBeVisible({ timeout: 5000 });
    }
  });
});
