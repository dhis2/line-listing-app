const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact, 'plugin:cypress/recommended'],
    rules: {
        'react/no-object-type-as-default-prop': 'error',
    },
}
