const path = require('path')
const core = require('@actions/core')
const { HttpClient } = require('@actions/http-client')

const STABLE_VERSIONS_URL = 'https://releases.dhis2.org/v1/versions/stable.json'

function isValidInteger(str) {
    var n = Math.floor(Number(str))
    // Allow positive integers and zero
    return n !== Infinity && String(n) === str && n >= 0
}

function isValidVersionString(versionString, isRC) {
    // We always start with '2.'
    if (!versionString.startsWith('2.')) {
        return false
    }
    // RCs must end with `-rc`, others must not
    if (
        typeof isRC === 'boolean' &&
        ((isRC && !versionString.endsWith('-rc')) ||
            (!isRC && versionString.endsWith('-rc')))
    ) {
        return false
    }

    const versionSegments = versionString.replace(/-rc$/, '').split('.')

    /* Minimum specifity should include a minor-version, i.e. `2.38.0`,
     * because this matches the tags on Docker Hub. So min length is set to 3.
     * Maximum specificty would be including a hotfix `2.38.1.1`, so max length
     * has been set to 4. */
    if (versionSegments.length < 3 || versionSegments.length > 4) {
        return false
    }

    if (!versionSegments.every(isValidInteger)) {
        return false
    }

    return true
}

function getMinDHIS2Version() {
    const configPath = path.join(
        process.env.GITHUB_WORKSPACE ?? process.cwd(),
        core.getInput('config-dir').trim() ?? '',
        'd2.config.js'
    )
    const { minDHIS2Version } = require(configPath)
    return minDHIS2Version
}

function getReleaseCandidates() {
    const inputValue = core.getInput('release-candidates')

    if (!inputValue) {
        return []
    }

    const rcVersions = inputValue.split(',').map((str) => str.trim())

    for (const rcVersion of rcVersions) {
        if (!isValidVersionString(rcVersion, true)) {
            throw new Error(
                `The string "${rcVersion}" is not a valid release candidate version`
            )
        }
    }

    return rcVersions
}

function getBrokenVersions() {
    const inputValue = core.getInput('broken-versions')

    if (!inputValue) {
        return []
    }

    const brokenVersions = inputValue.split(',').map((str) => str.trim())

    for (const brokenVersion of brokenVersions) {
        if (!isValidVersionString(brokenVersion)) {
            throw new Error(
                `The string "${brokenVersion}" provided to \`broken-versions\` is not a valid version`
            )
        }
    }

    return brokenVersions
}

function getStableVersions() {
    const httpClient = new HttpClient()
    return httpClient
        .get(STABLE_VERSIONS_URL)
        .then((response) => response.readBody())
        .then((body) => JSON.parse(body))
        .then(({ versions }) => versions)
}

function computeFullVersionName({
    name,
    latestPatchVersion,
    latestHotfixVersion,
}) {
    const patchVersionName = `${name}.${latestPatchVersion}`

    return latestHotfixVersion
        ? `${patchVersionName}.${latestHotfixVersion}`
        : patchVersionName
}

function computeSupportedVersions({
    stableVersions,
    minDHIS2Version = '',
    releaseCandidates = [],
    brokenVersions = [],
} = {}) {
    const minDHIS2VersionNumber = minDHIS2Version.split('.')[1] ?? 0
    const latestVersion = stableVersions.find(({ latest }) => latest)?.version
    const stableVersionsLookup = stableVersions.reduce((acc, versionObj) => {
        acc.set(versionObj.version, {
            fullName: computeFullVersionName(versionObj),
            supported: versionObj.supported,
        })
        return acc
    }, new Map())
    const releaseCandidatesLookup = releaseCandidates.reduce(
        (acc, rcVersionString) => {
            const versionNumber = parseInt(rcVersionString.split('.')[1])
            acc.set(versionNumber, {
                fullName: rcVersionString,
                supported: true,
            })
            return acc
        },
        new Map()
    )
    const supportedVersions = []
    let currentVersion = latestVersion
    let isSupported = true

    while (isSupported) {
        const versionReleaseCandidate =
            releaseCandidatesLookup.get(currentVersion)
        const versionObj =
            versionReleaseCandidate ?? stableVersionsLookup.get(currentVersion)
        const { fullName, supported } = versionObj
        const isBroken = brokenVersions.some(
            (brokenVersion) => brokenVersion === fullName
        )

        if (supported && currentVersion >= minDHIS2VersionNumber) {
            if (!isBroken) {
                supportedVersions.push(fullName)
            }
        } else {
            isSupported = false
        }

        --currentVersion
    }

    return supportedVersions
}

async function main() {
    try {
        const minDHIS2Version = getMinDHIS2Version()
        const releaseCandidates = getReleaseCandidates()
        const brokenVersions = getBrokenVersions()
        const stableVersions = await getStableVersions()
        const supportedVersions = computeSupportedVersions({
            stableVersions,
            minDHIS2Version,
            releaseCandidates,
            brokenVersions,
        })

        core.notice(
            'The following supported versions were detected: ' +
                supportedVersions.join(', ')
        )
        core.setOutput('versions', JSON.stringify(supportedVersions))
    } catch (error) {
        core.setFailed(`Could not compute supported versions: ${error.message}`)
    }
}

main()

module.exports = {
    isValidVersionString,
    getMinDHIS2Version,
    getReleaseCandidates,
    getStableVersions,
    getBrokenVersions,
    computeSupportedVersions,
    main,
    STABLE_VERSIONS_URL,
}
