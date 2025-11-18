import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * Tests login functionality and role-based access
 */

test.describe('Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/GymApp/);
    await expect(page.locator('h1')).toContainText(/sign in/i);
  });

  test('should login as member', async ({ page }) => {
    await page.goto('/login');

    // Fill in credentials
    await page.fill('input[type="email"]', 'member1@gymapp.com');
    await page.fill('input[type="password"]', 'Member123!');

    // Click sign in
    await page.click('button[type="submit"]');

    // Should redirect to home page
    await expect(page).toHaveURL('/');

    // Should show user name in navbar
    await expect(page.locator('text=John Smith')).toBeVisible({ timeout: 10000 });
  });

  test('should login as admin', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'admin@gymapp.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    // Admin should have access to admin route
    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText(/admin/i);
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'member1@gymapp.com');
    await page.fill('input[type="password"]', 'Member123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');

    // Click logout
    await page.click('text=Logout');

    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });

  test('should prevent member from accessing admin route', async ({ page }) => {
    // Login as member
    await page.goto('/login');
    await page.fill('input[type="email"]', 'member1@gymapp.com');
    await page.fill('input[type="password"]', 'Member123!');
    await page.click('button[type="submit"]');

    // Try to access admin route
    await page.goto('/admin');

    // Should redirect to home or show error
    await expect(page).not.toHaveURL('/admin');
  });
});
