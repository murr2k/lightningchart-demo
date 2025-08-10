describe('Chart Utilities', () => {
  describe('Data Generation', () => {
    test('should generate valid line chart data', () => {
      const data = generateLineData(100);
      expect(data).toHaveLength(100);
      expect(data[0]).toHaveProperty('x');
      expect(data[0]).toHaveProperty('y');
      expect(typeof data[0].x).toBe('number');
      expect(typeof data[0].y).toBe('number');
    });

    test('should generate valid bar chart data', () => {
      const data = generateBarData(12);
      expect(data).toHaveLength(12);
      expect(data[0]).toHaveProperty('category');
      expect(data[0]).toHaveProperty('value');
      expect(typeof data[0].value).toBe('number');
      expect(data[0].value).toBeGreaterThanOrEqual(0);
    });

    test('should generate valid pie chart data', () => {
      const data = generatePieData(5);
      expect(data).toHaveLength(5);
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('value');
      const total = data.reduce((sum, item) => sum + item.value, 0);
      expect(total).toBeCloseTo(100, 1);
    });

    test('should generate valid 3D surface data', () => {
      const gridSize = 50;
      const data = generate3DData(gridSize);
      expect(data).toHaveLength(gridSize);
      expect(data[0]).toHaveLength(gridSize);
      data.forEach(row => {
        row.forEach(value => {
          expect(typeof value).toBe('number');
          expect(value).toBeGreaterThanOrEqual(-1);
          expect(value).toBeLessThanOrEqual(1);
        });
      });
    });

    test('should generate valid heatmap data', () => {
      const rows = 10;
      const cols = 15;
      const data = generateHeatmapData(rows, cols);
      expect(data).toHaveLength(rows);
      expect(data[0]).toHaveLength(cols);
      data.forEach(row => {
        row.forEach(value => {
          expect(typeof value).toBe('number');
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(100);
        });
      });
    });
  });

  describe('Data Validation', () => {
    test('should validate numeric data', () => {
      expect(isValidNumber(42)).toBe(true);
      expect(isValidNumber(3.14)).toBe(true);
      expect(isValidNumber(-10)).toBe(true);
      expect(isValidNumber(NaN)).toBe(false);
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber('42')).toBe(false);
    });

    test('should validate data ranges', () => {
      const data = [
        { x: 0, y: 10 },
        { x: 1, y: 20 },
        { x: 2, y: 15 }
      ];
      const range = getDataRange(data);
      expect(range.xMin).toBe(0);
      expect(range.xMax).toBe(2);
      expect(range.yMin).toBe(10);
      expect(range.yMax).toBe(20);
    });

    test('should handle empty data gracefully', () => {
      expect(() => generateLineData(0)).not.toThrow();
      expect(() => getDataRange([])).not.toThrow();
    });
  });

  describe('Performance Metrics', () => {
    test('should calculate FPS correctly', () => {
      const fps = calculateFPS([16, 16, 17, 16, 17]);
      expect(fps).toBeCloseTo(60, 1);
    });

    test('should detect performance issues', () => {
      const slowFrames = [50, 55, 60, 45, 52];
      const fps = calculateFPS(slowFrames);
      expect(fps).toBeLessThan(30);
    });
  });
});

// Mock implementations for testing
function generateLineData(points) {
  return Array.from({ length: points }, (_, i) => ({
    x: i,
    y: Math.sin(i * 0.1) * 50 + Math.random() * 10
  }));
}

function generateBarData(count) {
  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return categories.slice(0, count).map(cat => ({
    category: cat,
    value: Math.random() * 100
  }));
}

function generatePieData(slices) {
  const names = ['Slice A', 'Slice B', 'Slice C', 'Slice D', 'Slice E'];
  const values = Array.from({ length: slices }, () => Math.random());
  const total = values.reduce((sum, val) => sum + val, 0);
  return names.slice(0, slices).map((name, i) => ({
    name,
    value: (values[i] / total) * 100
  }));
}

function generate3DData(size) {
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) =>
      Math.sin(i * 0.1) * Math.cos(j * 0.1)
    )
  );
}

function generateHeatmapData(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() * 100)
  );
}

function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

function getDataRange(data) {
  if (data.length === 0) {
    return { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
  }
  return {
    xMin: Math.min(...data.map(d => d.x)),
    xMax: Math.max(...data.map(d => d.x)),
    yMin: Math.min(...data.map(d => d.y)),
    yMax: Math.max(...data.map(d => d.y))
  };
}

function calculateFPS(frameTimes) {
  const avgFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
  return 1000 / avgFrameTime;
}