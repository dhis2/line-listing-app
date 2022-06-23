import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
} from '../../src/modules/dimensionConstants.js'
import { getPreviousYearStr } from '../helpers/period.js'

const ANALYTICS_PROGRAM = {
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

export const TEST_EVENT_DATA = [
    {
        ...ANALYTICS_PROGRAM,
        dimensions: ['Analytics - Text'],
    },
    {
        ...ANALYTICS_PROGRAM,
        dimensions: ['Analytics - Number'],
    },
    {
        ...ANALYTICS_PROGRAM,
        dimensions: ['Analytics - Yes/no'],
    },
]

export const TEST_ENROLLMENT_DATA = [
    {
        ...ANALYTICS_PROGRAM,
        dimensions: ['Analytics - Text'],
    },
    {
        ...ANALYTICS_PROGRAM,
        dimensions: ['Analytics - Number'],
    },
]

export const TEST_FIXED_PERIODS = [
    {
        //type: 'Monthly',
        year: `${getPreviousYearStr()}`,
        name: `December ${getPreviousYearStr()}`,
    },
]

export const TEST_RELATIVE_PERIODS = [
    {
        type: 'Years',
        name: 'This year',
    },
]
