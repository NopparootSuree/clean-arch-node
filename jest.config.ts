module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30000,
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.{js,ts}',
      '!src/**/*.d.ts',
    ],
  };