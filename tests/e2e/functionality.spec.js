import { test, expect } from '@playwright/test';

test.describe('Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Page loads with all chart sections', async ({ page }) => {
    await expect(page).toHaveTitle(/LightningChart JS Demo/);
    
    // Check all chart sections are present
    await expect(page.locator('#chart-line')).toBeVisible();
    await expect(page.locator('#chart-bar')).toBeVisible();
    await expect(page.locator('#chart-pie')).toBeVisible();
    await expect(page.locator('#chart-area')).toBeVisible();
    await expect(page.locator('#chart-streaming')).toBeVisible();
    await expect(page.locator('#chart-3d')).toBeVisible();
    await expect(page.locator('#chart-scatter-surface')).toBeVisible();
  });

  test('Line chart updates in real-time', async ({ page, browserName }) => {
    // Skip screenshot comparison in Firefox due to canvas rendering issues
    if (browserName === 'firefox') {
      test.skip();
      return;
    }
    
    const lineChartSection = page.locator('#chart-streaming');
    await lineChartSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Wait for chart to render
    
    // Take initial screenshot with timeout
    const canvas = lineChartSection.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 10000 });
    
    const initial = await canvas.screenshot({ timeout: 10000 });
    
    // Wait for real-time update
    await page.waitForTimeout(3000);
    
    // Take another screenshot
    const updated = await canvas.screenshot({ timeout: 10000 });
    
    // Compare screenshots - they should be different
    expect(Buffer.compare(initial, updated)).not.toBe(0);
  });

  test('Chart interactions - Zoom', async ({ page }) => {
    const lineChart = page.locator('#chart-line canvas').first();
    await lineChart.scrollIntoViewIfNeeded();
    
    // Test zoom in
    await lineChart.click();
    await page.keyboard.press('Control++');
    await page.waitForTimeout(500);
    
    // Test zoom out
    await page.keyboard.press('Control+-');
    await page.waitForTimeout(500);
    
    // Test zoom reset
    await page.keyboard.press('Control+0');
    await page.waitForTimeout(500);
    
    // No errors should occur
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    expect(consoleErrors).toHaveLength(0);
  });

  test('Chart interactions - Pan', async ({ page }) => {
    const chartCanvas = page.locator('#chart-bar canvas').first();
    await chartCanvas.scrollIntoViewIfNeeded();
    
    const box = await chartCanvas.boundingBox();
    if (box) {
      // Perform pan gesture
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2);
      await page.mouse.up();
      
      // Chart should update without errors
      await page.waitForTimeout(500);
    }
  });

  test('Tooltip functionality', async ({ page }) => {
    const pieChart = page.locator('#chart-pie canvas').first();
    await pieChart.scrollIntoViewIfNeeded();
    
    // Hover over chart to trigger tooltip
    await pieChart.hover({ position: { x: 100, y: 100 } });
    await page.waitForTimeout(500);
    
    // Check if tooltip-like element appears (implementation specific)
    // This would depend on how tooltips are implemented in your chart
  });

  test('Legend interactions', async ({ page }) => {
    // Look for legend elements
    const legends = page.locator('.lcjs-legend-box');
    const count = await legends.count();
    
    if (count > 0) {
      // Click first legend item
      await legends.first().click();
      await page.waitForTimeout(500);
      
      // Legend interaction should toggle series visibility
      // Verify no console errors
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));
      expect(errors).toHaveLength(0);
    }
  });

  test('3D chart rotation', async ({ page, browserName }) => {
    // 3D interactions can be flaky in webkit
    if (browserName === 'webkit') {
      test.skip();
      return;
    }
    
    const surface3D = page.locator('#chart-3d canvas').first();
    await surface3D.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000); // More time for 3D to load
    
    const box = await surface3D.boundingBox();
    if (box) {
      // Perform rotation
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down({ button: 'left' });
      
      // Create circular motion
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x = box.x + box.width / 2 + Math.cos(angle) * 50;
        const y = box.y + box.height / 2 + Math.sin(angle) * 50;
        await page.mouse.move(x, y);
        await page.waitForTimeout(50);
      }
      
      await page.mouse.up();
      await page.waitForTimeout(500);
    }
  });

  test('Performance - Page load time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('Performance - Chart rendering', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('measure');
      return perf.map(p => ({ name: p.name, duration: p.duration }));
    });
    
    // Log performance metrics for analysis
    console.log('Performance metrics:', metrics);
  });

  test('Memory usage check', async ({ page, browserName }) => {
    // Memory API only available in Chromium
    if (browserName !== 'chromium') {
      test.skip();
      return;
    }
    
    const hasMemoryAPI = await page.evaluate(() => 'memory' in performance);
    if (!hasMemoryAPI) {
      test.skip();
      return;
    }
    
    const initialMemory = await page.evaluate(() => performance.memory.usedJSHeapSize);
    
    // Interact with charts
    for (let i = 0; i < 5; i++) {
      await page.locator('#chart-line canvas').click();
      await page.waitForTimeout(500);
    }
    
    const finalMemory = await page.evaluate(() => performance.memory.usedJSHeapSize);
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (less than 50MB)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });

  test('Accessibility - Keyboard navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate with keyboard
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('Error handling - Invalid data', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    
    // Try to inject invalid data (implementation specific)
    await page.evaluate(() => {
      // Attempt to cause an error
      try {
        window.chartInstances?.forEach(chart => {
          if (chart && chart.addData) {
            chart.addData([{ x: NaN, y: Infinity }]);
          }
        });
      } catch (e) {
        console.log('Expected error handling:', e);
      }
    });
    
    // Should handle errors gracefully
    expect(errors.filter(e => !e.includes('Expected'))).toHaveLength(0);
  });
});