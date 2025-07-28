import { chromium } from 'playwright';

async function test3DChart() {
    console.log('Testing 3D chart specifically...');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        if (msg.text().includes('3D') || msg.text().includes('error')) {
            console.log(`Browser: ${msg.text()}`);
        }
    });
    
    page.on('pageerror', error => {
        console.error('Page error:', error.message);
    });
    
    try {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        
        // Check 3D chart specifically
        const chart3D = await page.$('#chart-3d');
        if (chart3D) {
            const box = await chart3D.boundingBox();
            console.log(`3D Chart dimensions: ${box.width}x${box.height}`);
            
            const canvases = await chart3D.$$('canvas');
            console.log(`Canvas elements in 3D chart: ${canvases.length}`);
            
            // Check for WebGL context
            const hasWebGL = await page.evaluate(() => {
                const canvas = document.querySelector('#chart-3d canvas');
                if (canvas) {
                    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
                    return !!gl;
                }
                return false;
            });
            console.log(`WebGL available: ${hasWebGL}`);
            
            // Take screenshot
            await chart3D.screenshot({ path: '3d-chart-test.png' });
            console.log('3D chart screenshot saved');
            
            // Check for any error messages
            const errorText = await chart3D.evaluate(el => {
                return el.textContent || '';
            });
            
            if (errorText.includes('error') || errorText.includes('Error')) {
                console.error('Error found in 3D chart:', errorText);
            }
        }
        
    } catch (error) {
        console.error('Test error:', error);
    } finally {
        await browser.close();
    }
}

test3DChart().catch(console.error);