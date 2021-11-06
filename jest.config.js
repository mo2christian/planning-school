module.exports = {
    moduleFileExtensions: ["js", "ts"],
    testResultsProcessor: "jest-sonar-reporter",
    testMatch: ["<rootDir>/tests/**/*.test.ts"],
    testEnvironment: "node",
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "/tests/"
    ]
  };