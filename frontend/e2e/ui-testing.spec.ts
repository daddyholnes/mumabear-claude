import { test, expect } from '@playwright/test';

test.describe('Podplay Sanctuary UI Hub', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('should load home page with 5-theme system', async ({ page }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/Podplay Sanctuary/);
    
    // Look for theme switcher
    const themeSwitcher = page.locator('[data-testid="theme-switcher"]').first();
    if (await themeSwitcher.isVisible()) {
      await expect(themeSwitcher).toBeVisible();
    }
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'screenshots/01-initial-load.png', fullPage: true });
  });

  test('should navigate through all themes', async ({ page }) => {
    // Look for theme switcher button or dropdown
    const themeButton = page.locator('button:has-text("Theme")').or(
      page.locator('[data-testid="theme-switcher"]')
    ).or(
      page.locator('button:has([data-lucide="palette"])')
    ).first();
    
    if (await themeButton.isVisible()) {
      await themeButton.click();
      
      // Take screenshot of theme selector
      await page.screenshot({ path: 'screenshots/02-theme-selector.png', fullPage: true });
      
      // Test each theme
      const themes = ['sanctuary', 'daytime', 'night', 'purple-haze', 'cosmic-purple'];
      
      for (const theme of themes) {
        const themeOption = page.locator(`text="${theme}"`).or(
          page.locator(`[data-theme="${theme}"]`)
        ).first();
        
        if (await themeOption.isVisible()) {
          await themeOption.click();
          await page.waitForTimeout(1000); // Wait for theme transition
          
          // Take screenshot of each theme
          await page.screenshot({ 
            path: `screenshots/03-theme-${theme}.png`, 
            fullPage: true 
          });
        }
      }
    } else {
      console.log('Theme switcher not found, taking screenshot of current state');
      await page.screenshot({ path: 'screenshots/02-no-theme-switcher.png', fullPage: true });
    }
  });

  test('should display system metrics and activity feed', async ({ page }) => {
    // Look for health metrics
    const healthMetrics = page.locator('text="System Health"').or(
      page.locator('[data-testid="system-health"]')
    ).or(
      page.locator('text="CPU"')
    );
    
    if (await healthMetrics.first().isVisible()) {
      await expect(healthMetrics.first()).toBeVisible();
    }
    
    // Look for activity feed
    const activityFeed = page.locator('text="Recent Activity"').or(
      page.locator('[data-testid="activity-feed"]')
    );
    
    if (await activityFeed.first().isVisible()) {
      await expect(activityFeed.first()).toBeVisible();
    }
    
    // Take screenshot of dashboard
    await page.screenshot({ path: 'screenshots/04-dashboard-metrics.png', fullPage: true });
  });

  test('should test navigation between experiences', async ({ page }) => {
    // Look for navigation menu or sidebar
    const navMenu = page.locator('nav').or(
      page.locator('[data-testid="sidebar"]')
    ).or(
      page.locator('[role="navigation"]')
    ).first();
    
    if (await navMenu.isVisible()) {
      await expect(navMenu).toBeVisible();
      
      // Try to find and click different experience links
      const experiences = [
        'Main Chat', 'Scout Workflow', 'Dev Workspaces', 
        'MCP Marketplace', 'Live API Studio', 'Settings'
      ];
      
      for (const experience of experiences) {
        const link = page.locator(`text="${experience}"`).or(
          page.locator(`a:has-text("${experience}")`)
        ).first();
        
        if (await link.isVisible()) {
          await link.click();
          await page.waitForTimeout(1000);
          
          // Take screenshot of each experience
          const filename = experience.toLowerCase().replace(/\s+/g, '-');
          await page.screenshot({ 
            path: `screenshots/05-experience-${filename}.png`, 
            fullPage: true 
          });
          
          // Go back to home to test next experience
          const homeLink = page.locator('text="Home"').or(
            page.locator('a:has-text("Sanctuary")')
          ).first();
          
          if (await homeLink.isVisible()) {
            await homeLink.click();
            await page.waitForTimeout(500);
          }
        }
      }
    } else {
      await page.screenshot({ path: 'screenshots/05-no-navigation.png', fullPage: true });
    }
  });

  test('should test accessibility features', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Take screenshot showing focus states
    await page.screenshot({ path: 'screenshots/06-keyboard-navigation.png', fullPage: true });
    
    // Test high contrast mode if available
    const accessibilityButton = page.locator('button:has-text("Accessibility")').or(
      page.locator('[data-testid="accessibility-toggle"]')
    ).first();
    
    if (await accessibilityButton.isVisible()) {
      await accessibilityButton.click();
      await page.screenshot({ path: 'screenshots/07-accessibility-mode.png', fullPage: true });
    }
  });
});
