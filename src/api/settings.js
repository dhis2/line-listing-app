import { SYSTEM_SETTINGS } from '../modules/settings.js'

const systemSettingsQuery = {
    resource: 'systemSettings',
    params: {
        key: SYSTEM_SETTINGS,
    },
}

export const apiFetchSystemSettings = async (dataEngine) => {
    const systemSettingsData = await dataEngine.query(
        { systemSettings: systemSettingsQuery },
        {}
    )

    return systemSettingsData.systemSettings
}
