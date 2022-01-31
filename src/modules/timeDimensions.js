import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'

export const TIME_DIMENSION_EVENT_DATE = 'eventDate'
export const TIME_DIMENSION_ENROLLMENT_DATE = 'enrollmentDate'
export const TIME_DIMENSION_INCIDENT_DATE = 'incidentDate'
export const TIME_DIMENSION_SCHEDULED_DATE = 'scheduledDate'
export const TIME_DIMENSION_LAST_UPDATED = 'lastUpdated'

export const NAME_PARENT_PROPERTY_PROGRAM = 'program'
export const NAME_PARENT_PROPERTY_STAGE = 'stage'

export const getTimeDimensions = () => ({
    [TIME_DIMENSION_EVENT_DATE]: {
        id: TIME_DIMENSION_EVENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: i18n.t('Date of registration'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayExecutionDateLabel',
    },
    [TIME_DIMENSION_ENROLLMENT_DATE]: {
        id: TIME_DIMENSION_ENROLLMENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: i18n.t('Tracking date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayEnrollmentDateLabel',
    },
    [TIME_DIMENSION_INCIDENT_DATE]: {
        id: TIME_DIMENSION_INCIDENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: i18n.t('Test date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayIncidentDateLabel',
    },
    [TIME_DIMENSION_SCHEDULED_DATE]: {
        id: TIME_DIMENSION_SCHEDULED_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: i18n.t('Due/Scheduled date'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayDueDateLabel',
    },
    [TIME_DIMENSION_LAST_UPDATED]: {
        id: TIME_DIMENSION_LAST_UPDATED,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: i18n.t('Last updated on'),
    },
})
