const extractMinorVersion = (v) =>
    v.indexOf('2.') === 0 ? parseInt(v.slice(2, 4)) : parseInt(v.slice(0, 2))

const getInstanceMinorVersion = (dhis2InstanceVersion, minMinorVersion) => {
    const v =
        typeof dhis2InstanceVersion === 'number'
            ? dhis2InstanceVersion.toString()
            : dhis2InstanceVersion

    if (v.toLowerCase() === 'dev') {
        return minMinorVersion + 3
    }

    return extractMinorVersion(v)
}

const getExcludedTags = (dhis2InstanceVersion, minVersion) => {
    const minMinorVersion = extractMinorVersion(minVersion)

    const instanceVersion = getInstanceMinorVersion(
        dhis2InstanceVersion,
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
