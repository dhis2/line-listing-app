import { useCachedDataQuery } from '@dhis2/analytics'
import { USER_SETTINGS_UI_LOCALE } from './userSettings.js'

export const getStartEndDate = (dimensionId) => {
    const parts = dimensionId.split('_')
    return parts.length === 2 &&
        !isNaN(Date.parse(parts[0])) &&
        !isNaN(Date.parse(parts[1]))
        ? parts
        : []
}

export const isStartEndDate = (id) => getStartEndDate(id).length === 2

export const useLocalizedStartEndDateFormatter = () => {
    const { currentUser } = useCachedDataQuery()

    const formatter = new Intl.DateTimeFormat(
        currentUser.settings[USER_SETTINGS_UI_LOCALE],
        {
            dateStyle: 'long',
        }
    )

    return (startEndDate) =>
        getStartEndDate(startEndDate)
            .map((dateStr) => formatter.format(new Date(dateStr)))
            .join(' - ')
}
