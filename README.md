# LightningChart JS Demo

A comprehensive demonstration of LightningChart JS capabilities featuring 6 different chart types with real-time data visualization and interactive controls.

![LightningChart JS](https://img.shields.io/badge/LightningChart-JS-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

## 🚀 Features

This demo showcases:

- **Line Chart** - Animated sine wave with random noise
- **Bar Chart** - Monthly sales data visualization
- **Pie Chart** - Market share distribution
- **Area Chart** - Stacked area visualization
- **Real-time Streaming Chart** - Live data updates with auto-scrolling
- **3D Surface Plot** - Interactive 3D sine wave surface (with 2D heatmap fallback)

### Interactive Controls

- **Start/Stop Real-time Data** - Control live data streaming
- **Add Random Data** - Dynamically add new data points
- **Clear All Data** - Reset all charts to empty state

## 📋 Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn
- A valid LightningChart JS license (30-day trial available)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/murr2k/lightningchart-demo.git
cd lightningchart-demo
```

2. Install dependencies:
```bash
npm install
```

3. Update the license key in `main.js`:
```javascript
const lc = lightningChart({
    license: "YOUR-LICENSE-KEY-HERE",
    licenseInformation: {
        appTitle: "LightningChart JS Trial",
        company: "LightningChart Ltd."
    },
})
```

> **Note**: Get a free 30-day trial license from [LightningChart website](https://lightningchart.com/js-charts/)

## 🚦 Running the Demo

Start the development server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173/`

## 📁 Project Structure

```
lightningchart-demo/
├── index.html          # Main HTML file with chart containers
├── main.js            # Chart implementations and logic
├── package.json       # Project dependencies
├── test-charts.js     # Playwright test for chart validation
└── README.md          # This file
```

## 📊 Chart Descriptions

### 1. Line Chart
- Displays a sine wave with added random noise
- Demonstrates basic line series functionality
- Interactive cursor on hover

### 2. Bar Chart
- Shows monthly sales data
- Vertical bars with value labels
- Dynamic data updates

### 3. Pie Chart
- Market share visualization
- 5 product categories
- Percentage-based distribution

### 4. Area Chart
- Two overlapping area series
- Stacked visualization
- Random data generation

### 5. Real-time Streaming Chart
- Auto-starts after 1 second
- Updates 10 times per second
- Auto-scrolling to show latest data
- Start/Stop controls

### 6. 3D Surface Plot
- Interactive 3D sine wave surface
- Drag to rotate view
- Falls back to 2D heatmap if WebGL unavailable
- Color-coded by height values

## 🧪 Testing

Run the automated tests using Playwright:

```bash
node test-charts.js
```

This will:
- Launch a headless browser
- Verify all charts render correctly
- Take screenshots of each chart
- Test interactive buttons

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Adding New Charts

1. Add a container div in `index.html`
2. Create the chart in `main.js` using the LightningChart API
3. Add any interactive controls as needed

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [LightningChart JS Documentation](https://lightningchart.com/js-charts/docs/)
- [API Documentation](https://lightningchart.com/js-charts/api-documentation/)
- [Interactive Examples](https://lightningchart.com/lightningchart-js-interactive-examples/)
- [Support Forum](https://lightningchart.com/support/)

## 🐛 Troubleshooting

### Charts Not Rendering
- Check browser console for license validation errors
- Ensure WebGL is enabled in your browser
- Verify all containers exist in the HTML

### License Issues
- Trial licenses expire after 30 days
- Request a new trial from the LightningChart website
- Ensure the license key is properly formatted

### Performance Issues
- LightningChart JS is optimized for large datasets
- Check browser dev tools for memory usage
- Consider using progressive loading for very large datasets

## 👏 Acknowledgments

- Built with [LightningChart JS](https://lightningchart.com/) - High-performance charting library
- Powered by [Vite](https://vitejs.dev/) - Next generation frontend tooling
- Tested with [Playwright](https://playwright.dev/) - Reliable end-to-end testing

---

Made with ❤️ by Murray Kopit