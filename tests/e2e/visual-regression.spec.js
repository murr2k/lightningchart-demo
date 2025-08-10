import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for charts to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow animations to complete
  });

  test('Line Chart - Visual Regression', async ({ page }) => {
    const lineChartSection = page.locator('#chart-line').locator('..');
    await lineChartSection.scrollIntoViewIfNeeded();
    
    // Capture initial state
    await expect(lineChartSection).toHaveScreenshot('line-chart-initial.png');
    
    // Interact with the chart
    const chartCanvas = lineChartSection.locator('canvas').first();
    await chartCanvas.hover();
    await page.waitForTimeout(500);
    await expect(lineChartSection).toHaveScreenshot('line-chart-hover.png');
    
    // Test zoom interaction
    await chartCanvas.click();
    await page.mouse.wheel(0, -100);
    await page.waitForTimeout(500);
    await expect(lineChartSection).toHaveScreenshot('line-chart-zoomed.png');
  });

  test('Bar Chart - Visual Regression', async ({ page }) => {
    const barChartSection = page.locator('#chart-bar').locator('..');
    await barChartSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    await expect(barChartSection).toHaveScreenshot('bar-chart-initial.png');
    
    // Test bar hover
    const chartCanvas = barChartSection.locator('canvas').first();
    const box = await chartCanvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(500);
      await expect(barChartSection).toHaveScreenshot('bar-chart-hover.png');
    }
  });

  test('Pie Chart - Visual Regression', async ({ page }) => {
    const pieChartSection = page.locator('#chart-pie').locator('..');
    await pieChartSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    await expect(pieChartSection).toHaveScreenshot('pie-chart-initial.png');
    
    // Test slice interaction
    const chartCanvas = pieChartSection.locator('canvas').first();
    await chartCanvas.click({ position: { x: 100, y: 100 } });
    await page.waitForTimeout(500);
    await expect(pieChartSection).toHaveScreenshot('pie-chart-selected.png');
  });

  test('3D Surface - Visual Regression', async ({ page }) => {
    const surfaceSection = page.locator('#chart-3d').locator('..');
    await surfaceSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000); // 3D charts need more time
    
    await expect(surfaceSection).toHaveScreenshot('surface-chart-initial.png');
    
    // Test rotation
    const chartCanvas = surfaceSection.locator('canvas').first();
    const box = await chartCanvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.3);
      await page.mouse.up();
      await page.waitForTimeout(1000);
      await expect(surfaceSection).toHaveScreenshot('surface-chart-rotated.png');
    }
  });

  test('Area Chart - Visual Regression', async ({ page }) => {
    const areaSection = page.locator('#chart-area').locator('..');
    await areaSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    await expect(areaSection).toHaveScreenshot('area-chart-initial.png');
    
    // Test tooltip
    const chartCanvas = heatmapSection.locator('canvas').first();
    await chartCanvas.hover({ position: { x: 150, y: 150 } });
    await page.waitForTimeout(500);
    await expect(areaSection).toHaveScreenshot('area-chart-hover.png');
  });

  test('Streaming Chart - Visual Regression', async ({ page }) => {
    const streamingSection = page.locator('#chart-streaming').locator('..');
    await streamingSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // Allow animation
    
    await expect(streamingSection).toHaveScreenshot('streaming-chart-initial.png');
  });

  test('Scatter Surface - Visual Regression', async ({ page }) => {
    const scatterSection = page.locator('#chart-scatter-surface').locator('..');
    await scatterSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    await expect(scatterSection).toHaveScreenshot('scatter-surface-initial.png');
    
    // Test controls interaction
    const showPoints = page.locator('#show-points');
    if (await showPoints.count() > 0) {
      await showPoints.click();
      await page.waitForTimeout(500);
      await expect(scatterSection).toHaveScreenshot('scatter-surface-no-points.png');
    }
  });

  test('Full Page - Visual Regression', async ({ page }) => {
    await expect(page).toHaveScreenshot('full-page.png', { 
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Responsive Design - Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('mobile-view.png', { fullPage: true });
  });

  test('Responsive Design - Tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('tablet-view.png', { fullPage: true });
  });

  test('Dark Mode - Visual Regression', async ({ page }) => {
    // Toggle dark mode if available
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
    if (await darkModeToggle.count() > 0) {
      await darkModeToggle.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot('dark-mode.png', { fullPage: true });
    }
  });
});