const getInstanceMinorVersion = (dhis2InstanceVersion) => {
    // const regex = /^2\./ //remove "2." from the version
    console.log(
        '*********************dhis2.InstanceVersion',
        dhis2InstanceVersion,
        typeof dhis2InstanceVersion,
        dhis2InstanceVersion.indexOf,
        dhis2InstanceVersion.replace,
        dhis2InstanceVersion.replaceAll
    )
    // if (dhis2InstanceVersion.indexOf('2.') === 0) {
    return parseInt(dhis2InstanceVersion.slice(2, 4))
    // } else {
    // return parseInt(dhis2InstanceVersion.slice(0, 2))
    // }
}

const getExcludedTags = (dhis2InstanceVersion, minVersion) => {
    const mVersion = parseInt(minVersion)
    const instanceVersion = getInstanceMinorVersion(dhis2InstanceVersion)

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
