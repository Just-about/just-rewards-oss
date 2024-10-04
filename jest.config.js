/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "jest-puppeteer",
  setupFilesAfterEnv: ["expect-puppeteer"],
  testTimeout: 100000,
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.json",
    },
  },
};
