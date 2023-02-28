import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED,
} from '../../src/modules/dimensionConstants.js'
import { getPreviousYearStr } from '../helpers/period.js'

export const E2E_PROGRAM = {
    programName: 'E2E program',
    //stageName: 'Stage 1 - Repeatable',
    [DIMENSION_ID_EVENT_DATE]: 'Event date (e2e)',
    [DIMENSION_ID_ENROLLMENT_DATE]: 'Enrollment date (e2e)',
    [DIMENSION_ID_SCHEDULED_DATE]: 'Scheduled date (e2e)',
    [DIMENSION_ID_INCIDENT_DATE]: 'Incident date (e2e)',
    [DIMENSION_ID_LAST_UPDATED]: 'Last updated on',
}

export const CHILD_PROGRAM = {
    programName: 'Child Programme',
    stageName: 'Birth',
    [DIMENSION_ID_EVENT_DATE]: 'Report date',
    [DIMENSION_ID_ENROLLMENT_DATE]: 'Enrollment date',
    [DIMENSION_ID_SCHEDULED_DATE]: 'Scheduled date',
    [DIMENSION_ID_INCIDENT_DATE]: 'Date of birth',
    [DIMENSION_ID_LAST_UPDATED]: 'Last updated on',
}

export const TEST_AO = {
    id: 'R4wAb2yMLik',
    name: 'Inpatient: Cases last quarter (case)',
}

// alphanumerics
export const TEST_DIM_TEXT = 'E2E - Text'
export const TEST_DIM_LETTER = 'E2E - Letter'
export const TEST_DIM_LONG_TEXT = 'E2E - Long text'
export const TEST_DIM_EMAIL = 'E2E - Email'
export const TEST_DIM_USERNAME = 'E2E - Username'
export const TEST_DIM_URL = 'E2E - URL'
export const TEST_DIM_PHONE_NUMBER = 'E2E - Phone number'
export const TEST_DIM_NUMBER_OPTIONSET = 'E2E - Number (option set)'
export const TEST_DIM_TEXT_OPTIONSET = 'E2E - Text (option set)'

// numerics
export const TEST_DIM_NUMBER = 'E2E - Number'
export const TEST_DIM_UNIT_INTERVAL = 'E2E - Unit interval'
export const TEST_DIM_PERCENTAGE = 'E2E - Percentage'
export const TEST_DIM_INTEGER = 'E2E - Integer'
export const TEST_DIM_INTEGER_POSITIVE = 'E2E - Positive Integer'
export const TEST_DIM_INTEGER_NEGATIVE = 'E2E - Negative Integer'
export const TEST_DIM_INTEGER_ZERO_OR_POSITIVE =
    'E2E - Positive or Zero Integer'
export const TEST_DIM_WITH_PRESET = 'E2E - Number (legend set)'

// booleans
export const TEST_DIM_YESNO = 'E2E - Yes/no'
export const TEST_DIM_YESONLY = 'E2E - Yes only'

// dates
export const TEST_DIM_DATE = 'E2E - Date'
export const TEST_DIM_TIME = 'E2E - Time'
export const TEST_DIM_DATETIME = 'E2E - Date & Time'

// non-filterables
export const TEST_DIM_AGE = 'E2E - Age'
export const TEST_DIM_COORDINATE = 'E2E - Coordinate'

// special
export const TEST_DIM_ORG_UNIT = 'E2E - Organisation unit'
export const TEST_DIM_LEGEND_SET = 'E2E - Number (legend set)'
export const TEST_DIM_LEGEND_SET_NEGATIVE = TEST_DIM_INTEGER_NEGATIVE

export const TEST_REL_PE_THIS_YEAR = {
    type: 'Years',
    name: 'This year',
}

export const TEST_REL_PE_LAST_YEAR = {
    type: 'Years',
    name: 'Last year',
}

export const TEST_FIX_PE_DEC_LAST_YEAR = {
    //type: 'Monthly',
    year: `${getPreviousYearStr()}`,
    name: `December ${getPreviousYearStr()}`,
}
