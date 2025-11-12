import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import {
    DIMENSION_TYPES_PROGRAM,
    DIMENSION_IDS_TIME,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_CREATED,
} from '../modules/dimensionConstants.js'
import { extractDimensionIdParts } from '../modules/dimensionId.js'
import {
    getDefaultTimeDimensionsMetadata,
    getDynamicTimeDimensionsMetadata,
    getProgramAsMetadata,
    getDefaultOuMetadata,
} from '../modules/metadata.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../modules/programTypes.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../modules/visualization.js'
import { sGetMetadataById } from '../reducers/metadata.js'
import { sGetUiInput, sGetUiProgram } from '../reducers/ui.js'

// Helper function to check if a program is valid for a given input type
const isProgramValidForInputType = (program, inputType) => {
    if (!program) return false

    // Event and Enrollment can use any program
    if (
        inputType === OUTPUT_TYPE_EVENT ||
        inputType === OUTPUT_TYPE_ENROLLMENT
    ) {
        return true
    }

    // Tracked entity requires programs with tracked entity type
    if (inputType === OUTPUT_TYPE_TRACKED_ENTITY) {
        return program.trackedEntityType != null
    }

    return false
}

import {
    ADD_UI_LAYOUT_DIMENSIONS,
    REMOVE_UI_LAYOUT_DIMENSIONS,
    CLEAR_UI_SORTING,
    SET_UI_SORTING,
    SET_UI_DRAGGING_ID,
    SET_UI_LAYOUT,
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
    REMOVE_UI_REPETITION,
    CLEAR_UI_REPETITION,
    SET_UI_INPUT,
    UPDATE_UI_PROGRAM_ID,
    UPDATE_UI_PROGRAM_STAGE_ID,
    CLEAR_UI_PROGRAM,
    CLEAR_UI_STAGE_ID,
    REMOVE_UI_ITEMS,
    sGetUiProgramId,
    sGetUiInputType,
    sGetUiExpandedCards,
    TOGGLE_UI_EXPANDED_VISUALIZATION_CANVAS,
    TOGGLE_UI_SIDEBAR_HIDDEN,
    TOGGLE_UI_LAYOUT_PANEL_HIDDEN,
    SET_UI_ACCESSORY_PANEL_ACTIVE_TAB,
    SET_UI_EXPANDED_CARDS,
    TOGGLE_UI_SPLIT_DATA_CARDS,
    UPDATE_UI_ENTITY_TYPE_ID,
    CLEAR_UI_ENTITY_TYPE,
    SET_UI_ACCESSORY_PANEL_WIDTH,
    SET_UI_MAIN_SIDEBAR_WIDTH,
    SET_UI_DATA_SOURCE,
    SET_UI_OUTPUT,
} from '../reducers/ui.js'

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
    metadata: getDefaultTimeDimensionsMetadata(),
})

export const acClearUiStageId = (metadata) => ({
    type: CLEAR_UI_STAGE_ID,
    metadata,
})

export const acClearUiEntityType = () => ({
    type: CLEAR_UI_ENTITY_TYPE,
    metadata: getDefaultTimeDimensionsMetadata(),
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

export const acUpdateUiEntityTypeId = (value, metadata) => ({
    type: UPDATE_UI_ENTITY_TYPE_ID,
    value,
    metadata,
})

const tClearUiProgramRelatedDimensions = () => (dispatch, getState) => {
    const { ui, metadata } = getState()

    const idsToRemove = ui.layout.columns
        .concat(ui.layout.filters)
        .filter((id) => {
            const dimension = metadata[id]
            const { dimensionId } = extractDimensionIdParts(id)
            const isProgramDataDimension = DIMENSION_TYPES_PROGRAM.has(
                dimension.dimensionType
            )
            const isProgramDimension =
                dimensionId === DIMENSION_ID_PROGRAM_STATUS ||
                dimensionId === DIMENSION_ID_EVENT_STATUS ||
                (dimensionId === DIMENSION_ID_ORGUNIT &&
                    id !== DIMENSION_ID_ORGUNIT) ||
                (DIMENSION_IDS_TIME.has(dimensionId) &&
                    dimensionId !== DIMENSION_ID_LAST_UPDATED) ||
                dimensionId === DIMENSION_ID_CREATED
            return isProgramDataDimension || isProgramDimension
        })

    dispatch(acRemoveUiLayoutDimensions(idsToRemove), idsToRemove)
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
                .filter(
                    (dimensionId) =>
                        dimensionId.includes(`${stageId}.`) ||
                        dimensionId === DIMENSION_ID_SCHEDULED_DATE
                )
            dispatch(acRemoveUiLayoutDimensions(idsToRemove))
            dispatch(acRemoveUiItems(idsToRemove))
        }
    }

export const tSetUiInput = (value) => (dispatch, getState) => {
    const state = getState()
    const currentInput = sGetUiInput(state)
    const currentProgram = sGetUiProgram(state)

    dispatch(acClearUiEntityType())

    // Only clear program if switching to/from tracked entity or if current program is not valid for new input type
    const shouldClearProgram =
        currentInput?.type === OUTPUT_TYPE_TRACKED_ENTITY ||
        value.type === OUTPUT_TYPE_TRACKED_ENTITY ||
        (currentProgram &&
            !isProgramValidForInputType(currentProgram, value.type))

    if (shouldClearProgram) {
        dispatch(acClearUiProgram())
        dispatch(tClearUiProgramRelatedDimensions())
    }

    dispatch(acClearUiRepetition())
    dispatch(
        acSetUiInput(value, {
            ...getDefaultTimeDimensionsMetadata(),
            ...getDefaultOuMetadata(value.type),
        })
    )
}

export const tSetUiProgram =
    ({ program, stage }) =>
    (dispatch, getState) => {
        const state = getState()
        dispatch(acClearUiProgram())
        const inputType = sGetUiInputType(state)
        if (inputType !== OUTPUT_TYPE_TRACKED_ENTITY) {
            dispatch(tClearUiProgramRelatedDimensions())
        }
        program &&
            dispatch(
                acUpdateUiProgramId(program.id, {
                    ...getProgramAsMetadata(program),
                    ...getDynamicTimeDimensionsMetadata(
                        program,
                        stage,
                        inputType
                    ),
                })
            )
        stage && dispatch(acUpdateUiProgramStageId(stage.id))
    }

export const tSetUiEntityType =
    ({ type }) =>
    (dispatch) => {
        dispatch(acClearUiProgram())
        dispatch(tClearUiProgramRelatedDimensions())
        dispatch(acClearUiEntityType())
        dispatch(acUpdateUiEntityTypeId(type.id, { [type.id]: type }))
    }

export const tClearUiStage = () => (dispatch, getState) => {
    const state = getState()
    const program = sGetMetadataById(state, sGetUiProgramId(state))

    dispatch(acClearUiStageId(getDynamicTimeDimensionsMetadata(program)))
}

export const tSetUiStage = (stage) => (dispatch, getState) => {
    const state = getState()
    const program = sGetMetadataById(state, sGetUiProgramId(state))
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

export const acAddUiLayoutDimensions = (value, metadata) => ({
    type: ADD_UI_LAYOUT_DIMENSIONS,
    value,
    metadata,
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

export const acSetUiAccessoryPanelActiveTab = (value) => ({
    type: SET_UI_ACCESSORY_PANEL_ACTIVE_TAB,
    value,
})

export const acSetUiExpandedCards = (value) => ({
    type: SET_UI_EXPANDED_CARDS,
    value,
})

export const acToggleUiExpandedCard = (cardId) => (dispatch, getState) => {
    const currentExpandedCards = sGetUiExpandedCards(getState()) || []
    const isExpanded = currentExpandedCards.includes(cardId)

    if (isExpanded) {
        // Remove the card from expanded list
        const newExpandedCards = currentExpandedCards.filter(
            (id) => id !== cardId
        )
        dispatch(acSetUiExpandedCards(newExpandedCards))
    } else {
        // Add the card to expanded list
        const newExpandedCards = [...currentExpandedCards, cardId]
        dispatch(acSetUiExpandedCards(newExpandedCards))
    }
}

export const acToggleUiSplitDataCards = () => ({
    type: TOGGLE_UI_SPLIT_DATA_CARDS,
})

export const acSetUiAccessoryPanelWidth = (value) => ({
    type: SET_UI_ACCESSORY_PANEL_WIDTH,
    value,
})

export const acSetUiMainSidebarWidth = (value) => ({
    type: SET_UI_MAIN_SIDEBAR_WIDTH,
    value,
})

export const acToggleUiSidebarHidden = () => ({
    type: TOGGLE_UI_SIDEBAR_HIDDEN,
})

export const acToggleUiLayoutPanelHidden = () => ({
    type: TOGGLE_UI_LAYOUT_PANEL_HIDDEN,
})

export const acToggleUiExpandedVisualizationCanvas = () => ({
    type: TOGGLE_UI_EXPANDED_VISUALIZATION_CANVAS,
})

export const acSetShowExpandedLayoutPanel = (value) => ({
    type: SET_UI_EXPANDED_LAYOUT_PANEL,
    value,
})

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

export const acSetUiDataSorting = (value) => ({
    type: SET_UI_SORTING,
    value,
})

export const acClearUiDataSorting = () => ({
    type: CLEAR_UI_SORTING,
})

export const acRemoveUiRepetition = (value) => ({
    type: REMOVE_UI_REPETITION,
    value,
})

export const acClearUiRepetition = () => ({
    type: CLEAR_UI_REPETITION,
})

// Data Source Actions
export const acSetUiDataSource = (value, metadata) => ({
    type: SET_UI_DATA_SOURCE,
    value,
    metadata,
})

export const tSetDataSource =
    ({ type, id, programType, stage, metadata: additionalMetadata }) =>
    (dispatch, getState) => {
        const state = getState()

        // Note: No longer clearing layout when switching data sources
        // This allows users to add dimensions from multiple data sources

        // Set the new data source
        dispatch(
            acSetUiDataSource(
                { type, id, programType },
                additionalMetadata || {}
            )
        )

        // Sync with old state for backward compatibility
        if (type === 'TRACKED_ENTITY_TYPE') {
            // For tracked entity type, set entity type (but don't clear program to allow mixed sources)
            dispatch(acUpdateUiEntityTypeId(id, additionalMetadata || {}))
            // Set input type to tracked entity
            dispatch(acSetUiInput({ type: OUTPUT_TYPE_TRACKED_ENTITY }))
            // Tracked entity data source only supports TRACKED_ENTITY output
            // Always set it to ensure consistency
            dispatch(acSetUiOutput({ type: OUTPUT_TYPE_TRACKED_ENTITY }))
        } else if (type === 'PROGRAM') {
            // For program, set program (but don't clear entity type to allow mixed sources)
            dispatch(acUpdateUiProgramId(id, additionalMetadata || {}))
            // Stage is now optional - only set if explicitly provided
            // (stage selection is no longer required to view dimensions)
            if (stage) {
                dispatch(
                    acUpdateUiProgramStageId(stage.id, additionalMetadata || {})
                )
            } else {
                // Clear any previously selected stage
                dispatch(acClearUiStageId())
            }
            // Set input type to Event by default for backward compatibility
            dispatch(acSetUiInput({ type: OUTPUT_TYPE_EVENT }))
            // For programs, preserve the output type if it's valid for this program type
            // Otherwise default to EVENT
            const state = getState()
            const currentOutput = state.ui.output?.type

            // Determine valid outputs for this program type
            const validOutputs =
                programType === PROGRAM_TYPE_WITH_REGISTRATION
                    ? [
                          OUTPUT_TYPE_EVENT,
                          OUTPUT_TYPE_ENROLLMENT,
                          OUTPUT_TYPE_TRACKED_ENTITY,
                      ]
                    : [OUTPUT_TYPE_EVENT]

            // If current output is not valid for this program, reset to EVENT
            if (!currentOutput || !validOutputs.includes(currentOutput)) {
                dispatch(acSetUiOutput({ type: OUTPUT_TYPE_EVENT }))
            }
            // Otherwise keep the current output type
        }
    }

// Output Actions
export const acSetUiOutput = (value) => ({
    type: SET_UI_OUTPUT,
    value,
})

export const tSetUiOutput = (outputType) => (dispatch) => {
    // Set the new output type
    dispatch(acSetUiOutput({ type: outputType }))

    // Sync with old inputType for backward compatibility
    // Note: Dimension components should derive their inputType from dataSource
    // instead of reading this directly to avoid unnecessary re-fetches
    dispatch(acSetUiInput({ type: outputType }))
}
