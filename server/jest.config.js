export default {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'mjs', 'json'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/?(*.)+(spec|test).mjs',
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};