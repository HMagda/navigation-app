// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // ... other configurations
  testEnvironment: 'jest-environment-jsdom', // Ensure this is set correctly
};

module.exports = createJestConfig(customJestConfig);
