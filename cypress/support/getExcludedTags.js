const getInstanceMinorVersion = (dhis2InstanceVersion, mVersion) => {
    const v =
        typeof dhis2InstanceVersion === 'number'
            ? dhis2InstanceVersion.toString()
            : dhis2InstanceVersion

    if (v.toLowerCase() === 'dev') {
        return mVersion + 3
    }

    if (v.indexOf('2.') === 0) {
        return parseInt(v.slice(2, 4))
    } else {
        return parseInt(v.slice(0, 2))
    }
}

const getExcludedTags = (dhis2InstanceVersion, minVersion) => {
    const mVersion =
        minVersion.indexOf('2.') === 0
            ? parseInt(minVersion.slice(2, 4))
            : parseInt(minVersion.slice(0, 2))

    const instanceVersion = getInstanceMinorVersion(
        dhis2InstanceVersion,
        mVersion
    )

    if (instanceVersion < mVersion) {
        throw new Error(
            'Instance version is lower than the minimum supported version'
        )
    }

    let excludeTags = []
    if (instanceVersion === mVersion) {
        excludeTags = [
            `<${instanceVersion}`,
            `>${instanceVersion}`,
            `>=${instanceVersion + 1}`,
            `>${instanceVersion + 1}`,
            `>=${instanceVersion + 2}`,
            `>${instanceVersion + 2}`,
            `>=${instanceVersion + 3}`,
        ]
    } else if (instanceVersion === mVersion + 1) {
        excludeTags = [
            `<=${instanceVersion - 1}`,
            `<${instanceVersion - 1}`,
            `<${instanceVersion}`,
            `>${instanceVersion}`,
            `>=${instanceVersion + 1}`,
            `>${instanceVersion + 1}`,
            `>=${instanceVersion + 2}`,
        ]
    } else if (instanceVersion === mVersion + 2) {
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