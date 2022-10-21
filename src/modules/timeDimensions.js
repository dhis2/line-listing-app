import { DIMENSION_TYPE_PERIOD } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED,
} from './dimensionConstants.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from './programTypes.js'
import { OUTPUT_TYPE_EVENT, OUTPUT_TYPE_ENROLLMENT } from './visualization.js'

const NAME_PARENT_PROPERTY_PROGRAM = 'program'
const NAME_PARENT_PROPERTY_STAGE = 'stage'

export const getTimeDimensions = () => ({
    [DIMENSION_ID_EVENT_DATE]: {
        id: DIMENSION_ID_EVENT_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Event date'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayExecutionDateLabel',
    },
    [DIMENSION_ID_ENROLLMENT_DATE]: {
        id: DIMENSION_ID_ENROLLMENT_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Enrollment date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayEnrollmentDateLabel',
    },
    [DIMENSION_ID_INCIDENT_DATE]: {
        id: DIMENSION_ID_INCIDENT_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Incident date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayIncidentDateLabel',
    },
    [DIMENSION_ID_SCHEDULED_DATE]: {
        id: DIMENSION_ID_SCHEDULED_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Scheduled date'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayDueDateLabel',
    },
    [DIMENSION_ID_LAST_UPDATED]: {
        id: DIMENSION_ID_LAST_UPDATED,
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

export const getDisabledTimeDimensions = (inputType, program, stage) => {
    switch (inputType) {
        case OUTPUT_TYPE_EVENT: {
            const disabledDimensions = {}
            if (program?.programType === PROGRAM_TYPE_WITH_REGISTRATION) {
                if (program.displayIncidentDate === false) {
                    disabledDimensions[DIMENSION_ID_INCIDENT_DATE] = i18n.t(
                        'Disabled by the selected program'
                    )
                }

                if (!stage) {
                    disabledDimensions[DIMENSION_ID_SCHEDULED_DATE] =
                        i18n.t('No stage selected')
                } else if (stage.hideDueDate === true) {
                    disabledDimensions[DIMENSION_ID_SCHEDULED_DATE] = i18n.t(
                        'Disabled by the selected program stage'
                    )
                }
            } else {
                const disabledReason = !program
                    ? i18n.t('No program selected')
                    : i18n.t('Not applicable to event programs')
                disabledDimensions[DIMENSION_ID_ENROLLMENT_DATE] =
                    disabledReason

                disabledDimensions[DIMENSION_ID_INCIDENT_DATE] = disabledReason

                disabledDimensions[DIMENSION_ID_SCHEDULED_DATE] = disabledReason
            }
            return disabledDimensions
        }
        case OUTPUT_TYPE_ENROLLMENT: {
            const disabledDimensions = {}
            disabledDimensions[DIMENSION_ID_EVENT_DATE] = i18n.t(
                'Not applicable to enrollments'
            )

            disabledDimensions[DIMENSION_ID_SCHEDULED_DATE] = i18n.t(
                'Not applicable to enrollments'
            )

            if (!program || program.displayIncidentDate === false) {
                const disabledReason = !program
                    ? i18n.t('No program selected')
                    : i18n.t('Disabled by the selected program')
                disabledDimensions[DIMENSION_ID_INCIDENT_DATE] = disabledReason
            }
            return disabledDimensions
        }
        default: {
            const disabledReason = i18n.t('No input type selected')
            return {
                [DIMENSION_ID_EVENT_DATE]: disabledReason,
                [DIMENSION_ID_ENROLLMENT_DATE]: disabledReason,
                [DIMENSION_ID_SCHEDULED_DATE]: disabledReason,
                [DIMENSION_ID_INCIDENT_DATE]: disabledReason,
                [DIMENSION_ID_LAST_UPDATED]: disabledReason,
            }
        }
    }
}
