/** @type {import('jest').Config} */
module.exports = {
    roots: ['<rootDir>/../Test'],
    modulePaths: ['<rootDir>/node_modules'],
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: '<rootDir>/tsconfig.json',
            },
        ],
    },
    testMatch: ['<rootDir>/../Test/**/*.test.ts'],
};
