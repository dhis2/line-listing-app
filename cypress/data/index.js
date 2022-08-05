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

// alpha-numerics
export const TEST_DIM_TEXT = 'Analytics - Text'
// VALUE_TYPE_LETTER
// VALUE_TYPE_LONG_TEXT
// VALUE_TYPE_EMAIL
// VALUE_TYPE_USERNAME
// VALUE_TYPE_URL
// VALUE_TYPE_PHONE_NUMBER

// booleans
export const TEST_DIM_YESNO = 'Analytics - Yes/no'
// VALUE_TYPE_TRUE_ONLY

// dates
export const TEST_DIM_DATE = 'Analytics - Date'
export const TEST_DIM_TIME = 'Analytics - Time'
export const TEST_DIM_DATETIME = 'Analytics - Date & Time'

// numerics
export const TEST_DIM_NUMBER = 'Analytics - Number'
export const TEST_DIM_UNIT_INTERVAL = 'Analytics - Unit interval'
export const TEST_DIM_PERCENTAGE = 'Analytics - Percentage'
export const TEST_DIM_INTEGER = 'Analytics - Integer'
export const TEST_DIM_POSITIVE_INTEGER = 'Analytics - Positive Integer'
export const TEST_DIM_NEGATIVE_INTEGER = 'Analytics - Negative Integer'
export const TEST_DIM_POSITIVE_OR_ZERO = 'Analytics - Positive or Zero Integer'

// non-filterables
// COORDINATE
// AGE
// FILE
// IMAGE

// special
// ORG UNIT

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
