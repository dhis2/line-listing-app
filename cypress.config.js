const { chromeAllowXSiteCookies } = require('@dhis2/cypress-plugins')
const { defineConfig } = require('cypress')
const {
    excludeByVersionTags,
} = require('./cypress/plugins/excludeByVersionTags.js')

// This function will be modified when we add plugins
async function setupNodeEvents(on, config) {
    chromeAllowXSiteCookies(on, config)
    excludeByVersionTags(on, config)

    if (!config.env.dhis2InstanceVersion) {
        throw new Error(
            'dhis2InstanceVersion is missing. Check the README for more information.'
        )
    }

    return config
}

module.exports = defineConfig({
    projectId: 'm5qvjx',
    e2e: {
        setupNodeEvents,
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/integration/**/*.cy.js',
        viewportWidth: 1280,
        viewportHeight: 800,
        video: false,
    },
    env: {
        dhis2DatatestPrefix: 'dhis2-linelisting',
        networkMode: 'live',
        dhis2ApiVersion: '41',
    },
})
