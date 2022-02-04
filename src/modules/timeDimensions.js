import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_TYPE_EVENT_DATE,
    DIMENSION_TYPE_ENROLLMENT_DATE,
    DIMENSION_TYPE_INCIDENT_DATE,
    DIMENSION_TYPE_SCHEDULED_DATE,
    DIMENSION_TYPE_LAST_UPDATED,
} from './dimensionTypes.js'

export const NAME_PARENT_PROPERTY_PROGRAM = 'program'
export const NAME_PARENT_PROPERTY_STAGE = 'stage'

export const getTimeDimensions = () => ({
    [DIMENSION_TYPE_EVENT_DATE]: {
        id: DIMENSION_TYPE_EVENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: i18n.t('Date of registration'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayExecutionDateLabel',
    },
    [DIMENSION_TYPE_ENROLLMENT_DATE]: {
        id: DIMENSION_TYPE_ENROLLMENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: i18n.t('Tracking date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayEnrollmentDateLabel',
    },
    [DIMENSION_TYPE_INCIDENT_DATE]: {
        id: DIMENSION_TYPE_INCIDENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: i18n.t('Test date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayIncidentDateLabel',
    },
    [DIMENSION_TYPE_SCHEDULED_DATE]: {
        id: DIMENSION_TYPE_SCHEDULED_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: i18n.t('Due/Scheduled date'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayDueDateLabel',
    },
    [DIMENSION_TYPE_LAST_UPDATED]: {
        id: DIMENSION_TYPE_LAST_UPDATED,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: i18n.t('Last updated on'),
    },
})
