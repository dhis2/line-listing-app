import { useCachedDataQuery } from '@dhis2/analytics'
import {
    getStartEndDate,
    isStartEndDate,
    useLocalizedStartEndDateFormatter,
} from '../dates.js'
import { USER_SETTINGS_UI_LOCALE } from '../userSettings.js'

jest.mock('@dhis2/analytics', () => ({
    useCachedDataQuery: jest.fn(),
}))

describe('getStartEndDate', () => {
    it('should return an array with start and end date when dimensionId is valid', () => {
        const dimensionId = '2021-01-01_2021-12-31'
        const result = getStartEndDate(dimensionId)
        expect(result).toEqual(['2021-01-01', '2021-12-31'])
    })

    it('should return an empty array when dimensionId is invalid', () => {
        const dimensionId = 'invalid_date'
        const result = getStartEndDate(dimensionId)
        expect(result).toEqual([])
    })

    it('should return an empty array when dimensionId is invalid', () => {
        const dimensionId = '2021-01-01_'
        const result = getStartEndDate(dimensionId)
        expect(result).toEqual([])
    })
})

describe('isStartEndDate', () => {
    it('should return true when dimensionId is valid', () => {
        const dimensionId = '2021-01-01_2021-12-31'
        const result = isStartEndDate(dimensionId)
        expect(result).toBe(true)
    })

    it('should return false when dimensionId is invalid', () => {
        const dimensionId = 'invalid_date'
        const result = isStartEndDate(dimensionId)
        expect(result).toBe(false)
    })
})

describe('useLocalizedStartEndDateFormatter', () => {
    it('should format start and end date correctly for en-US', () => {
        const currentUser = {
            settings: {
                [USER_SETTINGS_UI_LOCALE]: 'en-US',
            },
        }
        useCachedDataQuery.mockReturnValue({ currentUser })

        const formatter = useLocalizedStartEndDateFormatter()
        const result = formatter('2021-01-01_2021-12-31')
        expect(result).toBe('January 1, 2021 - December 31, 2021')
    })

    it('should format start and end date correctly for fr-FR', () => {
        const currentUser = {
            settings: {
                [USER_SETTINGS_UI_LOCALE]: 'fr-FR',
            },
        }
        useCachedDataQuery.mockReturnValue({ currentUser })

        const formatter = useLocalizedStartEndDateFormatter()
        const result = formatter('2021-01-01_2021-12-31')
        expect(result).toBe('1 janvier 2021 - 31 décembre 2021')
    })

    it('should return an empty string when startEndDate is invalid', () => {
        const currentUser = {
            settings: {
                [USER_SETTINGS_UI_LOCALE]: 'en-US',
            },
        }
        useCachedDataQuery.mockReturnValue({ currentUser })

        const formatter = useLocalizedStartEndDateFormatter()
        const result = formatter('invalid_date')
        expect(result).toBe('')
    })
})
