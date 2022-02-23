import { DIMENSION_TYPES_PROGRAM } from '../modules/dimensionTypes.js'
import {
    getDefaulTimeDimensionsMetadata,
    getDynamicTimeDimensionsMetadata,
    getProgramAsMetadata,
} from '../modules/metadata.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../modules/programTypes.js'
import { OUTPUT_TYPE_EVENT } from '../modules/visualization.js'
import { sGetRootOrgUnits } from '../reducers/settings.js'
import {
    ADD_UI_LAYOUT_DIMENSIONS,
    REMOVE_UI_LAYOUT_DIMENSIONS,
    SET_UI_DRAGGING_ID,
    SET_UI_LAYOUT,
    SET_UI_OPTION,
    SET_UI_OPTIONS,
    SET_UI_FROM_VISUALIZATION,
    CLEAR_UI,
    SET_UI_DETAILS_PANEL_OPEN,
    SET_UI_ACCESSORY_PANEL_OPEN,
    SET_UI_EXPANDED_LAYOUT_PANEL,
    SET_UI_ACTIVE_MODAL_DIALOG,
    SET_UI_ITEMS,
    ADD_UI_PARENT_GRAPH_MAP,
    SET_UI_CONDITIONS,
    SET_UI_REPETITION,
    SET_UI_INPUT,
    UPDATE_UI_PROGRAM_ID,
    UPDATE_UI_PROGRAM_STAGE_ID,
    CLEAR_UI_PROGRAM,
    CLEAR_UI_STAGE_ID,
    REMOVE_UI_ITEMS,
    sGetUiProgramId,
    sGetUiInputType,
} from '../reducers/ui.js'
import { sGetMetadataById } from '../reducers/metadata.js'

export const acSetUiDraggingId = (value) => ({
    type: SET_UI_DRAGGING_ID,
    value,
})

export const acSetUiInput = (value, metadata) => ({
    type: SET_UI_INPUT,
    value,
    metadata,
})

export const acClearUiProgram = () => ({
    type: CLEAR_UI_PROGRAM,
    metadata: getDefaulTimeDimensionsMetadata(),
})

export const acClearUiStageId = (metadata) => ({
    type: CLEAR_UI_STAGE_ID,
    metadata,
})

export const acUpdateUiProgramId = (value, metadata) => ({
    type: UPDATE_UI_PROGRAM_ID,
    value,
    metadata,
})

export const acUpdateUiProgramStageId = (value, metadata) => ({
    type: UPDATE_UI_PROGRAM_STAGE_ID,
    value,
    metadata,
})

const tClearUiProgramDimensions = () => (dispatch, getState) => {
    const { ui, metadata } = getState()
    const idsToRemove = ui.layout.columns
        .concat(ui.layout.filters)
        .filter((dimensionId) =>
            DIMENSION_TYPES_PROGRAM.has(metadata[dimensionId].dimensionType)
        )
    dispatch(acRemoveUiLayoutDimensions(idsToRemove))
    dispatch(acRemoveUiItems(idsToRemove))
}

export const tClearUiProgramStageDimensions =
    (stageId) => (dispatch, getState) => {
        const state = getState()
        const program = sGetMetadataById(state, sGetUiProgramId(state))
        const needsClearing =
            sGetUiInputType(state) === OUTPUT_TYPE_EVENT &&
            program.programType === PROGRAM_TYPE_WITH_REGISTRATION

        if (needsClearing) {
            const idsToRemove = state.ui.layout.columns
                .concat(state.ui.layout.filters)
                .filter((id) => id.includes(`${stageId}.`))
            dispatch(acRemoveUiLayoutDimensions(idsToRemove))
            dispatch(acRemoveUiItems(idsToRemove))
        }
    }

export const tSetUiInput = (value) => (dispatch) => {
    dispatch(acClearUiProgram())
    dispatch(tClearUiProgramDimensions())
    dispatch(acSetUiInput(value, getDefaulTimeDimensionsMetadata()))
}

export const tSetUiProgram =
    ({ program, stage }) =>
    (dispatch) => {
        dispatch(acClearUiProgram())
        dispatch(tClearUiProgramDimensions())
        program &&
            dispatch(
                acUpdateUiProgramId(program.id, {
                    ...getProgramAsMetadata(program),
                    ...getDynamicTimeDimensionsMetadata(program, stage),
                })
            )
        stage && dispatch(acUpdateUiProgramStageId(stage.id))
    }

export const tClearUiStage = () => (dispatch, getState) => {
    const state = getState()
    const program = state.metadata[state.ui.program.id]

    dispatch(acClearUiStageId(getDynamicTimeDimensionsMetadata(program)))
}

export const tSetUiStage = (stage) => (dispatch, getState) => {
    const state = getState()
    const program = state.metadata[state.ui.program.id]
    dispatch(
        acUpdateUiProgramStageId(
            stage.id,
            getDynamicTimeDimensionsMetadata(program, stage)
        )
    )
}

export const acSetUiOptions = (value) => ({
    type: SET_UI_OPTIONS,
    value,
})

export const acSetUiOption = (value) => ({
    type: SET_UI_OPTION,
    value,
})

export const acAddUiLayoutDimensions = (value) => ({
    type: ADD_UI_LAYOUT_DIMENSIONS,
    value,
})

export const acRemoveUiLayoutDimensions = (value) => ({
    type: REMOVE_UI_LAYOUT_DIMENSIONS,
    value,
})

export const acRemoveUiItems = (value) => ({
    type: REMOVE_UI_ITEMS,
    value,
})

export const acSetUiLayout = (value) => ({
    type: SET_UI_LAYOUT,
    value,
})

export const acSetUiFromVisualization = (value, metadata) => ({
    type: SET_UI_FROM_VISUALIZATION,
    value,
    metadata,
})

export const acClearUi = (value) => ({
    type: CLEAR_UI,
    value,
})

export const acSetUiDetailsPanelOpen = (value) => ({
    type: SET_UI_DETAILS_PANEL_OPEN,
    value,
})

export const acSetUiAccessoryPanelOpen = (value) => ({
    type: SET_UI_ACCESSORY_PANEL_OPEN,
    value,
})

export const acSetShowExpandedLayoutPanel = (value) => ({
    type: SET_UI_EXPANDED_LAYOUT_PANEL,
    value,
})

export const tClearUi = () => (dispatch, getState) => {
    const rootOrgUnits = sGetRootOrgUnits(getState())

    dispatch(
        acClearUi({
            rootOrgUnits,
        })
    )
}

export const acSetUiOpenDimensionModal = (value, metadata) => ({
    type: SET_UI_ACTIVE_MODAL_DIALOG,
    value,
    metadata,
})

export const acSetUiItems = (value, metadata) => ({
    type: SET_UI_ITEMS,
    value,
    metadata,
})

export const acAddParentGraphMap = (value) => ({
    type: ADD_UI_PARENT_GRAPH_MAP,
    value,
})

export const acSetUiConditions = (value) => ({
    type: SET_UI_CONDITIONS,
    value,
})

export const acSetUiRepetition = (value) => ({
    type: SET_UI_REPETITION,
    value,
})
