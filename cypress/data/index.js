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

export const TEST_DIM_TEXT = 'Analytics - Text'
export const TEST_DIM_NUMBER = 'Analytics - Number'
export const TEST_DIM_YESNO = 'Analytics - Yes/no'
export const TEST_DIM_DATE = 'Analytics - Date'
export const TEST_DIM_TIME = 'Analytics - Time'
export const TEST_DIM_DATETIME = 'Analytics - Date & Time'

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
