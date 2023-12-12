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
                value: 'line_listing_app',
            },
            {
                key: 'test_level',
                value: 'unit/integration',
            },
        ],
        description: '',
        debug: true,
    },
]

const isReportPortalSetup =
    process.env.REPORTPORTAL_API_KEY !== undefined &&
    process.env.REPORTPORTAL_ENDPOINT !== undefined &&
    process.env.REPORTPORTAL_PROJECT !== undefined

module.exports = {
    transformIgnorePatterns: [
        'node_modules/(?!(lodash-es|@dhis2/d2-ui-[a-z-]+)/)',
    ],
    setupFilesAfterEnv: ['./config/testSetup.js'],
    moduleNameMapper: {
        '\\.(css)$': 'identity-obj-proxy',
    },
    testRunner: 'jest-circus/runner',
    testRegex: ['/src/modules/__tests__/.*.spec.js?$'],
    reporters: [
        'default',
        ...(isReportPortalSetup ? [reportPortalConfig] : []),
    ],
}
