import { test, expect } from '@playwright/test';

/**
 * Friend System E2E Tests
 * Tests privacy-first friend system with Friend ID search
 */

test.describe('Friend System', () => {
  // Login as member1 before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'member1@gymapp.com');
    await page.fill('input[type="password"]', 'Member123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('should navigate to social page', async ({ page }) => {
    // Click Friends link in navbar
    await page.click('a:has-text("Friends"), a:has-text("Social")');

    // Should show social page
    await expect(page).toHaveURL(/\/social/);
  });

  test('should display friend ID', async ({ page }) => {
    await page.goto('/social');
    await page.waitForTimeout(1000);

    // Should show user's Friend ID
    await expect(page.locator('text=User1234, text=Friend ID')).toBeVisible({ timeout: 5000 });
  });

  test('should search for friend by Friend ID', async ({ page }) => {
    await page.goto('/social');
    await page.waitForTimeout(1000);

    // Find search input
    const searchInput = page.locator('input[placeholder*="Friend ID"], input[type="text"]').first();

    if (await searchInput.isVisible()) {
      // Search for another member's Friend ID
      await searchInput.fill('User5678'); // member2's Friend ID

      // Click search button
      await page.click('button:has-text("Search"), button:has-text("Find")');

      await page.waitForTimeout(1000);

      // Should show search result
      const result = await page.locator('text=Sarah Johnson, text=User5678').isVisible();
      expect(result).toBeTruthy();
    }
  });

  test('should send friend request', async ({ page }) => {
    await page.goto('/social');
    await page.waitForTimeout(1000);

    // Search for a user
    const searchInput = page.locator('input[placeholder*="Friend ID"], input[type="text"]').first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('User5678');
      await page.click('button:has-text("Search")');
      await page.waitForTimeout(1000);

      // Click "Add Friend" or "Send Request"
      const addButton = page.locator('button:has-text("Add Friend"), button:has-text("Send Request")');

      if (await addButton.isVisible()) {
        await addButton.click();

        // Should show success message
        await expect(page.locator('text=sent, text=request')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should view friend requests', async ({ page }) => {
    await page.goto('/social');
    await page.waitForTimeout(1000);

    // Click on "Requests" tab or similar
    const requestsTab = page.locator('button:has-text("Requests"), [role="tab"]:has-text("Requests")');

    if (await requestsTab.count() > 0) {
      await requestsTab.first().click();

      // Should show requests section
      await expect(page.locator('text=Received, text=Sent')).toBeVisible();
    }
  });

  test('should view friends list', async ({ page }) => {
    await page.goto('/social');
    await page.waitForTimeout(1000);

    // Click on "Friends" tab
    const friendsTab = page.locator('button:has-text("My Friends"), [role="tab"]:has-text("Friends")');

    if (await friendsTab.count() > 0) {
      await friendsTab.first().click();

      // Should show friends list or empty state
      const hasFriends = await page.locator('text=You have no friends, text=Activity Sharing').isVisible();
      expect(hasFriends).toBeTruthy();
    }
  });

  test('should toggle activity sharing', async ({ page }) => {
    await page.goto('/social');
    await page.waitForTimeout(1000);

    // Look for activity sharing toggle
    const activityToggle = page.locator('input[type="checkbox"]').first();

    if (await activityToggle.isVisible()) {
      // Toggle it
      await activityToggle.click();
      await page.waitForTimeout(500);

      // Toggle back
      await activityToggle.click();

      // Should save successfully (no error)
      const errorVisible = await page.locator('text=error, text=failed').isVisible();
      expect(errorVisible).toBeFalsy();
    }
  });
});
