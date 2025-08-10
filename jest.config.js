export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/test-results/**',
    '!**/tests/**',
    '!jest.config.js',
    '!playwright.config.js',
    '!vite.config.js'
  ],
  coverageDirectory: 'test-results/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { 
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }]
      ]
    }]
  },
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test-results/jest-report',
      filename: 'report.html',
      expand: true
    }]
  ]
};