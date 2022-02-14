import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../components/MainSidebar/ProgramDimensionsPanel/ProgramDimensionsPanel.js'
import {
    DIMENSION_TYPE_EVENT_DATE,
    DIMENSION_TYPE_ENROLLMENT_DATE,
    DIMENSION_TYPE_INCIDENT_DATE,
    DIMENSION_TYPE_SCHEDULED_DATE,
    DIMENSION_TYPE_LAST_UPDATED,
} from './dimensionTypes.js'
import { OUTPUT_TYPE_EVENT } from './visualization.js'

export const NAME_PARENT_PROPERTY_PROGRAM = 'program'
const NAME_PARENT_PROPERTY_STAGE = 'stage'

export const getTimeDimensions = () => ({
    [DIMENSION_TYPE_EVENT_DATE]: {
        id: DIMENSION_TYPE_EVENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        name: i18n.t('Date of registration'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayExecutionDateLabel',
    },
    [DIMENSION_TYPE_ENROLLMENT_DATE]: {
        id: DIMENSION_TYPE_ENROLLMENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        name: i18n.t('Tracking date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayEnrollmentDateLabel',
    },
    [DIMENSION_TYPE_INCIDENT_DATE]: {
        id: DIMENSION_TYPE_INCIDENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        name: i18n.t('Test date'),
        nameParentProperty: NAME_PARENT_PROPERTY_PROGRAM,
        nameProperty: 'displayIncidentDateLabel',
    },
    [DIMENSION_TYPE_SCHEDULED_DATE]: {
        id: DIMENSION_TYPE_SCHEDULED_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        name: i18n.t('Due/Scheduled date'),
        nameParentProperty: NAME_PARENT_PROPERTY_STAGE,
        nameProperty: 'displayDueDateLabel',
    },
    [DIMENSION_TYPE_LAST_UPDATED]: {
        id: DIMENSION_TYPE_LAST_UPDATED,
        dimensionType: DIMENSION_ID_PERIOD,
        name: i18n.t('Last updated on'),
    },
})

export const getDefaulTimeDimensionsMetadata = () => {
    return Object.values(getTimeDimensions()).reduce(
        (acc, { id, name, dimensionType }) => {
            acc[id] = {
                id,
                name,
                dimensionType,
            }
            return acc
        },
        {}
    )
}

export const getTimeDimensionName = (dimension, program, stage) => {
    if (!dimension.nameParentProperty || !program || !stage) {
        return dimension.name
    }
    const name =
        dimension.nameParentProperty === NAME_PARENT_PROPERTY_PROGRAM
            ? program[dimension.nameProperty]
            : stage[dimension.nameProperty]

    return name || dimension.name
}

export const getEnabledTimeDimensionIds = (inputType, program, stage) => {
    const enabledDimensionIds = new Set()
    if (inputType && program?.programType && stage?.id) {
        const isEvent = inputType === OUTPUT_TYPE_EVENT
        const withRegistration =
            program.programType === PROGRAM_TYPE_WITH_REGISTRATION

        if (isEvent) {
            enabledDimensionIds.add(DIMENSION_TYPE_EVENT_DATE)
        }

        if (withRegistration) {
            enabledDimensionIds.add(DIMENSION_TYPE_ENROLLMENT_DATE)

            isEvent &&
                !stage.hideDueDate &&
                enabledDimensionIds.add(DIMENSION_TYPE_SCHEDULED_DATE)

            program.displayIncidentDate &&
                enabledDimensionIds.add(DIMENSION_TYPE_INCIDENT_DATE)
        }

        if (isEvent || withRegistration) {
            enabledDimensionIds.add(DIMENSION_TYPE_LAST_UPDATED)
        }
    }
    return enabledDimensionIds
}
