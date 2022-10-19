const getString = (v) => (typeof v === 'number' ? v.toString() : v)

const extractMinorVersion = (v) =>
    v.indexOf('2.') === 0 ? parseInt(v.slice(2, 4)) : parseInt(v.slice(0, 2))

const getInstanceMinorVersion = (dhis2InstanceVersion, minMinorVersion) => {
    if (dhis2InstanceVersion.toLowerCase() === 'dev') {
        return minMinorVersion + 3
    }

    return extractMinorVersion(dhis2InstanceVersion)
}

const getExcludedTags = (dhis2InstanceVersion, minVersion) => {
    const minMinorVersion = extractMinorVersion(getString(minVersion))

    const instanceVersion = getInstanceMinorVersion(
        getString(dhis2InstanceVersion),
        minMinorVersion
    )

    if (instanceVersion < minMinorVersion) {
        throw new Error(
            'Instance version is lower than the minimum supported version'
        )
    }

    let excludeTags = []
    if (instanceVersion === minMinorVersion) {
        excludeTags = [
            `<${instanceVersion}`,
            `>${instanceVersion}`,
            `>=${instanceVersion + 1}`,
            `>${instanceVersion + 1}`,
            `>=${instanceVersion + 2}`,
            `>${instanceVersion + 2}`,
            `>=${instanceVersion + 3}`,
        ]
    } else if (instanceVersion === minMinorVersion + 1) {
        excludeTags = [
            `<=${instanceVersion - 1}`,
            `<${instanceVersion - 1}`,
            `<${instanceVersion}`,
            `>${instanceVersion}`,
            `>=${instanceVersion + 1}`,
            `>${instanceVersion + 1}`,
            `>=${instanceVersion + 2}`,
        ]
    } else if (instanceVersion === minMinorVersion + 2) {
        excludeTags = [
            `<=${instanceVersion - 2}`,
            `<${instanceVersion - 2}`,
            `<=${instanceVersion - 1}`,
            `<${instanceVersion - 1}`,
            `<${instanceVersion}`,
            `>${instanceVersion}`,
            `>=${instanceVersion + 1}`,
        ]
    } else {
        excludeTags = [
            `<=${instanceVersion - 3}`,
            `<${instanceVersion - 3}`,
            `<=${instanceVersion - 2}`,
            `<${instanceVersion - 2}`,
            `<${instanceVersion - 1}`,
            `<=${instanceVersion - 1}`,
            `<${instanceVersion}`,
        ]
    }

    return excludeTags
}

module.exports = { getExcludedTags }
