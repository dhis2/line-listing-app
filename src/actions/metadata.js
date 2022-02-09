import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../components/MainSidebar/ProgramDimensionsPanel/ProgramDimensionsPanel.js'
import {
    DIMENSION_TYPE_EVENT_DATE,
    DIMENSION_TYPE_ENROLLMENT_DATE,
    DIMENSION_TYPE_INCIDENT_DATE,
    DIMENSION_TYPE_SCHEDULED_DATE,
    DIMENSION_TYPE_LAST_UPDATED,
} from '../modules/dimensionTypes.js'
import defaultMetadata, {
    getTimeDimensions,
    NAME_PARENT_PROPERTY_PROGRAM,
} from '../modules/metadata.js'
import { OUTPUT_TYPE_EVENT } from '../modules/visualization.js'
import { ADD_METADATA, sGetMetadataById } from '../reducers/metadata.js'
import { sGetRootOrgUnits } from '../reducers/settings.js'
import {
    sGetUiInputType,
    sGetUiProgramId,
    sGetUiProgramStageId,
} from '../reducers/ui.js'

export const acAddMetadata = (value) => ({
    type: ADD_METADATA,
    value,
})

export const tSetInitMetadata = () => (dispatch, getState) => {
    const metaData = { ...defaultMetadata() }
    const rootOrgUnits = sGetRootOrgUnits(getState())

    rootOrgUnits.forEach((rootOrgUnit) => {
        if (rootOrgUnit.id) {
            metaData[rootOrgUnit.id] = {
                ...rootOrgUnit,
                path: `/${rootOrgUnit.id}`,
            }
        }
    })

    dispatch(acAddMetadata(metaData))
}

const getName = (dimension, program, stage) => {
    if (!dimension.nameParentProperty) {
        return dimension.name
    }
    const name =
        dimension.nameParentProperty === NAME_PARENT_PROPERTY_PROGRAM
            ? program[dimension.nameProperty]
            : stage[dimension.nameProperty]
    return name || dimension.name
}

export const tSetTimeDimensionsMetadata = () => (dispatch, getState) => {
    const state = getState()

    const inputType = sGetUiInputType(state)
    const programId = sGetUiProgramId(state)
    const stageId = sGetUiProgramStageId(state)
    const program = sGetMetadataById(state, programId) || {}
    const stage = sGetMetadataById(state, stageId) || {}

    const timeDimensions = getTimeDimensions()
    const dimensionIds = Object.keys(timeDimensions)
    const enabledDimensionIds = []

    if (inputType && program.programType && stage.id) {
        const isEvent = inputType === OUTPUT_TYPE_EVENT
        const withRegistration =
            program.programType === PROGRAM_TYPE_WITH_REGISTRATION

        if (isEvent) {
            enabledDimensionIds.push(DIMENSION_TYPE_EVENT_DATE)
        }

        if (withRegistration) {
            enabledDimensionIds.push(DIMENSION_TYPE_ENROLLMENT_DATE)

            isEvent &&
                !stage.hideDueDate &&
                enabledDimensionIds.push(DIMENSION_TYPE_SCHEDULED_DATE)

            program.displayIncidentDate &&
                enabledDimensionIds.push(DIMENSION_TYPE_INCIDENT_DATE)
        }

        if (isEvent || withRegistration) {
            enabledDimensionIds.push(DIMENSION_TYPE_LAST_UPDATED)
        }
    }

    const dimensionsArr = dimensionIds.map((dimensionId) => ({
        id: dimensionId,
        dimensionType: DIMENSION_ID_PERIOD,
        name: getName(timeDimensions[dimensionId], program, stage),
        // selected: getIsDimensionSelected(dimensionId),
        disabled: !enabledDimensionIds.includes(dimensionId),
        //optionSet
        //valueType
    }))

    const dimensionsMetadata = dimensionsArr.reduce(
        (metadata, { id, name, disabled }) => {
            metadata[id] = {
                id,
                name,
                dimensionType: DIMENSION_ID_PERIOD,
                disabled,
            }
            return metadata
        },
        {}
    )

    dispatch(acAddMetadata(dimensionsMetadata))
}
