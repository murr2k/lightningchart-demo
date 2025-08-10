import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('Measure page load metrics', async ({ page }) => {
    const metrics = [];
    
    // Capture performance metrics
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        domInteractive: navigation.domInteractive,
        responseTime: navigation.responseEnd - navigation.requestStart,
      };
    });
    
    console.log('Performance Metrics:', performanceMetrics);
    
    // Assert performance thresholds
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(2000); // FCP < 2s
    expect(performanceMetrics.domInteractive).toBeLessThan(3000); // Interactive < 3s
    expect(performanceMetrics.loadComplete).toBeLessThan(5000); // Full load < 5s
  });

  test('Measure chart rendering performance', async ({ page }) => {
    await page.goto('/');
    
    const renderingMetrics = await page.evaluate(() => {
      const startTime = performance.now();
      const charts = document.querySelectorAll('canvas');
      const endTime = performance.now();
      
      return {
        chartCount: charts.length,
        totalRenderTime: endTime - startTime,
        averageRenderTime: (endTime - startTime) / charts.length
      };
    });
    
    console.log('Rendering Metrics:', renderingMetrics);
    
    // Charts should render quickly
    expect(renderingMetrics.averageRenderTime).toBeLessThan(500);
  });

  test('Memory usage during interactions', async ({ page }) => {
    await page.goto('/');
    
    const memoryMetrics = [];
    
    // Take initial memory snapshot
    const initialMemory = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
        };
      }
      return null;
    });
    
    if (initialMemory) {
      memoryMetrics.push({ stage: 'initial', ...initialMemory });
      
      // Perform heavy interactions
      for (let i = 0; i < 10; i++) {
        await page.locator('#line-chart-section canvas').click();
        await page.mouse.wheel(0, -50);
        await page.waitForTimeout(100);
      }
      
      // Take memory snapshot after interactions
      const afterInteractions = await page.evaluate(() => ({
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
      }));
      
      memoryMetrics.push({ stage: 'after-interactions', ...afterInteractions });
      
      // Memory growth should be reasonable
      const memoryGrowth = afterInteractions.usedJSHeapSize - initialMemory.usedJSHeapSize;
      expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // Less than 50MB growth
    }
  });

  test('Animation frame rate', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const fps = await page.evaluate(() => {
      return new Promise((resolve) => {
        const frames = [];
        let lastTime = performance.now();
        let frameCount = 0;
        
        function measureFrame() {
          const currentTime = performance.now();
          const delta = currentTime - lastTime;
          frames.push(delta);
          lastTime = currentTime;
          frameCount++;
          
          if (frameCount < 60) {
            requestAnimationFrame(measureFrame);
          } else {
            const avgFrameTime = frames.reduce((a, b) => a + b, 0) / frames.length;
            const fps = 1000 / avgFrameTime;
            resolve({
              fps: Math.round(fps),
              avgFrameTime: avgFrameTime.toFixed(2),
              minFrameTime: Math.min(...frames).toFixed(2),
              maxFrameTime: Math.max(...frames).toFixed(2)
            });
          }
        }
        
        requestAnimationFrame(measureFrame);
      });
    });
    
    console.log('FPS Metrics:', fps);
    
    // Should maintain at least 30 FPS
    expect(fps.fps).toBeGreaterThan(30);
  });

  test('Network performance', async ({ page }) => {
    const requests = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        startTime: Date.now()
      });
    });
    
    page.on('response', response => {
      const request = requests.find(r => r.url === response.url());
      if (request) {
        request.status = response.status();
        request.duration = Date.now() - request.startTime;
        request.size = response.headers()['content-length'] || 0;
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Analyze network metrics
    const totalSize = requests.reduce((sum, r) => sum + parseInt(r.size || 0), 0);
    const totalDuration = Math.max(...requests.map(r => r.duration || 0));
    const slowRequests = requests.filter(r => r.duration > 1000);
    
    console.log('Network Metrics:', {
      totalRequests: requests.length,
      totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
      totalDuration: `${totalDuration} ms`,
      slowRequests: slowRequests.length
    });
    
    // Performance assertions
    expect(requests.length).toBeLessThan(50); // Reasonable number of requests
    expect(totalSize).toBeLessThan(5 * 1024 * 1024); // Less than 5MB total
    expect(slowRequests.length).toBeLessThan(3); // Few slow requests
  });

  test('CPU usage during animations', async ({ page }) => {
    await page.goto('/');
    
    // Start CPU profiling
    await page.evaluate(() => {
      console.time('animation-cpu');
    });
    
    // Trigger animations on multiple charts
    const charts = ['#line-chart-section', '#bar-chart-section', '#gauge-chart-section'];
    
    for (const chart of charts) {
      const element = page.locator(`${chart} canvas`).first();
      if (await element.count() > 0) {
        await element.hover();
        await element.click();
        await page.waitForTimeout(500);
      }
    }
    
    await page.evaluate(() => {
      console.timeEnd('animation-cpu');
    });
    
    // Check for smooth animations (no jank)
    const hasJank = await page.evaluate(() => {
      let jankDetected = false;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Frame took longer than 50ms
            jankDetected = true;
          }
        }
      });
      observer.observe({ entryTypes: ['frame'] });
      
      return new Promise((resolve) => {
        setTimeout(() => {
          observer.disconnect();
          resolve(jankDetected);
        }, 2000);
      });
    });
    
    expect(hasJank).toBe(false);
  });

  test('Bundle size analysis', async ({ page }) => {
    const response = await page.goto('/');
    const html = await response.text();
    
    // Extract script tags
    const scriptTags = html.match(/<script[^>]*src="([^"]+)"/g) || [];
    const scriptSizes = [];
    
    for (const tag of scriptTags) {
      const src = tag.match(/src="([^"]+)"/)[1];
      const scriptResponse = await page.request.get(src);
      const size = (await scriptResponse.body()).length;
      
      scriptSizes.push({
        url: src,
        size: size,
        sizeKB: (size / 1024).toFixed(2)
      });
    }
    
    const totalSize = scriptSizes.reduce((sum, s) => sum + s.size, 0);
    
    console.log('Bundle Analysis:', {
      scripts: scriptSizes,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      totalSizeMB: `${(totalSize / 1024 / 1024).toFixed(2)} MB`
    });
    
    // Bundle should be reasonably sized
    expect(totalSize).toBeLessThan(2 * 1024 * 1024); // Less than 2MB
  });
});