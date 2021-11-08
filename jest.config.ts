import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  testResultsProcessor: "jest-sonar-reporter",
  testMatch: ["**/*test.ts"]
};
export default config;
