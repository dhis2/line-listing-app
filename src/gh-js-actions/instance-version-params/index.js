const core = require('@actions/core')

/* This module does not do any input validation or normalisation
 * because it is expected that version numbers are produced using
 * the `supported-versions` action and that these are valid */

function getdhis2DockerHubImageTag(versionString) {
    return `dhis2/core:${versionString}`
}

function getDhis2DbDumpUrl(/*versionString*/) {
    /* Currently we use a fixed database for version 2.38 and hope that
     * the flyway migrations pass successfully to make this DB work with
     * later versions. The reason for this is that this 2.38 has some things
     * added to it which we need for our e2e suite. The code below actually
     * will hopefully be uncommented in the future so that we cann use a
     * DB dump designed for a specific version.

    const versionSegments = versionString.split('.')
    const minorVersion = [
        versionSegments[0], // 2
        versionSegments[1], // major
        versionSegments[2], // minor
    ].join('.')
    return `https://databases.dhis2.org/sierra-leone/${minorVersion}/dhis2-db-sierra-leone.sql.gz`

    */
    return 'https://databases.dhis2.org/sierra-leone/2.38/dhis2-db-sierra-leone.sql.gz'
}

function getdhis2DbCacheKey(versionString) {
    const majorVersion = versionString.split('.')[1]
    return `dhis2-core-v${majorVersion}-db-dump`
}

function getDhis2ApiVersion(versionString) {
    return versionString.split('.')[1]
}

function main() {
    try {
        const versionString = core.getInput('version')

        const dhis2DockerHubImageTag = getdhis2DockerHubImageTag(versionString)
        const dhis2DbDumpUrl = getDhis2DbDumpUrl(versionString)
        const dhis2DbCacheKey = getdhis2DbCacheKey(versionString)
        const dhis2ApiVersion = getDhis2ApiVersion(versionString)

        core.notice(
            `Instance version parameter dhis2-docker-hub-image-tag: ${dhis2DockerHubImageTag}`
        )
        core.notice(
            `Instance version parameter dhis2-db-dump-url: ${dhis2DbDumpUrl}`
        )
        core.notice(
            `Instance version parameter dhis2DbCacheKey: ${dhis2DbCacheKey}`
        )
        core.notice(
            `Instance version parameter dhis2ApiVersion: ${dhis2ApiVersion}`
        )

        core.setOutput('dhis2-docker-hub-image-tag', dhis2DockerHubImageTag)
        core.setOutput('dhis2-db-dump-url', dhis2DbDumpUrl)
        core.setOutput('dhis2-db-cache-key', dhis2DbCacheKey)
        core.setOutput('dhis2-api-version', dhis2ApiVersion)
    } catch (error) {
        core.setFailed(
            `Could not compute instance version params: ${error.message}`
        )
    }
}

main()

module.exports = {
    getdhis2DockerHubImageTag,
    getDhis2DbDumpUrl,
    getdhis2DbCacheKey,
    getDhis2ApiVersion,
    main,
}
