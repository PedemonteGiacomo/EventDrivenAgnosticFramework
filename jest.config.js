export default {
  roots: ["packages"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: { "^.+\\.tsx?$": ["ts-jest"] },
  testEnvironment: "jest-environment-jsdom",
  setupFiles: ['<rootDir>/jest.setup.js']
};
