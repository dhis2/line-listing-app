import {
    DIMENSION_TYPE_PERIOD,
    VALUE_TYPE_DATE,
    layoutGetAllDimensions,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_IDS_TIME,
} from './dimensionConstants.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from './programTypes.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from './visualization.js'

const NAME_PARENT_PROPERTY_PROGRAM = 'program'
const NAME_PARENT_PROPERTY_STAGE = 'stage'

export const getTimeDimensions = () => ({
    [DIMENSION_ID_EVENT_DATE]: {
        id: DIMENSION_ID_EVENT_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        defaultName: i18n.t('Event date'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayExecutionDateLabel',
        formatType: VALUE_TYPE_DATE,
    },
    [DIMENSION_ID_ENROLLMENT_DATE]: {
        id: DIMENSION_ID_ENROLLMENT_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        defaultName: i18n.t('Enrollment date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayEnrollmentDateLabel',
        formatType: VALUE_TYPE_DATE,
    },
    [DIMENSION_ID_INCIDENT_DATE]: {
        id: DIMENSION_ID_INCIDENT_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        defaultName: i18n.t('Incident date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayIncidentDateLabel',
        formatType: VALUE_TYPE_DATE,
    },
    [DIMENSION_ID_SCHEDULED_DATE]: {
        id: DIMENSION_ID_SCHEDULED_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        defaultName: i18n.t('Scheduled date'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayDueDateLabel',
        formatType: VALUE_TYPE_DATE,
    },
})

export const getTimeDimensionName = (dimension, program, stage) => {
    if (!dimension.nameParentProperty || !program) {
        return dimension.defaultName
    }
    const name =
        dimension.nameParentProperty === NAME_PARENT_PROPERTY_PROGRAM
            ? program[dimension.nameProperty]
            : stage?.[dimension.nameProperty]

    return name || dimension.defaultName
}

// Returns dimensions that should be hidden based on program configuration only
// (not based on output type - all dimensions for the program should be shown)
export const getHiddenTimeDimensions = (inputType, program, stage) => {
    const hiddenDimensions = []

    // If no program, hide all program-specific time dimensions
    if (!program) {
        return [
            DIMENSION_ID_EVENT_DATE,
            DIMENSION_ID_ENROLLMENT_DATE,
            DIMENSION_ID_SCHEDULED_DATE,
            DIMENSION_ID_INCIDENT_DATE,
        ]
    }

    // For Event programs (WITHOUT_REGISTRATION), hide tracker-specific dimensions
    if (program.programType !== PROGRAM_TYPE_WITH_REGISTRATION) {
        hiddenDimensions.push(DIMENSION_ID_ENROLLMENT_DATE)
        hiddenDimensions.push(DIMENSION_ID_INCIDENT_DATE)
        hiddenDimensions.push(DIMENSION_ID_SCHEDULED_DATE)
        return hiddenDimensions
    }

    // For Tracker programs (WITH_REGISTRATION), only hide based on program config
    // Hide incident date if program doesn't capture it
    if (program.displayIncidentDate === false) {
        hiddenDimensions.push(DIMENSION_ID_INCIDENT_DATE)
    }

    // Note: We don't hide scheduled date based on stage config anymore
    // because we want to show all dimensions for the data source
    // The stage filter will handle filtering dimensions by stage

    return hiddenDimensions
}

export const isAoWithTimeDimension = (ao) =>
    layoutGetAllDimensions(ao).some(
        ({ dimensionType, dimension, items }) =>
            (dimensionType === DIMENSION_TYPE_PERIOD ||
                DIMENSION_IDS_TIME.has(dimension)) &&
            Array.isArray(items) &&
            items.length > 0
    )
