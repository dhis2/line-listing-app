const {
    networkShim,
    chromeAllowXSiteCookies,
} = require('@dhis2/cypress-plugins')
const { tagify } = require('cypress-tags')
const d2config = require('../../d2.config.js')
const { getExcludedTags } = require('../support/getExcludedTags.js')

module.exports = (on, config) => {
    networkShim(on)
    chromeAllowXSiteCookies(on)

    const minVersion = d2config.minDHIS2Version.slice(2)
    const excludedTags = getExcludedTags(
        config.env.dhis2InstanceVersion,
        minVersion
    )

    console.log('instanceVersion', config.env.dhis2InstanceVersion)
    console.log('tags to exclude from testing', excludedTags)

    config.env.CYPRESS_EXCLUDE_TAGS = excludedTags.join(',')

    on('file:preprocessor', tagify(config))
}
