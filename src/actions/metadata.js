import defaultMetadata from '../modules/metadata.js'
import {
    getTimeDimensions,
    getTimeDimensionName,
} from '../modules/timeDimensions.js'
import { ADD_METADATA, sGetMetadataById } from '../reducers/metadata.js'
import { sGetRootOrgUnits } from '../reducers/settings.js'
import { sGetUiProgramId, sGetUiProgramStageId } from '../reducers/ui.js'

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

export const tUpdateTimeDimensionsMetadataNames =
    () => (dispatch, getState) => {
        const state = getState()
        const programId = sGetUiProgramId(state)
        const stageId = sGetUiProgramStageId(state)
        const program = sGetMetadataById(state, programId) || {}
        const stage = sGetMetadataById(state, stageId) || {}
        const dimensionsMetadata = Object.values(getTimeDimensions()).reduce(
            (acc, dimension) => {
                acc[dimension.id] = {
                    ...dimension,
                    name: getTimeDimensionName(dimension, program, stage),
                }
                return acc
            },
            {}
        )

        dispatch(acAddMetadata(dimensionsMetadata))
    }
