const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact, 'plugin:cypress/recommended'],
    rules: {
        // TODO: remove after extracting components
        'react/no-unknown-property': ['error', { ignore: ['jsx'] }],
    },
}
