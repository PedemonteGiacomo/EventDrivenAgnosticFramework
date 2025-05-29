// jest.config.js  (root)
export default {
  roots: ["packages"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest"]
  },
  testEnvironment: "jsdom"     // <— cambia da "node" a "jsdom"
};
