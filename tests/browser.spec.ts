/**
 * Cross-browser and Accessibility Tests
 * Tests across Chrome, Firefox, Safari, and Edge browsers
 * Also runs axe-core accessibility checks
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Test landing page loads on all browsers
test.describe('Landing Page', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/RadReport/i);
  });

  // Test hero section
  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('h1');
    await expect(hero).toBeVisible();
  });

  // Test navigation
  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});

// Test template browser
test.describe('Template Browser', () => {
  test('should load templates page', async ({ page }) => {
    await page.goto('/templates');
    await expect(page).toHaveTitle(/Templates/i);
  });

  test('should filter by modality', async ({ page }) => {
    await page.goto('/templates');
    // Check for CT filter option
    const ctFilter = page.locator('[data-modality="CT"]').first();
    await ctFilter.click();
    await expect(page.locator('.template-card')).toBeVisible();
  });
});

// Test accessibility with axe-core
test.describe('Accessibility (axe-core)', () => {
  test('homepage should be accessible', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test('templates page should be accessible', async ({ page }) => {
    await page.goto('/templates');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
});

// Test performance - basic page load
test.describe('Performance', () => {
  test('homepage should load under 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(3000);
  });
});

// Test responsive design
test.describe('Responsive Design', () => {
  test('should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should work on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});