import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_EVENT_DATE,
    DIMENSION_TYPE_ENROLLMENT_DATE,
    DIMENSION_TYPE_INCIDENT_DATE,
    DIMENSION_TYPE_SCHEDULED_DATE,
    DIMENSION_TYPE_LAST_UPDATED,
} from './dimensionTypes.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from './programTypes.js'
import { OUTPUT_TYPE_EVENT, OUTPUT_TYPE_ENROLLMENT } from './visualization.js'

const NAME_PARENT_PROPERTY_PROGRAM = 'program'
const NAME_PARENT_PROPERTY_STAGE = 'stage'

export const getTimeDimensions = () => ({
    [DIMENSION_TYPE_EVENT_DATE]: {
        id: DIMENSION_TYPE_EVENT_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Event date'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayExecutionDateLabel',
    },
    [DIMENSION_TYPE_ENROLLMENT_DATE]: {
        id: DIMENSION_TYPE_ENROLLMENT_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Enrollment date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayEnrollmentDateLabel',
    },
    [DIMENSION_TYPE_INCIDENT_DATE]: {
        id: DIMENSION_TYPE_INCIDENT_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Incident date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayIncidentDateLabel',
    },
    /***** NOT in MVP / 2.38 release *****
    [DIMENSION_TYPE_SCHEDULED_DATE]: {
        id: DIMENSION_TYPE_SCHEDULED_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Due/Scheduled date'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayDueDateLabel',
    },
    */
    [DIMENSION_TYPE_LAST_UPDATED]: {
        id: DIMENSION_TYPE_LAST_UPDATED,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Last updated on'),
    },
})

export const getTimeDimensionName = (dimension, program, stage) => {
    if (!dimension.nameParentProperty || !program) {
        return dimension.name
    }
    const name =
        dimension.nameParentProperty === NAME_PARENT_PROPERTY_PROGRAM
            ? program[dimension.nameProperty]
            : stage?.[dimension.nameProperty]

    return name || dimension.name
}

export const getEnabledTimeDimensionIds = (inputType, program, stage) => {
    const enabledDimensionIds = new Set()
    if (inputType) {
        const isEvent = inputType === OUTPUT_TYPE_EVENT
        const isEnrollment = inputType === OUTPUT_TYPE_ENROLLMENT
        const withRegistration =
            program?.programType === PROGRAM_TYPE_WITH_REGISTRATION

        if (isEvent) {
            enabledDimensionIds.add(DIMENSION_TYPE_EVENT_DATE)
        }

        if (isEnrollment) {
            enabledDimensionIds.add(DIMENSION_TYPE_ENROLLMENT_DATE)
        }

        if (withRegistration) {
            enabledDimensionIds.add(DIMENSION_TYPE_ENROLLMENT_DATE)

            if (isEvent && stage && !stage.hideDueDate) {
                enabledDimensionIds.add(DIMENSION_TYPE_SCHEDULED_DATE)
            }

            program.displayIncidentDate &&
                enabledDimensionIds.add(DIMENSION_TYPE_INCIDENT_DATE)
        }

        if (isEvent || isEnrollment || withRegistration) {
            enabledDimensionIds.add(DIMENSION_TYPE_LAST_UPDATED)
        }
    }
    return enabledDimensionIds
}
