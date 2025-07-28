// Import LightningChart
import { lightningChart } from '@lightningchart/lcjs'

console.log('Script starting...')

// Initialize LightningChart with your license
const lc = lightningChart({
    license: "0002-n9xRML+Glr3QwdvnJVsvK6cQVxjGKwDdUQmrn5+yxNjS6P3j9y5OhH9trO5ekaGLuGtbex7ogsCXLl9yKKX4HGcV-MEYCIQDv+5zIdiAu7CLpFCIwjTAfgzsKZUW8vcWsAYGlqWsNvgIhAPUML6w6txdfzdtl94qP69Wb9Lj1ijkB8+XuNjs0qzrn",
    licenseInformation: {
        appTitle: "LightningChart JS Trial",
        company: "LightningChart Ltd."
    },
})

console.log('LightningChart initialized:', lc)
console.log('Available chart types:', Object.keys(lc))

// Update status message
const updateStatus = (message) => {
    const statusEl = document.getElementById('status')
    if (statusEl) {
        statusEl.textContent = message
        console.log('Status:', message)
    }
}

// Initialize charts after window loads
window.addEventListener('load', () => {
    console.log('Window loaded, initializing charts...')
    
    try {
        // 1. Line Chart - Sin Wave with Noise
        console.log('Creating line chart...')
        const lineChart = lc.ChartXY({
            container: document.getElementById('chart-line')
        })
        lineChart.setTitle('Sine Wave with Random Noise')

        // Generate sine wave with noise
        const sineData = []
        for (let x = 0; x <= 10; x += 0.1) {
            sineData.push({
                x: x,
                y: Math.sin(x * 2) + (Math.random() - 0.5) * 0.3
            })
        }
        
        const lineSeries = lineChart.addLineSeries()
        lineSeries.setName('Sin + Noise')
        lineSeries.add(sineData)
        console.log('Line chart created successfully')

        // 2. Bar Chart - Sales Data  
        console.log('Creating bar chart...')
        const barChart = lc.BarChart({
            container: document.getElementById('chart-bar')
        })
        barChart.setTitle('Monthly Sales Data')

        const barData = [
            { category: 'Jan', value: 45 },
            { category: 'Feb', value: 52 },
            { category: 'Mar', value: 48 },
            { category: 'Apr', value: 65 },
            { category: 'May', value: 72 },
            { category: 'Jun', value: 68 }
        ]

        barChart.setData(barData)
        console.log('Bar chart created successfully')

        // 3. Pie Chart - Market Share
        console.log('Creating pie chart...')
        // Check if Pie chart is available
        if (lc.Pie) {
            const pieChart = lc.Pie({
                container: document.getElementById('chart-pie')
            })
            pieChart.setTitle('Market Share Distribution')

            // Add slices
            pieChart.addSlice('Product A', 35)
            pieChart.addSlice('Product B', 25)
            pieChart.addSlice('Product C', 20)
            pieChart.addSlice('Product D', 15)
            pieChart.addSlice('Others', 5)
            
            console.log('Pie chart created successfully')
        } else {
            console.log('Pie chart not available, using alternative visualization')
            // Use a different chart type as fallback
            const pieAltChart = lc.ChartXY({
                container: document.getElementById('chart-pie')
            })
            pieAltChart.setTitle('Market Share Distribution (Bar)')
            
            const pieSeries = pieAltChart.addBarSeries({
                type: 'horizontal-bars'
            })
            
            pieSeries.setData([
                { category: 'Product A', value: 35 },
                { category: 'Product B', value: 25 },
                { category: 'Product C', value: 20 },
                { category: 'Product D', value: 15 },
                { category: 'Others', value: 5 }
            ])
        }

        // 4. Area Chart - Stacked Data
        console.log('Creating area chart...')
        const areaChart = lc.ChartXY({
            container: document.getElementById('chart-area')
        })
        areaChart.setTitle('Stacked Area Chart')

        const areaSeries1 = areaChart.addAreaSeries()
        areaSeries1.setName('Series 1')

        const areaSeries2 = areaChart.addAreaSeries()
        areaSeries2.setName('Series 2')

        // Generate stacked area data
        const areaData1 = []
        const areaData2 = []
        for (let x = 0; x <= 12; x++) {
            const y1 = 30 + Math.random() * 20
            const y2 = y1 + 20 + Math.random() * 15
            areaData1.push({ x, y: y1 })
            areaData2.push({ x, y: y2 })
        }

        areaSeries1.add(areaData1)
        areaSeries2.add(areaData2)
        console.log('Area chart created successfully')

        // 5. Real-time Streaming Chart
        console.log('Creating streaming chart...')
        let streamingInterval = null
        let streamingX = 0
        
        const streamingChart = lc.ChartXY({
            container: document.getElementById('chart-streaming')
        })
        streamingChart.setTitle('Real-time Data Stream (Click "Start Real-time Data" to begin)')

        // Configure axes for better visibility
        streamingChart.getDefaultAxisX()
            .setTitle('Time')
        streamingChart.getDefaultAxisY()
            .setTitle('Value')
            .setInterval({ start: -100, end: 100 })

        const streamingSeries = streamingChart.addLineSeries({
            dataPattern: {
                pattern: 'ProgressiveX'
            }
        })
        streamingSeries.setName('Live Data')
        streamingSeries.setStrokeStyle((stroke) => stroke.setThickness(2))

        // Add some initial data to show the chart is ready
        const initialData = []
        for (let i = 0; i < 50; i++) {
            initialData.push({
                x: i,
                y: Math.sin(i * 0.1) * 30 + (Math.random() - 0.5) * 10
            })
        }
        streamingSeries.add(initialData)
        streamingX = 50

        console.log('Streaming chart created successfully with initial data')

        // 6. 3D Surface Chart or Alternative
        console.log('Creating 3D chart...')
        
        let animationFrame = null
        let animationTime = 0
        let frequency = 1.0
        
        try {
            // Check if WebGL is available
            const canvas = document.createElement('canvas')
            const gl = canvas.getContext('webgl') || canvas.getContext('webgl2')
            
            if (!gl) {
                throw new Error('WebGL not available')
            }
            
            const chart3D = lc.Chart3D({
                container: document.getElementById('chart-3d')
            })
            chart3D.setTitle('3D Surface Plot - Sine Wave Surface')

            // Simple 3D point series as a more compatible alternative
            const pointSeries3D = chart3D.addPointSeries()
            pointSeries3D.setName('3D Surface Points')
            
            // Data generator function for animated wave
            const generateAnimatedData = (time) => {
                const points3D = []
                const size = 15
                const phase = time * 0.02
                
                for (let x = 0; x < size; x++) {
                    for (let z = 0; z < size; z++) {
                        const xVal = (x - size/2) * 0.5
                        const zVal = (z - size/2) * 0.5
                        const r = Math.sqrt(xVal * xVal + zVal * zVal)
                        
                        // Animated wave equation
                        const yVal = Math.sin(r * frequency - phase) * Math.exp(-r * 0.3) * 2
                        
                        points3D.push({
                            x: xVal,
                            y: yVal,
                            z: zVal
                        })
                    }
                }
                return points3D
            }
            
            // Initial data
            pointSeries3D.add(generateAnimatedData(0))
            
            // Animation function
            const animate3D = () => {
                pointSeries3D.clear()
                pointSeries3D.add(generateAnimatedData(animationTime))
                animationTime++
            }
            
            // Configure axes
            chart3D.getDefaultAxisX().setTitle('X')
            chart3D.getDefaultAxisY().setTitle('Y')
            chart3D.getDefaultAxisZ().setTitle('Z')
            
            // Set camera
            chart3D.setCameraLocation({ x: 2, y: 2, z: 2 })
            
            // Animation controls
            const play3dBtn = document.getElementById('play3d')
            const pause3dBtn = document.getElementById('pause3d')
            
            if (play3dBtn) {
                play3dBtn.addEventListener('click', () => {
                    if (!animationFrame) {
                        const loop = () => {
                            animate3D()
                            animationFrame = requestAnimationFrame(loop)
                        }
                        loop()
                        updateStatus('3D animation started')
                    }
                })
            }
            
            if (pause3dBtn) {
                pause3dBtn.addEventListener('click', () => {
                    if (animationFrame) {
                        cancelAnimationFrame(animationFrame)
                        animationFrame = null
                        updateStatus('3D animation paused')
                    }
                })
            }
            
            // Frequency slider control
            const frequencySlider = document.getElementById('frequency-slider')
            const frequencyValue = document.getElementById('frequency-value')
            
            if (frequencySlider) {
                frequencySlider.addEventListener('input', (e) => {
                    frequency = parseFloat(e.target.value)
                    frequencyValue.textContent = frequency.toFixed(1)
                })
            }
            
            console.log('3D chart created successfully')
            
        } catch (error) {
            console.log('3D chart failed, using 2D heatmap instead:', error.message)
            
            // Fallback to 2D heatmap representation
            const heatmapChart = lc.ChartXY({
                container: document.getElementById('chart-3d')
            })
            heatmapChart.setTitle('Surface Plot (2D Heatmap View)')
            
            // Create heatmap series
            const heatmapSeries = heatmapChart.addHeatmapGridSeries({
                columns: 25,
                rows: 25,
                start: { x: -5, y: -5 },
                end: { x: 5, y: 5 },
                dataOrder: 'rows'
            })
            
            // Generate heatmap data
            const heatmapData = []
            for (let row = 0; row < 25; row++) {
                const rowData = []
                for (let col = 0; col < 25; col++) {
                    const x = -5 + (col / 24) * 10
                    const y = -5 + (row / 24) * 10
                    const r = Math.sqrt(x * x + y * y)
                    const value = r === 0 ? 1 : Math.sin(r) / r
                    rowData.push(value)
                }
                heatmapData.push(rowData)
            }
            
            heatmapSeries.invalidateIntensityValues(heatmapData)
            
            // Configure axes
            heatmapChart.getDefaultAxisX().setTitle('X')
            heatmapChart.getDefaultAxisY().setTitle('Z')
            
            console.log('2D heatmap created as 3D fallback')
        }

        // Control buttons functionality
        console.log('Setting up button event listeners...')
        
        const startBtn = document.getElementById('startStreaming')
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('Start streaming clicked')
                if (!streamingInterval) {
                    streamingChart.setTitle('Real-time Data Stream (Streaming Active)')
                    streamingInterval = setInterval(() => {
                        const value = Math.sin(streamingX * 0.1) * 50 + (Math.random() - 0.5) * 30
                        streamingSeries.add({ x: streamingX, y: value })
                        streamingX += 1
                        
                        // Auto-scroll to show latest data
                        const axisX = streamingChart.getDefaultAxisX()
                        axisX.setInterval({ start: streamingX - 100, end: streamingX + 10 })
                    }, 100)
                    updateStatus('Streaming started - Watch the real-time chart update!')
                }
            })
        }

        const stopBtn = document.getElementById('stopStreaming')
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                console.log('Stop streaming clicked')
                if (streamingInterval) {
                    clearInterval(streamingInterval)
                    streamingInterval = null
                    streamingChart.setTitle('Real-time Data Stream (Paused - Click Start to resume)')
                    updateStatus('Streaming stopped')
                }
            })
        }

        const addBtn = document.getElementById('addData')
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                console.log('Add data clicked')
                // Add random data point to line chart
                const lastX = sineData[sineData.length - 1].x
                const newPoint = {
                    x: lastX + 0.1,
                    y: Math.sin((lastX + 0.1) * 2) + (Math.random() - 0.5) * 0.3
                }
                sineData.push(newPoint)
                lineSeries.add([newPoint])
                
                // Update bar chart with random value
                const randomMonth = barData[Math.floor(Math.random() * barData.length)]
                randomMonth.value = Math.floor(Math.random() * 50) + 30
                barChart.setData([...barData])
                
                updateStatus('Random data added')
            })
        }

        const clearBtn = document.getElementById('clearData')
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                console.log('Clear data clicked')
                // Clear line series
                lineSeries.clear()
                sineData.length = 0
                
                // Clear streaming series
                streamingSeries.clear()
                streamingX = 0
                
                // Reset bar chart
                barData.forEach(item => item.value = 0)
                barChart.setData([...barData])
                
                updateStatus('Data cleared')
            })
        }

        // 7. 3D Scatter Surface Chart
        console.log('Creating 3D scatter surface chart...')
        
        try {
            const scatterSurfaceChart = lc.Chart3D({
                container: document.getElementById('chart-scatter-surface')
            })
            scatterSurfaceChart.setTitle('3D Scatter Surface - Interactive Data Visualization')
            
            // Variables for the chart
            let pointSeries = null
            let surfaceSeries = null
            let currentResolution = 25
            let currentPattern = 'dataset'
            let scatterAnimationFrame = null
            let scatterAnimationTime = 0
            
            // Data generation functions for different patterns
            const generateScatterSurfaceData = (pattern, resolution, time = 0) => {
                const points = []
                const surfaceDataY = []
                const intensityData = []
                const phase = time * 0.1  // Much faster animation for testing
                
                // Generate data in column order
                for (let col = 0; col < resolution; col++) {
                    const colDataY = []
                    const colIntensity = []
                    
                    for (let row = 0; row < resolution; row++) {
                        const x = -5 + (col / (resolution - 1)) * 10
                        const z = -5 + (row / (resolution - 1)) * 10
                        let y, intensity
                        
                        switch (pattern) {
                            case 'dataset':
                                // Complex dataset similar to precalc-surface.json
                                // Create multiple overlapping features for realistic data visualization
                                
                                // Primary wave patterns with different frequencies
                                const wave1 = Math.sin(x * 0.7 + phase * 0.5) * Math.cos(z * 0.5 - phase * 0.3)
                                const wave2 = Math.sin(x * 1.3 - z * 0.8 + phase * 0.7) * 0.3
                                const wave3 = Math.cos(x * 0.4 + z * 0.6 - phase * 0.4) * 0.4
                                
                                // Localized peaks (like data clusters)
                                const peak1 = Math.exp(-((x-2-Math.sin(phase*0.3))*(x-2-Math.sin(phase*0.3)) + 
                                            (z-1-Math.cos(phase*0.3))*(z-1-Math.cos(phase*0.3))) / 3) * 0.8
                                const peak2 = Math.exp(-((x+1)*(x+1) + (z+2)*(z+2)) / 4) * 0.6
                                const peak3 = Math.exp(-((x-3.5)*(x-3.5) + (z+3.5)*(z+3.5)) / 2) * 0.5
                                
                                // Ridge features (like correlations in data)
                                const ridge1 = Math.exp(-Math.pow(x + z * 0.5 - Math.sin(phase*0.2)*2, 2) / 5) * 0.7
                                const ridge2 = Math.exp(-Math.pow(x * 0.3 - z + 1, 2) / 4) * 0.5
                                
                                // Background gradient (like trending data)
                                const gradient = (x + z) * 0.008 + Math.sin(phase * 0.1) * 0.005
                                
                                // Combine all features
                                const combined = wave1 * 0.2 + wave2 + wave3 * 0.15 + 
                                               peak1 + peak2 + peak3 + 
                                               ridge1 + ridge2 + gradient
                                
                                // Scale to match dataset range (0.005 to 0.045) with center at ~0.025
                                y = 0.025 + combined * 0.008
                                
                                // Add fine-scale noise for realism
                                y += Math.sin(x * 8 + z * 7) * 0.001
                                y += Math.cos(x * 12 - z * 11 + phase * 2) * 0.0005
                                
                                // Ensure within realistic range
                                y = Math.max(0.005, Math.min(0.045, y))
                                intensity = y
                                break
                            case 'wave':
                                y = Math.sin(x - phase) * Math.cos(z - phase)
                                intensity = y
                                break
                            case 'gaussian':
                                // Animated gaussian hills
                                const offset1 = Math.sin(phase) * 2
                                const offset2 = Math.cos(phase) * 2
                                y = Math.exp(-((x-offset1)*(x-offset1) + (z-offset1)*(z-offset1)) / 8) + 
                                    0.5 * Math.exp(-((x-2-offset2)*(x-2-offset2) + (z-2+offset2)*(z-2+offset2)) / 4) +
                                    0.7 * Math.exp(-((x+2+offset1)*(x+2+offset1) + (z+1-offset1)*(z+1-offset1)) / 6)
                                intensity = y
                                break
                            case 'saddle':
                                // Rotating saddle
                                const rotX = x * Math.cos(phase) - z * Math.sin(phase)
                                const rotZ = x * Math.sin(phase) + z * Math.cos(phase)
                                y = (rotX*rotX - rotZ*rotZ) / 25
                                intensity = Math.abs(y)
                                break
                            case 'ripple':
                                const r = Math.sqrt(x*x + z*z)
                                y = Math.sin(r * 2 - phase * 2) / (r + 1) * 3
                                intensity = y
                                break
                        }
                        
                        // Add small fixed noise to points (using position as seed for consistency)
                        const noisyY = y + (Math.sin(x * 10 + z * 10) * 0.02)
                        points.push({ x, y: noisyY, z })
                        colDataY.push(y)
                        colIntensity.push(intensity)
                    }
                    
                    surfaceDataY.push(colDataY)
                    intensityData.push(colIntensity)
                }
                
                return { points, surfaceDataY, intensityData, resolution }
            }
            
            // Create initial data
            let data = generateScatterSurfaceData(currentPattern, currentResolution)
            
            // Add point series
            pointSeries = scatterSurfaceChart.addPointSeries()
                .setName('Scatter Points')
                .add(data.points)
                .setPointStyle((style) => style.setSize(3))
            
            // Add surface series
            surfaceSeries = scatterSurfaceChart.addSurfaceGridSeries({
                dataOrder: 'columns',
                columns: currentResolution,
                rows: currentResolution
            })
                .setName('Surface')
                .setStart({ x: -5, z: -5 })
                .setStep({ x: 10 / (currentResolution - 1), z: 10 / (currentResolution - 1) })
                .invalidateHeightMap(data.surfaceDataY)
            
            // Configure axes
            scatterSurfaceChart.getDefaultAxisX().setTitle('X Axis')
            scatterSurfaceChart.getDefaultAxisY().setTitle('Y Axis (Height)')
            scatterSurfaceChart.getDefaultAxisZ().setTitle('Z Axis')
            
            // Set camera position
            scatterSurfaceChart.setCameraLocation({ x: 2.5, y: 2, z: 2.5 })
            
            // Update function
            const updateScatterSurface = (useTime = false) => {
                const time = useTime ? scatterAnimationTime : 0
                const newData = generateScatterSurfaceData(currentPattern, currentResolution, time)
                
                // Update point series
                pointSeries.clear()
                pointSeries.add(newData.points)
                
                // Update surface series
                surfaceSeries.invalidateHeightMap(newData.surfaceDataY)
                
                // Update the data reference
                data = newData
            }
            
            // Animation function
            const animateScatterSurface = () => {
                updateScatterSurface(true)
                scatterAnimationTime++
                if (scatterAnimationTime % 30 === 0) {
                    console.log('Scatter animation frame:', scatterAnimationTime, 'pattern:', currentPattern)
                }
            }
            
            // Control event listeners
            const showPointsCheckbox = document.getElementById('show-points')
            const showSurfaceCheckbox = document.getElementById('show-surface')
            const resolutionSlider = document.getElementById('resolution-slider')
            const resolutionValue = document.getElementById('resolution-value')
            const resolutionValue2 = document.getElementById('resolution-value2')
            const patternSelect = document.getElementById('pattern-select')
            
            if (showPointsCheckbox) {
                showPointsCheckbox.addEventListener('change', (e) => {
                    pointSeries.setVisible(e.target.checked)
                })
            }
            
            if (showSurfaceCheckbox) {
                showSurfaceCheckbox.addEventListener('change', (e) => {
                    surfaceSeries.setVisible(e.target.checked)
                })
            }
            
            if (resolutionSlider) {
                resolutionSlider.addEventListener('input', (e) => {
                    currentResolution = parseInt(e.target.value)
                    resolutionValue.textContent = currentResolution
                    resolutionValue2.textContent = currentResolution
                    
                    // Need to update surface configuration when resolution changes
                    surfaceSeries
                        .setColumns(currentResolution)
                        .setRows(currentResolution)
                        .setStep({ x: 10 / (currentResolution - 1), z: 10 / (currentResolution - 1) })
                    
                    updateScatterSurface(!!scatterAnimationFrame)  // Keep animation state
                })
            }
            
            if (patternSelect) {
                patternSelect.addEventListener('change', (e) => {
                    currentPattern = e.target.value
                    scatterAnimationTime = 0  // Reset animation time for smooth transition
                    updateScatterSurface(!!scatterAnimationFrame)  // Keep animation state
                })
            }
            
            // Animation controls
            const playScatterBtn = document.getElementById('play-scatter')
            const pauseScatterBtn = document.getElementById('pause-scatter')
            
            if (playScatterBtn) {
                playScatterBtn.addEventListener('click', () => {
                    if (!scatterAnimationFrame) {
                        console.log('Starting scatter animation...')
                        const loop = () => {
                            animateScatterSurface()
                            scatterAnimationFrame = requestAnimationFrame(loop)
                        }
                        loop()
                        updateStatus('Scatter surface animation started')
                    }
                })
            }
            
            if (pauseScatterBtn) {
                pauseScatterBtn.addEventListener('click', () => {
                    if (scatterAnimationFrame) {
                        cancelAnimationFrame(scatterAnimationFrame)
                        scatterAnimationFrame = null
                        updateStatus('Scatter surface animation paused')
                    }
                })
            }
            
            // Add legend
            const legend = scatterSurfaceChart.addLegendBox()
                .setAutoDispose({
                    type: 'max-width',
                    maxWidth: 0.2
                })
            
            legend.add(pointSeries)
            legend.add(surfaceSeries)
            
            console.log('3D scatter surface chart created successfully')
            
        } catch (error) {
            console.error('3D scatter surface chart error:', error)
        }
        
        // Initial status
        updateStatus('All charts loaded successfully! Click "Start Real-time Data" to see live streaming.')
        
        // Optional: Auto-start streaming after a short delay
        setTimeout(() => {
            const startBtn = document.getElementById('startStreaming')
            if (startBtn && !streamingInterval) {
                console.log('Auto-starting streaming...')
                startBtn.click()
            }
        }, 1000)
        
    } catch (error) {
        console.error('Error creating charts:', error)
        updateStatus('Error: ' + error.message)
    }
})