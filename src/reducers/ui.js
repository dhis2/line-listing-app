/*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/
import {
    DIMENSION_ID_ORGUNIT,
    USER_ORG_UNIT,
    VIS_TYPE_LINE_LIST,
} from '@dhis2/analytics'
import { useMemo } from 'react'
import { useStore, useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
} from '../modules/dimensionConstants.js'
import {
    formatDimensionId,
    extractDimensionIdParts,
} from '../modules/dimensionId.js'
import { getFilteredLayout } from '../modules/layout.js'
import { getMainDimensions } from '../modules/mainDimensions.js'
import { getOptionsForUi } from '../modules/options.js'
import {
    getIsProgramDimensionDisabled,
    getProgramDimensions,
} from '../modules/programDimensions.js'
import { getHiddenTimeDimensions } from '../modules/timeDimensions.js'
import {
    getAdaptedUiByType,
    getUiFromVisualization,
    getUserSidebarWidth,
} from '../modules/ui.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../modules/visualization.js'
import { sGetMetadata, sGetMetadataById } from './metadata.js'

export const SET_UI_DRAGGING_ID = 'SET_UI_DRAGGING_ID'
export const SET_UI_INPUT = 'SET_UI_INPUT'
export const CLEAR_UI_PROGRAM = 'CLEAR_UI_PROGRAM'
export const CLEAR_UI_STAGE_ID = 'CLEAR_UI_STAGE_ID'
export const CLEAR_UI_ENTITY_TYPE = 'CLEAR_UI_ENTITY_TYPE'
export const UPDATE_UI_PROGRAM_ID = 'UPDATE_UI_PROGRAM_ID'
export const UPDATE_UI_PROGRAM_STAGE_ID = 'UPDATE_UI_PROGRAM_STAGE_ID'
export const UPDATE_UI_ENTITY_TYPE_ID = 'UPDATE_UI_ENTITY_TYPE_ID'
export const SET_UI_OPTIONS = 'SET_UI_OPTIONS'
export const ADD_UI_LAYOUT_DIMENSIONS = 'ADD_UI_LAYOUT_DIMENSIONS'
export const REMOVE_UI_LAYOUT_DIMENSIONS = 'REMOVE_UI_LAYOUT_DIMENSIONS'
export const SET_UI_LAYOUT = 'SET_UI_LAYOUT'
export const SET_UI_FROM_VISUALIZATION = 'SET_UI_FROM_VISUALIZATION'
export const CLEAR_UI = 'CLEAR_UI'
export const SET_UI_DETAILS_PANEL_OPEN = 'SET_UI_DETAILS_PANEL_OPEN'
export const SET_UI_ACCESSORY_PANEL_OPEN = 'SET_UI_ACCESSORY_PANEL_OPEN'
export const SET_UI_ACCESSORY_PANEL_WIDTH = 'SET_UI_ACCESSORY_PANEL_WIDTH'
export const SET_UI_MAIN_SIDEBAR_WIDTH = 'SET_UI_MAIN_SIDEBAR_WIDTH'
export const SET_UI_ACCESSORY_PANEL_ACTIVE_TAB =
    'SET_UI_ACCESSORY_PANEL_ACTIVE_TAB'
export const SET_UI_EXPANDED_CARDS = 'SET_UI_EXPANDED_CARDS'
export const TOGGLE_UI_SPLIT_DATA_CARDS = 'TOGGLE_UI_SPLIT_DATA_CARDS'
export const SET_UI_EXPANDED_LAYOUT_PANEL = 'SET_UI_EXPANDED_LAYOUT_PANEL'
export const TOGGLE_UI_EXPANDED_VISUALIZATION_CANVAS =
    'TOGGLE_UI_EXPANDED_VISUALIZATION_CANVAS'
export const TOGGLE_UI_SIDEBAR_HIDDEN = 'TOGGLE_UI_SIDEBAR_HIDDEN'
export const TOGGLE_UI_LAYOUT_PANEL_HIDDEN = 'TOGGLE_UI_LAYOUT_PANEL_HIDDEN'
export const SET_UI_ACTIVE_MODAL_DIALOG = 'SET_UI_ACTIVE_MODAL_DIALOG'
export const SET_UI_ITEMS = 'SET_UI_ITEMS'
export const REMOVE_UI_ITEMS = 'REMOVE_UI_ITEMS'
export const ADD_UI_PARENT_GRAPH_MAP = 'ADD_UI_PARENT_GRAPH_MAP'
export const SET_UI_CONDITIONS = 'SET_UI_CONDITIONS'
export const SET_UI_REPETITION = 'SET_UI_REPETITION'
export const REMOVE_UI_REPETITION = 'REMOVE_UI_REPETITION'
export const CLEAR_UI_REPETITION = 'CLEAR_UI_REPETITION'
export const SET_UI_SORTING = 'SET_UI_SORTING'
export const CLEAR_UI_SORTING = 'CLEAR_UI_SORTING'

const DEFAULT_CONDITIONS = {}
const DEFAULT_DIMENSION_CONDITIONS = {}
const DEFAULT_DIMENSION_ITEMS = []

const EMPTY_UI = {
    draggingId: null,
    type: VIS_TYPE_LINE_LIST,
    input: {
        type: OUTPUT_TYPE_EVENT,
    },
    program: {
        id: undefined,
        stageId: undefined,
    },
    entityType: { id: undefined },
    layout: {
        columns: [],
        filters: [],
    },
    itemsByDimension: {},
    accessoryPanelWidth: getUserSidebarWidth(),
    mainSidebarWidth: 400,
    options: {},
    parentGraphMap: {},
    repetitionByDimension: {},
    conditions: DEFAULT_CONDITIONS,
    expandedCards: [],
    splitDataCards: true,
}

export const DEFAULT_UI = {
    draggingId: null,
    type: VIS_TYPE_LINE_LIST,
    input: {
        type: OUTPUT_TYPE_EVENT,
    },
    program: {},
    entityType: {},
    layout: {
        // TODO: Populate the layout with the correct default dimensions, these are just temporary for testing
        columns: [DIMENSION_ID_ORGUNIT],
        filters: [],
    },
    itemsByDimension: {
        [DIMENSION_ID_ORGUNIT]: [],
        [DIMENSION_ID_EVENT_STATUS]: [],
        [DIMENSION_ID_PROGRAM_STATUS]: [],
    },
    options: getOptionsForUi(),
    showAccessoryPanel: true,
    accessoryPanelActiveTab: 'INPUT',
    expandedCards: [
        'PROGRAM',
        'TRACKED_ENTITY',
        'MAIN_DIMENSIONS',
        'YOUR',
        'PROGRAM_DIMENSIONS',
    ],
    splitDataCards: true,
    accessoryPanelWidth: getUserSidebarWidth(),
    mainSidebarWidth: 400,
    showDetailsPanel: false,
    showExpandedLayoutPanel: false,
    hideMainSideBar: false,
    hideLayoutPanel: false,
    activeModalDialog: null,
    parentGraphMap: {},
    repetitionByDimension: {},
    conditions: DEFAULT_CONDITIONS,
}

const getPreselectedUi = (options) => {
    const { rootOrgUnits, digitGroupSeparator } = options

    const rootOrgUnitIds = rootOrgUnits
        .filter((root) => root.id)
        .map((root) => root.id)
    const parentGraphMap = { ...DEFAULT_UI.parentGraphMap }

    rootOrgUnitIds.forEach((id) => {
        parentGraphMap[id] = ''
    })

    return {
        ...DEFAULT_UI,
        options: {
            ...DEFAULT_UI.options,
            digitGroupSeparator,
        },
        itemsByDimension: {
            ...DEFAULT_UI.itemsByDimension,
            [DIMENSION_ID_ORGUNIT]: [USER_ORG_UNIT],
        },
        parentGraphMap,
    }
}

export default (state = EMPTY_UI, action) => {
    switch (action.type) {
        case SET_UI_SORTING: {
            return { ...state, sorting: action.value }
        }
        case CLEAR_UI_SORTING: {
            return { ...state, sorting: undefined }
        }
        case SET_UI_DRAGGING_ID: {
            return { ...state, draggingId: action.value }
        }
        case SET_UI_INPUT: {
            return {
                ...state,
                input: action.value,
            }
        }
        case CLEAR_UI_PROGRAM: {
            return {
                ...state,
                program: EMPTY_UI.program,
            }
        }
        case CLEAR_UI_STAGE_ID: {
            return {
                ...state,
                program: {
                    id: state.program.id,
                    stageId: undefined,
                },
            }
        }
        case CLEAR_UI_ENTITY_TYPE: {
            return {
                ...state,
                entityType: EMPTY_UI.entityType,
            }
        }
        case UPDATE_UI_PROGRAM_ID: {
            return {
                ...state,
                program: {
                    ...state.program,
                    id: action.value,
                },
            }
        }
        case UPDATE_UI_PROGRAM_STAGE_ID: {
            return {
                ...state,
                program: {
                    ...state.program,
                    stageId: action.value,
                },
            }
        }
        case UPDATE_UI_ENTITY_TYPE_ID: {
            return {
                ...state,
                entityType: {
                    ...state.entityType,
                    id: action.value,
                },
            }
        }
        case SET_UI_OPTIONS: {
            return {
                ...state,
                options: {
                    ...state.options,
                    ...action.value,
                },
            }
        }
        // action.value: transfer object (dimensionId:axisId) saying what to add where: { ou: 'rows' }
        // Reducer takes care of swapping (retransfer) if dimension already exists in layout
        case ADD_UI_LAYOUT_DIMENSIONS: {
            const transfers = {
                ...action.value,
            }

            let newLayout = state.layout

            // Add dimension ids to destination (axisId === null means remove from layout)
            Object.entries(transfers).forEach(
                ([dimensionId, { axisId, index }]) => {
                    if (newLayout[axisId]) {
                        // Filter out transferred dimension id (remove from source)
                        newLayout = getFilteredLayout(newLayout, [dimensionId])
                        if (index === null || index === undefined) {
                            newLayout[axisId].push(dimensionId)
                        } else {
                            newLayout[axisId].splice(index, 0, dimensionId)
                        }
                    }
                }
            )

            return {
                ...state,
                layout: newLayout,
            }
        }
        case REMOVE_UI_LAYOUT_DIMENSIONS: {
            return {
                ...state,
                layout: getFilteredLayout(state.layout, action.value),
            }
        }
        case SET_UI_FROM_VISUALIZATION: {
            return getAdaptedUiByType(
                getUiFromVisualization(action.value, state)
            )
        }
        case SET_UI_LAYOUT: {
            return {
                ...state,
                layout: {
                    ...action.value,
                },
            }
        }
        case SET_UI_DETAILS_PANEL_OPEN: {
            return {
                ...state,
                showDetailsPanel: action.value,
                /*
                 * Always close left sidebar when opening the right sidebar
                 * Leave left sidebar unaffected when closing the right sidebar
                 */
                showAccessoryPanel: action.value
                    ? false
                    : state.showAccessoryPanel,
            }
        }
        case SET_UI_ACCESSORY_PANEL_OPEN: {
            return {
                ...state,
                showAccessoryPanel: action.value,
                /*
                 * Always close right sidebar when opening the left sidebar
                 * Leave right sidebar unaffected when closing the left sidebar
                 */
                showDetailsPanel: action.value ? false : state.showDetailsPanel,
            }
        }
        case SET_UI_ACCESSORY_PANEL_WIDTH: {
            return {
                ...state,
                accessoryPanelWidth: action.value,
            }
        }
        case SET_UI_MAIN_SIDEBAR_WIDTH: {
            return {
                ...state,
                mainSidebarWidth: action.value,
            }
        }
        case SET_UI_ACCESSORY_PANEL_ACTIVE_TAB: {
            return {
                ...state,
                accessoryPanelActiveTab: action.value,
            }
        }
        case SET_UI_EXPANDED_CARDS: {
            return {
                ...state,
                expandedCards: action.value,
            }
        }
        case TOGGLE_UI_SPLIT_DATA_CARDS: {
            return {
                ...state,
                splitDataCards: !state.splitDataCards,
            }
        }
        case TOGGLE_UI_SIDEBAR_HIDDEN: {
            return { ...state, hideMainSideBar: !state.hideMainSideBar }
        }
        case TOGGLE_UI_LAYOUT_PANEL_HIDDEN: {
            return { ...state, hideLayoutPanel: !state.hideLayoutPanel }
        }
        case TOGGLE_UI_EXPANDED_VISUALIZATION_CANVAS: {
            // Toggle both to `true` unless both already are
            const nextValue = !(state.hideMainSideBar && state.hideLayoutPanel)
            return {
                ...state,
                hideMainSideBar: nextValue,
                hideLayoutPanel: nextValue,
            }
        }
        case SET_UI_EXPANDED_LAYOUT_PANEL: {
            return { ...state, showExpandedLayoutPanel: action.value }
        }
        case CLEAR_UI: {
            return getPreselectedUi(action.value)
        }
        case SET_UI_ACTIVE_MODAL_DIALOG: {
            return {
                ...state,
                activeModalDialog: action.value || DEFAULT_UI.activeModalDialog,
            }
        }
        case SET_UI_ITEMS: {
            const { dimensionId, itemIds } = action.value

            return {
                ...state,
                itemsByDimension: {
                    ...state.itemsByDimension,
                    [dimensionId]: itemIds,
                },
            }
        }
        case REMOVE_UI_ITEMS: {
            const idsToRemove = new Set(action.value)

            return {
                ...state,
                itemsByDimension: Object.entries(state.itemsByDimension).reduce(
                    (acc, [id, items]) => {
                        if (!idsToRemove.has(id)) {
                            acc[id] = items
                        }
                        return acc
                    },
                    {}
                ),
            }
        }
        case ADD_UI_PARENT_GRAPH_MAP: {
            return {
                ...state,
                parentGraphMap: {
                    ...state.parentGraphMap,
                    ...action.value,
                },
            }
        }
        case SET_UI_CONDITIONS: {
            const { dimension, inputCondition, legendSet } = action.value
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [dimension]:
                        inputCondition.length || legendSet
                            ? { condition: inputCondition, legendSet }
                            : undefined,
                },
            }
        }
        case SET_UI_REPETITION: {
            const { dimensionId, repetition } = action.value

            return {
                ...state,
                repetitionByDimension: {
                    ...state.repetitionByDimension,
                    [dimensionId]: repetition,
                },
            }
        }
        case REMOVE_UI_REPETITION: {
            const {
                [action.value]: removedProperty,
                ...repetitionByDimension
            } = { ...state.repetitionByDimension }

            return {
                ...state,
                repetitionByDimension,
            }
        }
        case CLEAR_UI_REPETITION: {
            return {
                ...state,
                repetitionByDimension: EMPTY_UI.repetitionByDimension,
            }
        }
        default:
            return state
    }
}

// Selectors

export const sGetUi = (state) => state.ui
export const sGetUiDraggingId = (state) => sGetUi(state).draggingId
export const sGetUiType = (state) => sGetUi(state).type
export const sGetUiInput = (state) => sGetUi(state).input
export const sGetUiProgram = (state) => sGetUi(state).program
export const sGetUiEntityType = (state) => sGetUi(state).entityType
export const sGetUiLayout = (state) => sGetUi(state).layout
export const sGetUiItems = (state) => sGetUi(state).itemsByDimension
export const sGetUiOptions = (state) => sGetUi(state).options
export const sGetUiParentGraphMap = (state) => sGetUi(state).parentGraphMap
export const sGetUiRepetition = (state) =>
    sGetUi(state).repetitionByDimension || {}
export const sGetUiConditions = (state) =>
    sGetUi(state).conditions || DEFAULT_CONDITIONS

// TODO - should these props have empty values in the DEFAULT_UI and EMPTY_UI?
export const sGetUiShowDetailsPanel = (state) => sGetUi(state).showDetailsPanel
export const sGetUiShowAccessoryPanel = (state) =>
    sGetUi(state).showAccessoryPanel
export const sGetUiAccessoryPanelActiveTab = (state) =>
    sGetUi(state).accessoryPanelActiveTab
export const sGetUiExpandedCards = (state) => sGetUi(state).expandedCards
export const sGetUiSplitDataCards = (state) => sGetUi(state).splitDataCards
export const sGetUiAccessoryPanelWidth = (state) =>
    sGetUi(state).accessoryPanelWidth
export const sGetUiMainSidebarWidth = (state) => sGetUi(state).mainSidebarWidth
export const sGetUiShowExpandedLayoutPanel = (state) =>
    sGetUi(state).showExpandedLayoutPanel
export const sGetUiSidebarHidden = (state) =>
    sGetUi(state).hideMainSideBar ?? false
export const sGetUiLayoutPanelHidden = (state) =>
    sGetUi(state).hideLayoutPanel ?? false
export const sGetUiShowExpandedVisualizationCanvas = (state) =>
    sGetUiSidebarHidden(state) && sGetUiLayoutPanelHidden(state)
export const sGetUiActiveModalDialog = (state) =>
    sGetUi(state).activeModalDialog

// Selectors level 2

export const sGetUiInputType = (state) => sGetUiInput(state).type

export const sGetUiProgramId = (state) => sGetUiProgram(state).id
export const sGetUiProgramStageId = (state) => sGetUiProgram(state).stageId
export const sGetUiEntityTypeId = (state) => sGetUiEntityType(state)?.id

export const sGetUiItemsByDimension = (state, dimension) =>
    sGetUiItems(state)[dimension] ||
    DEFAULT_UI.itemsByDimension[dimension] ||
    DEFAULT_DIMENSION_ITEMS

export const sGetDimensionIdsFromLayout = (state) =>
    Object.values(sGetUiLayout(state)).reduce(
        (ids, axisDimensionIds) => ids.concat(axisDimensionIds),
        []
    )

export const sGetUiDimensionIdsByAxisId = (state, axisId) =>
    sGetUiLayout(state)[axisId]

export const sGetUiConditionsByDimension = (state, dimension) =>
    sGetUiConditions(state)[dimension] || DEFAULT_DIMENSION_CONDITIONS

export const sGetUiRepetitionByDimension = (state, dimensionId) =>
    sGetUiRepetition(state)[dimensionId]

export const renderChipsSelector = createSelector(
    // only render chips when all have names (from metadata) available
    [sGetUiLayout, sGetMetadata],
    (layout, metadata) => {
        const layoutItems = Object.values(layout || {}).flat()
        const dataObjects = [...Object.values(metadata || {})] // TODO: Refactor to not use the whole metadata list

        return layoutItems.every((item) =>
            dataObjects.some((data) => data.id === item)
        )
    }
)

// Selector based hooks
export const useMainDimensions = () => {
    const inputType = useSelector(sGetUiInputType)
    return Object.values(getMainDimensions(inputType))
}

export const useProgramDimensions = () => {
    const store = useStore()
    const inputType = useSelector(sGetUiInputType)
    const programId = useSelector(sGetUiProgramId)
    const programStageId = useSelector(sGetUiProgramStageId)

    const getId = (dimensionId) =>
        formatDimensionId({
            dimensionId,
            programId,
            outputType: inputType,
        })

    const eventDateDim = useSelector((state) =>
        sGetMetadataById(state, getId(DIMENSION_ID_EVENT_DATE))
    )
    const enrollmentDateDim = useSelector((state) =>
        sGetMetadataById(state, getId(DIMENSION_ID_ENROLLMENT_DATE))
    )
    const incidentDateDim = useSelector((state) =>
        sGetMetadataById(state, getId(DIMENSION_ID_INCIDENT_DATE))
    )
    const scheduledDateDim = useSelector((state) =>
        sGetMetadataById(state, getId(DIMENSION_ID_SCHEDULED_DATE))
    )

    return useMemo(() => {
        const { metadata } = store.getState()
        const program = metadata[programId]
        const stage = metadata[programStageId]
        const hiddenTimeDimensions = getHiddenTimeDimensions(
            inputType,
            program,
            stage
        )
        const timeDimensions = [
            eventDateDim,
            enrollmentDateDim,
            scheduledDateDim,
            incidentDateDim,
        ].filter((dimension) => {
            if (!dimension) {
                return false
            }
            const { dimensionId } = extractDimensionIdParts(
                dimension.id,
                inputType
            )
            return !hiddenTimeDimensions.includes(dimensionId)
        })

        const programDimensions = Object.values(
            getProgramDimensions(
                inputType === OUTPUT_TYPE_TRACKED_ENTITY && programId
            )
        ).filter(
            (dimension) =>
                !getIsProgramDimensionDisabled({
                    dimensionId: dimension.id,
                    inputType,
                    programType: program?.programType,
                })
        )

        return programDimensions.concat(timeDimensions)
    }, [
        inputType,
        programId,
        programStageId,
        eventDateDim,
        enrollmentDateDim,
        incidentDateDim,
        scheduledDateDim,
    ])
}
