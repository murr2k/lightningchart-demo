# LightningChart Demo - Test Suite

## Overview
Comprehensive testing suite for the LightningChart demo application including unit tests, visual regression tests, performance tests, and cross-browser compatibility tests.

## Test Structure

```
tests/
├── unit/               # Unit tests for utilities and functions
│   └── chartUtils.test.js
├── e2e/               # End-to-end tests
│   ├── visual-regression.spec.js  # Visual regression tests
│   ├── functionality.spec.js      # Functional tests
│   └── performance.spec.js        # Performance tests
└── setup.js           # Jest configuration and mocks
```

## Running Tests

### Install Dependencies
```bash
npm install
npx playwright install --with-deps
```

### Unit Tests
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run visual regression tests only
npm run test:visual

# Run performance tests only
npm run test:performance

# Interactive UI mode
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

### Run All Tests
```bash
npm run test:all
```

## Visual Regression Testing

Visual regression tests capture screenshots of each chart type and compare them against baseline images:

- **Initial render states** - How charts appear on first load
- **Hover states** - Visual feedback during mouse interactions
- **Interaction states** - Chart appearance during zoom, pan, rotation
- **Responsive layouts** - Mobile, tablet, and desktop views
- **Dark mode** - Theme variations

### Updating Baselines
```bash
npx playwright test --update-snapshots
```

### Viewing Differences
Failed visual tests generate diff images in `test-results/` showing:
- Expected image
- Actual image  
- Difference overlay

## Performance Testing

Performance tests measure:
- **Page load metrics** - FCP, TTI, load complete times
- **Rendering performance** - Chart render times, FPS
- **Memory usage** - Heap size, memory leaks
- **Network performance** - Request counts, payload sizes
- **Animation smoothness** - Frame rates, jank detection

## CI/CD Pipeline

GitHub Actions workflow runs on:
- Every push to `main` and `develop`
- All pull requests
- Daily scheduled runs at 2 AM UTC

### Pipeline Stages

1. **Lint** - Code quality checks
2. **Unit Tests** - Jest tests with coverage
3. **Visual Regression** - Playwright visual tests (Chrome, Firefox, Safari)
4. **Cross-Browser** - Compatibility tests on multiple OS/browser combinations
5. **Performance** - Load time and runtime performance metrics
6. **Build** - Production build generation
7. **Deploy Preview** - PR preview deployments
8. **Deploy Production** - Automatic deployment to production

### Test Artifacts

All test runs generate artifacts stored for 30-90 days:
- Coverage reports
- Test results in HTML/JSON/JUnit formats
- Visual regression screenshots
- Performance metrics
- Videos of failed tests

## Browser Coverage

Tests run on:
- **Chromium** - Latest version
- **Firefox** - Latest version
- **WebKit/Safari** - Latest version
- **Mobile Chrome** - Pixel 5 emulation
- **Mobile Safari** - iPhone 12 emulation

Operating Systems:
- Ubuntu (Linux)
- Windows
- macOS

## Test Configuration

### Jest Configuration
- Environment: jsdom
- Coverage threshold: 80%
- Reporters: HTML, LCOV, JSON

### Playwright Configuration
- Parallel execution
- Automatic retries on CI
- Video recording on failure
- Trace collection on retry
- Network activity logging

## Writing New Tests

### Unit Test Example
```javascript
test('should generate valid data', () => {
  const data = generateData(100);
  expect(data).toHaveLength(100);
  expect(data[0]).toHaveProperty('x');
});
```

### Visual Test Example
```javascript
test('Chart renders correctly', async ({ page }) => {
  await page.goto('/');
  const chart = page.locator('#chart');
  await expect(chart).toHaveScreenshot('chart.png');
});
```

### Performance Test Example
```javascript
test('Page loads quickly', async ({ page }) => {
  const metrics = await page.evaluate(() => performance.timing);
  expect(metrics.loadEventEnd - metrics.navigationStart).toBeLessThan(3000);
});
```

## Troubleshooting

### Common Issues

1. **Playwright browsers not installed**
   ```bash
   npx playwright install --with-deps
   ```

2. **Visual tests failing locally**
   - Different OS/resolution can cause failures
   - Update snapshots: `npx playwright test --update-snapshots`

3. **Performance tests flaky**
   - Run in isolation: `npm run test:performance`
   - Check system resources

4. **Coverage not generating**
   - Ensure babel configuration is correct
   - Check Jest environment setup

## Best Practices

1. **Keep tests isolated** - Each test should be independent
2. **Use data-testid** - For reliable element selection
3. **Mock external dependencies** - Avoid network calls in unit tests
4. **Meaningful assertions** - Test behavior, not implementation
5. **Regular baseline updates** - Keep visual snapshots current
6. **Performance budgets** - Set realistic thresholds
7. **Parallel execution** - Speed up test runs
8. **Comprehensive coverage** - Aim for >80% code coverage

## Contributing

When adding new features:
1. Write unit tests for logic
2. Add E2E tests for user flows
3. Include visual regression tests for UI changes
4. Add performance tests for heavy operations
5. Ensure all tests pass locally
6. Update baselines if needed