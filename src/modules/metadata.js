import {
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
    DIMENSION_ID_ORGUNIT,
    getDimensionById,
    DIMENSION_ID_PERIOD,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_TYPE_EVENT_DATE,
    DIMENSION_TYPE_ENROLLMENT_DATE,
    DIMENSION_TYPE_INCIDENT_DATE,
    DIMENSION_TYPE_SCHEDULED_DATE,
    DIMENSION_TYPE_LAST_UPDATED,
} from './dimensionTypes.js'
import { MAIN_DIMENSIONS } from './mainDimensions.js'

const getOrganisationUnits = () => ({
    [USER_ORG_UNIT]: i18n.t('User organisation unit'),
    [USER_ORG_UNIT_CHILDREN]: i18n.t('User sub-units'),
    [USER_ORG_UNIT_GRANDCHILDREN]: i18n.t('User sub-x2-units'),
})

const getFixedDimensions = () => ({
    [DIMENSION_ID_ORGUNIT]: getDimensionById(DIMENSION_ID_ORGUNIT),
    [DIMENSION_ID_PERIOD]: getDimensionById(DIMENSION_ID_PERIOD),
})

export const NAME_PARENT_PROPERTY_PROGRAM = 'program'
const NAME_PARENT_PROPERTY_STAGE = 'stage'

export const getTimeDimensions = () => ({
    [DIMENSION_TYPE_EVENT_DATE]: {
        id: DIMENSION_TYPE_EVENT_DATE,
        name: i18n.t('Date of registration'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayExecutionDateLabel',
    },
    [DIMENSION_TYPE_ENROLLMENT_DATE]: {
        id: DIMENSION_TYPE_ENROLLMENT_DATE,
        name: i18n.t('Tracking date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayEnrollmentDateLabel',
    },
    [DIMENSION_TYPE_INCIDENT_DATE]: {
        id: DIMENSION_TYPE_INCIDENT_DATE,
        name: i18n.t('Test date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayIncidentDateLabel',
    },
    [DIMENSION_TYPE_SCHEDULED_DATE]: {
        id: DIMENSION_TYPE_SCHEDULED_DATE,
        name: i18n.t('Due/Scheduled date'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayDueDateLabel',
    },
    [DIMENSION_TYPE_LAST_UPDATED]: {
        id: DIMENSION_TYPE_LAST_UPDATED,
        name: i18n.t('Last updated on'),
    },
})

export default function () {
    return {
        ...MAIN_DIMENSIONS,
        ...Object.entries({
            ...getOrganisationUnits(),
        }).reduce(
            (acc, [key, value]) => ({ ...acc, [key]: { name: value } }),
            {}
        ),
        ...getFixedDimensions(),
        ...Object.entries({
            ...getTimeDimensions(),
        }).reduce(
            (acc, [key, { id, name }]) => ({
                ...acc,
                [key]: {
                    id: id,
                    name: name,
                    disabled: true,
                    dimensionType: DIMENSION_ID_PERIOD,
                },
            }),
            {}
        ),
    }
}
