import { sGetRootOrgUnits } from '../reducers/settings.js'
import {
    ADD_UI_LAYOUT_DIMENSIONS,
    REMOVE_UI_LAYOUT_DIMENSIONS,
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
    UPDATE_UI_PROGRAM_STAGE,
    CLEAR_UI_PROGRAM,
} from '../reducers/ui.js'

export const acSetUiInput = (value) => ({
    type: SET_UI_INPUT,
    value,
})

export const acClearUiProgram = () => ({
    type: CLEAR_UI_PROGRAM,
})

export const acUpdateUiProgramId = (value) => ({
    type: UPDATE_UI_PROGRAM_ID,
    value,
})

export const acUpdateUiProgramStage = (value) => ({
    type: UPDATE_UI_PROGRAM_STAGE,
    value,
})

export const tSetUiProgram = (programId, stageId) => async (dispatch) => {
    dispatch(acClearUiProgram())
    programId && dispatch(acUpdateUiProgramId(programId))
    stageId && dispatch(acUpdateUiProgramStage(stageId))
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

export const acSetUiLayout = (value) => ({
    type: SET_UI_LAYOUT,
    value,
})

export const acSetUiFromVisualization = (value) => ({
    type: SET_UI_FROM_VISUALIZATION,
    value,
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

export const acSetUiItems = (value) => ({
    type: SET_UI_ITEMS,
    value,
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
