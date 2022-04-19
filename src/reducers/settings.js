// TODO: Remove unused settings props

export const ADD_SETTINGS = 'ADD_SETTINGS'

const SYSTEM_SETTINGS_DIGITAL_GROUP_SEPARATOR = 'keyAnalysisDigitGroupSeparator'
export const SYSTEM_SETTINGS_HIDE_DAILY_PERIODS = 'keyHideDailyPeriods'
export const SYSTEM_SETTINGS_HIDE_WEEKLY_PERIODS = 'keyHideWeeklyPeriods'
export const SYSTEM_SETTINGS_HIDE_BIWEEKLY_PERIODS = 'keyHideBiWeeklyPeriods'
export const SYSTEM_SETTINGS_HIDE_MONTHLY_PERIODS = 'keyHideMonthlyPeriods'
export const SYSTEM_SETTINGS_HIDE_BIMONTHLY_PERIODS = 'keyHideBiMonthlyPeriods'

export const DEFAULT_SETTINGS = {
    // keyDateFormat: 'yyyy-MM-dd',
    // keyAnalysisRelativePeriod: 'LAST_12_MONTHS',
    [SYSTEM_SETTINGS_DIGITAL_GROUP_SEPARATOR]: 'SPACE',
    [SYSTEM_SETTINGS_HIDE_DAILY_PERIODS]: false,
    [SYSTEM_SETTINGS_HIDE_WEEKLY_PERIODS]: false,
    [SYSTEM_SETTINGS_HIDE_BIWEEKLY_PERIODS]: false,
    [SYSTEM_SETTINGS_HIDE_MONTHLY_PERIODS]: false,
    [SYSTEM_SETTINGS_HIDE_BIMONTHLY_PERIODS]: false,
    displayNameProperty: 'displayName',
    // uiLocale: 'en',
    rootOrgUnits: [],
}

export default (state = DEFAULT_SETTINGS, action) => {
    switch (action.type) {
        case ADD_SETTINGS: {
            return {
                ...state,
                ...action.value,
            }
        }
        default:
            return state
    }
}

// Selectors

export const sGetSettings = (state) => state.settings

export const sGetSettingsDisplayNameProperty = (state) =>
    sGetSettings(state).displayNameProperty

export const sGetSettingsDigitGroupSeparator = (state) =>
    sGetSettings(state).keyAnalysisDigitGroupSeparator

export const sGetRootOrgUnits = (state) => sGetSettings(state).rootOrgUnits

// export const sGetRelativePeriod = state =>
//     sGetSettings(state).keyAnalysisRelativePeriod

// export const sGetUiLocale = state => sGetSettings(state).uiLocale
