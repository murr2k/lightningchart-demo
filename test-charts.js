import { chromium } from 'playwright';

async function testCharts() {
    console.log('Starting Playwright test...');
    
    const browser = await chromium.launch({ 
        headless: true 
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        console.log(`Browser console [${msg.type()}]:`, msg.text());
    });
    
    // Log any page errors
    page.on('pageerror', error => {
        console.error('Page error:', error.message);
    });
    
    try {
        console.log('Navigating to http://localhost:5173...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
        
        // Wait for page to load
        await page.waitForTimeout(3000);
        
        // Take a full page screenshot
        await page.screenshot({ 
            path: 'full-page.png', 
            fullPage: true 
        });
        console.log('Full page screenshot saved as full-page.png');
        
        // Check each chart container
        const charts = [
            { id: 'chart-line', name: 'Line Chart' },
            { id: 'chart-bar', name: 'Bar Chart' },
            { id: 'chart-pie', name: 'Pie Chart' },
            { id: 'chart-area', name: 'Area Chart' },
            { id: 'chart-streaming', name: 'Streaming Chart' },
            { id: 'chart-3d', name: '3D Chart' }
        ];
        
        for (const chart of charts) {
            console.log(`\nChecking ${chart.name}...`);
            
            // Check if container exists
            const container = await page.$(`#${chart.id}`);
            if (!container) {
                console.error(`❌ Container #${chart.id} not found!`);
                continue;
            }
            
            // Get container dimensions
            const box = await container.boundingBox();
            console.log(`Container dimensions: ${box.width}x${box.height}`);
            
            // Check for canvas elements inside
            const canvases = await container.$$('canvas');
            console.log(`Found ${canvases.length} canvas elements`);
            
            // Check for SVG elements
            const svgs = await container.$$('svg');
            console.log(`Found ${svgs.length} SVG elements`);
            
            // Check if container has any visible content
            const hasContent = await container.evaluate(el => {
                const children = el.querySelectorAll('*');
                return children.length > 0;
            });
            
            if (hasContent) {
                console.log(`✅ ${chart.name} has content`);
                
                // Take individual screenshot
                await container.screenshot({ 
                    path: `${chart.id}.png` 
                });
                console.log(`Screenshot saved as ${chart.id}.png`);
            } else {
                console.log(`❌ ${chart.name} appears to be empty`);
            }
            
            // Get any error messages in the container
            const errorText = await container.evaluate(el => {
                const text = el.textContent || '';
                return text.includes('error') || text.includes('Error') ? text : null;
            });
            
            if (errorText) {
                console.error(`Error text found: ${errorText}`);
            }
        }
        
        // Test button functionality
        console.log('\nTesting buttons...');
        
        // Click "Start Real-time Data" button
        const startButton = await page.$('#startStreaming');
        if (startButton) {
            await startButton.click();
            console.log('Clicked Start Streaming button');
            await page.waitForTimeout(2000);
            
            // Take screenshot after streaming starts
            await page.screenshot({ 
                path: 'after-streaming.png', 
                fullPage: true 
            });
            console.log('Screenshot after streaming saved');
        }
        
        // Get status message
        const status = await page.$eval('#status', el => el.textContent);
        console.log(`Status message: "${status}"`);
        
        // Extract any JavaScript errors from console
        const jsErrors = await page.evaluate(() => {
            return window.__errors || [];
        });
        
        if (jsErrors.length > 0) {
            console.error('JavaScript errors found:', jsErrors);
        }
        
    } catch (error) {
        console.error('Test error:', error);
        
        // Take error screenshot
        await page.screenshot({ 
            path: 'error-state.png', 
            fullPage: true 
        });
    } finally {
        await browser.close();
        console.log('\nTest completed!');
    }
}

// Add error tracking to the page
const addErrorTracking = `
    window.__errors = [];
    window.addEventListener('error', (e) => {
        window.__errors.push({
            message: e.message,
            source: e.filename,
            line: e.lineno,
            col: e.colno,
            error: e.error ? e.error.toString() : null
        });
    });
`;

testCharts().catch(console.error);