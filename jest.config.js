export default {
  roots: ["packages"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: { "^.+\\.tsx?$": ["ts-jest"] },
  testEnvironment: "node"
};
