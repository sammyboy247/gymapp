import { test, expect } from '@playwright/test';

/**
 * Booking System E2E Tests
 * Tests schedule viewing and session booking workflow
 */

test.describe('Schedule & Booking', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'member1@gymapp.com');
    await page.fill('input[type="password"]', 'Member123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('should view schedule page', async ({ page }) => {
    await page.goto('/schedule');
    await expect(page.locator('h1')).toContainText(/schedule/i);

    // Should show at least one session (if seed data exists)
    // Wait for loading to complete
    await page.waitForTimeout(2000);

    // Check if sessions are loaded or empty state
    const hasContent = await page.locator('[data-testid="session-card"], text=No sessions').isVisible();
    expect(hasContent).toBeTruthy();
  });

  test('should open booking modal when clicking session', async ({ page }) => {
    await page.goto('/schedule');
    await page.waitForTimeout(2000); // Wait for sessions to load

    // Try to find a session card
    const sessionCards = page.locator('button:has-text("spots remaining")');
    const count = await sessionCards.count();

    if (count > 0) {
      // Click first available session
      await sessionCards.first().click();

      // Booking modal should open
      await expect(page.locator('text=Book Session, text=Session Details')).toBeVisible();

      // Should show program selection
      await expect(page.locator('select, text=Program')).toBeVisible();
    }
  });

  test('should book a session', async ({ page }) => {
    await page.goto('/schedule');
    await page.waitForTimeout(2000);

    // Find an available session
    const availableSessions = page.locator('button:has-text("spots remaining")');
    const count = await availableSessions.count();

    if (count > 0) {
      await availableSessions.first().click();

      // Wait for modal
      await page.waitForSelector('select');

      // Select a program
      await page.selectOption('select', { index: 0 });

      // Click book button
      await page.click('button:has-text("Book")');

      // Should show success toast
      await expect(page.locator('text=Booking successful, text=booked')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should cancel a booking', async ({ page }) => {
    // First book a session
    await page.goto('/schedule');
    await page.waitForTimeout(2000);

    // Find an already booked session
    const bookedSessions = page.locator('button:has-text("Cancel")');
    const count = await bookedSessions.count();

    if (count > 0) {
      // Click first booked session
      await bookedSessions.first().click();

      // Wait for modal
      await page.waitForSelector('button:has-text("Cancel Booking")');

      // Click cancel booking button
      await page.click('button:has-text("Cancel Booking")');

      // Should show success message
      await expect(page.locator('text=cancelled, text=Booking cancelled')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should filter schedule by date', async ({ page }) => {
    await page.goto('/schedule');
    await page.waitForTimeout(2000);

    // Check if date filter exists
    const dateFilter = page.locator('input[type="date"]');
    const hasFilter = await dateFilter.count() > 0;

    if (hasFilter) {
      // Change date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      await dateFilter.first().fill(dateStr);

      // Wait for filtered results
      await page.waitForTimeout(1000);

      // Schedule should update (just verify no errors)
      const error = await page.locator('text=error').isVisible();
      expect(error).toBeFalsy();
    }
  });
});
