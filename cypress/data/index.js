import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED,
} from '../../src/modules/dimensionConstants.js'
import { getPreviousYearStr } from '../helpers/period.js'

export const ANALYTICS_PROGRAM = {
    programName: 'Analytics program',
    stages: {
        'Stage 1 - Repeatable': {
            stageName: 'Stage 1 - Repeatable',
            [DIMENSION_ID_EVENT_DATE]: {
                label: 'Event date (analytics)',
                enabled: true,
            },
            [DIMENSION_ID_ENROLLMENT_DATE]: {
                label: 'Enrollment date (analytics)',
                enabled: true,
            },
            [DIMENSION_ID_SCHEDULED_DATE]: {
                label: 'Scheduled date (analytics)',
                enabled: true,
            },
            [DIMENSION_ID_INCIDENT_DATE]: {
                label: 'Incident date (analytics)',
                enabled: true,
            },
            [DIMENSION_ID_LAST_UPDATED]: {
                label: 'Last updated on',
                enabled: true,
            },
        },
    },
}

export const ENROLLMENT_ANALYTICS_PROGRAM = {
    programName: 'Analytics program',
    [DIMENSION_ID_EVENT_DATE]: {
        label: 'Event date (analytics)',
        enabled: false,
    },
    [DIMENSION_ID_ENROLLMENT_DATE]: {
        label: 'Enrollment date (analytics)',
        enabled: true,
    },
    [DIMENSION_ID_SCHEDULED_DATE]: {
        label: 'Scheduled date (analytics)',
        enabled: false,
    },
    [DIMENSION_ID_INCIDENT_DATE]: {
        label: 'Incident date (analytics)',
        enabled: true,
    },
    [DIMENSION_ID_LAST_UPDATED]: {
        label: 'Last updated on',
        enabled: true,
    },
}

export const HIV_PROGRAM = {
    programName: 'HIV Case Surveillance',
    stages: {
        'No stage': {
            stageName: 'No stage',
            [DIMENSION_ID_EVENT_DATE]: {
                label: 'Event date',
                enabled: true,
            },
            [DIMENSION_ID_ENROLLMENT_DATE]: {
                label: 'Enrollment date',
                enabled: true,
            },
            [DIMENSION_ID_SCHEDULED_DATE]: {
                label: 'Scheduled date',
                enabled: false,
            },
            [DIMENSION_ID_INCIDENT_DATE]: {
                label: 'Incident date',
                enabled: false,
            },
            [DIMENSION_ID_LAST_UPDATED]: {
                label: 'Last updated on',
                enabled: true,
            },
        },
        'Initial Case Report': {
            stageName: 'Initial Case Report',
            [DIMENSION_ID_EVENT_DATE]: {
                label: 'Initial Case Report',
                enabled: true,
            },
            [DIMENSION_ID_ENROLLMENT_DATE]: {
                label: 'Enrollment date',
                enabled: true,
            },
            [DIMENSION_ID_SCHEDULED_DATE]: {
                label: 'Scheduled date',
                enabled: false,
            },
            [DIMENSION_ID_INCIDENT_DATE]: {
                label: 'Incident date',
                enabled: false,
            },
            [DIMENSION_ID_LAST_UPDATED]: {
                label: 'Last updated on',
                enabled: true,
            },
        },
    },
}

export const TEST_AO = {
    id: 'qmuoJ2ROwUb',
    name: 'List of patients with no treatment initiation date',
}

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
export const TEST_DIM_WITH_PRESET = 'Analytics - Number (legend set)'

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
export const TEST_DIM_LEGEND_SET = 'Analytics - Number (legend set)'
export const TEST_DIM_LEGEND_SET_NEGATIVE = TEST_DIM_NEGATIVE_INTEGER

export const TEST_REL_PE_THIS_YEAR = {
    type: 'Years',
    name: 'This year',
}

export const TEST_REL_PE_LAST_YEAR = {
    type: 'Years',
    name: 'Last year',
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
