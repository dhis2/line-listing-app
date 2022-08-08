import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
} from '../../src/modules/dimensionConstants.js'
import { getPreviousYearStr } from '../helpers/period.js'

export const ANALYTICS_PROGRAM = {
    programName: 'Analytics program',
    //stageName: 'Stage 1 - Repeatable',
    [DIMENSION_ID_EVENT_DATE]: 'Event date (analytics)',
    [DIMENSION_ID_ENROLLMENT_DATE]: 'Enrollment date (analytics)',
    [DIMENSION_ID_INCIDENT_DATE]: 'Incident date (analytics)',
    [DIMENSION_ID_LAST_UPDATED]: 'Last updated on',
}

export const TEST_AOS = [
    {
        id: 'qmuoJ2ROwUb',
        name: 'List of patients with no treatment initiation date',
    },
]

// alphanumerics
export const TEST_DIM_TEXT = 'Analytics - Text'
export const TEST_DIM_LETTER = 'Analytics - Letter'
export const TEST_DIM_LONG_TEXT = 'Analytics - Long text'
export const TEST_DIM_EMAIL = 'Analytics - Email'
export const TEST_DIM_USERNAME = 'Analytics - Username'
export const TEST_DIM_URL = 'Analytics - URL'
export const TEST_DIM_PHONE_NUMBER = 'Analytics - Phone number'

// numerics
export const TEST_DIM_NUMBER = 'Analytics - Number'
export const TEST_DIM_UNIT_INTERVAL = 'Analytics - Unit interval'
export const TEST_DIM_PERCENTAGE = 'Analytics - Percentage'
export const TEST_DIM_INTEGER = 'Analytics - Integer'
export const TEST_DIM_POSITIVE_INTEGER = 'Analytics - Positive Integer'
export const TEST_DIM_NEGATIVE_INTEGER = 'Analytics - Negative Integer'
export const TEST_DIM_POSITIVE_OR_ZERO = 'Analytics - Positive or Zero Integer'

// booleans
export const TEST_DIM_YESNO = 'Analytics - Yes/no'
export const TEST_DIM_YESONLY = 'Analytics - Yes only'

// dates
export const TEST_DIM_DATE = 'Analytics - Date'
export const TEST_DIM_TIME = 'Analytics - Time'
export const TEST_DIM_DATETIME = 'Analytics - Date & Time'

// non-filterables
export const TEST_DIM_AGE = 'Analytics - Age'
export const TEST_DIM_COORDINATE = 'Analytics - Coordinate'

// special
export const TEST_DIM_ORG_UNIT = 'Analytics - Organisation unit'
// TODO: Add tests for the commented out type below
// OPTION SET

export const TEST_REL_PE_THIS_YEAR = {
    type: 'Years',
    name: 'This year',
}

export const TEST_REL_PE_LAST_12_MONTHS = {
    //type: 'Months',
    name: 'Last 12 months',
}

export const TEST_FIX_PE_DEC_LAST_YEAR = {
    //type: 'Monthly',
    year: `${getPreviousYearStr()}`,
    name: `December ${getPreviousYearStr()}`,
}
