const reportPortalConfig = [
    '@reportportal/agent-js-jest',
    {
        apiKey: process.env.REPORTPORTAL_API_KEY,
        endpoint: process.env.REPORTPORTAL_ENDPOINT,
        project: process.env.REPORTPORTAL_PROJECT,
        launch: 'line_listing_app',
        attributes: [
            {
                key: 'dhis2_version',
                value: 'master',
            },
            {
                key: 'app_name',
                value: 'line-listing-app',
            },
            {
                key: 'test_level',
                value: 'unit/integration',
            },
            {
                key: 'BRANCH_NAME',
                value: process.env.BRANCH_NAME,
            },
            {
                key: 'CI_BUILD_ID',
                value: process.env.CI_BUILD_ID,
            },
            {
                key: 'PR_TITLE',
                value: process.env.PR_TITLE,
            },
        ],
        description: '',
        debug: true,
    },
]

const isDependabotPR = process.env.GITHUB_ACTOR === 'dependabot[bot]'

const isReportPortalSetup =
    process.env.REPORTPORTAL_API_KEY !== undefined &&
    process.env.REPORTPORTAL_ENDPOINT !== undefined &&
    process.env.REPORTPORTAL_PROJECT !== undefined &&
    !isDependabotPR

module.exports = {
    transformIgnorePatterns: [
        'node_modules/(?!(lodash-es|@dhis2/d2-ui-[a-z-]+)/)',
    ],
    setupFilesAfterEnv: ['./config/testSetup.js'],
    moduleNameMapper: {
        '\\.(css)$': 'identity-obj-proxy',
    },
    testRunner: 'jest-circus/runner',
    testMatch: [
        '**/src/**/__tests__/**/*.spec.[jt]s?(x)',
        '**/cypress/support/__tests__/**/*.test.[jt]s?(x)',
    ],
    reporters: [
        'default',
        ...(isReportPortalSetup ? [reportPortalConfig] : []),
    ],
}
