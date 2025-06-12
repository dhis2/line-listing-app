module.exports = {
    transformIgnorePatterns: [
        'node_modules/(?!(lodash-es|@dhis2/d2-ui-[a-z-]+)/)',
    ],
    moduleNameMapper: {
        '\\.(css)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/config/testSetup.js'],
    testRunner: 'jest-circus/runner',
    testMatch: [
        '**/src/**/__tests__/**/*.spec.[jt]s?(x)',
        '**/cypress/support/__tests__/**/*.test.[jt]s?(x)',
    ],
    reporters: ['default'],
}
