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
    // DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
} from '../modules/dimensionConstants.js'
import { getFilteredLayout } from '../modules/layout.js'
import {
    getMainDimensions,
    getIsMainDimensionDisabled,
} from '../modules/mainDimensions.js'
import { getOptionsForUi } from '../modules/options.js'
import { getDisabledTimeDimensions } from '../modules/timeDimensions.js'
import { getAdaptedUiByType, getUiFromVisualization } from '../modules/ui.js'
import { OUTPUT_TYPE_EVENT } from '../modules/visualization.js'
import { sGetMetadata, sGetMetadataById } from './metadata.js'

export const SET_UI_DRAGGING_ID = 'SET_UI_DRAGGING_ID'
export const SET_UI_INPUT = 'SET_UI_INPUT'
export const CLEAR_UI_PROGRAM = 'CLEAR_UI_PROGRAM'
export const CLEAR_UI_STAGE_ID = 'CLEAR_UI_STAGE_ID'
export const UPDATE_UI_PROGRAM_ID = 'UPDATE_UI_PROGRAM_ID'
export const UPDATE_UI_PROGRAM_STAGE_ID = 'UPDATE_UI_PROGRAM_STAGE_ID'
export const SET_UI_OPTIONS = 'SET_UI_OPTIONS'
export const SET_UI_OPTION = 'SET_UI_OPTION'
export const SET_UI_SORTING = 'SET_UI_SORTING'
export const ADD_UI_LAYOUT_DIMENSIONS = 'ADD_UI_LAYOUT_DIMENSIONS'
export const REMOVE_UI_LAYOUT_DIMENSIONS = 'REMOVE_UI_LAYOUT_DIMENSIONS'
export const SET_UI_LAYOUT = 'SET_UI_LAYOUT'
export const SET_UI_FROM_VISUALIZATION = 'SET_UI_FROM_VISUALIZATION'
export const CLEAR_UI = 'CLEAR_UI'
export const SET_UI_DETAILS_PANEL_OPEN = 'SET_UI_DETAILS_PANEL_OPEN'
export const SET_UI_ACCESSORY_PANEL_OPEN = 'SET_UI_ACCESSORY_PANEL_OPEN'
export const SET_UI_EXPANDED_LAYOUT_PANEL = 'SET_UI_EXPANDED_LAYOUT_PANEL'
export const SET_UI_ACTIVE_MODAL_DIALOG = 'SET_UI_ACTIVE_MODAL_DIALOG'
export const SET_UI_ITEMS = 'SET_UI_ITEMS'
export const REMOVE_UI_ITEMS = 'REMOVE_UI_ITEMS'
export const ADD_UI_PARENT_GRAPH_MAP = 'ADD_UI_PARENT_GRAPH_MAP'
export const SET_UI_CONDITIONS = 'SET_UI_CONDITIONS'
export const SET_UI_REPETITION = 'SET_UI_REPETITION'
export const REMOVE_UI_REPETITION = 'REMOVE_UI_REPETITION'

export const DEFAULT_SORT_DIRECTION = 'asc'
export const FIRST_PAGE = 1
export const PAGE_SIZE = 100

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
    layout: {
        columns: [],
        filters: [],
    },
    itemsByDimension: {},
    options: {},
    parentGraphMap: {},
    repetitionByDimension: {},
    sorting: {
        sortField: null,
        sortDirection: DEFAULT_SORT_DIRECTION,
        page: FIRST_PAGE,
        pageSize: PAGE_SIZE,
    },
}

export const DEFAULT_UI = {
    draggingId: null,
    type: VIS_TYPE_LINE_LIST,
    input: {
        type: OUTPUT_TYPE_EVENT,
    },
    program: {},
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
    showAccessoryPanel: false,
    showDetailsPanel: false,
    showExpandedLayoutPanel: false,
    activeModalDialog: null,
    parentGraphMap: {},
    repetitionByDimension: {},
    conditions: {},
    sorting: {
        sortField: null,
        sortDirection: DEFAULT_SORT_DIRECTION,
        page: FIRST_PAGE,
        pageSize: PAGE_SIZE,
    },
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
        case SET_UI_DRAGGING_ID: {
            return { ...state, draggingId: action.value }
        }
        case SET_UI_INPUT: {
            return {
                ...state,
                input: action.value,
            }
        }
        case SET_UI_SORTING: {
            return {
                ...state,
                sorting: action.value,
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
        default:
            return state
    }
}

// Selectors

export const sGetUi = (state) => state.ui
export const sGetUiDraggingId = (state) => sGetUi(state).draggingId
export const sGetUiInput = (state) => sGetUi(state).input
export const sGetUiProgram = (state) => sGetUi(state).program
export const sGetUiOptions = (state) => sGetUi(state).options
export const sGetUiOption = () => {} // TODO: items stored here should be flattened and reintegrated into sGetUiOptions (above)
export const sGetUiItems = (state) => sGetUi(state).itemsByDimension
export const sGetUiLayout = (state) => sGetUi(state).layout
export const sGetUiShowDetailsPanel = (state) => sGetUi(state).showDetailsPanel
export const sGetUiShowAccessoryPanel = (state) =>
    sGetUi(state).showAccessoryPanel
export const sGetUiShowExpandedLayoutPanel = (state) =>
    sGetUi(state).showExpandedLayoutPanel
export const sGetUiType = (state) => sGetUi(state).type
export const sGetUiActiveModalDialog = (state) =>
    sGetUi(state).activeModalDialog
export const sGetUiParentGraphMap = (state) => sGetUi(state).parentGraphMap
export const sGetUiConditions = (state) => sGetUi(state).conditions || {}
export const sGetUiRepetition = (state) =>
    sGetUi(state).repetitionByDimension || {}

export const sGetUiSorting = (state) => sGetUi(state).sorting

// Selectors level 2

export const sGetUiInputType = (state) => sGetUiInput(state).type

export const sGetUiProgramId = (state) => sGetUiProgram(state).id
export const sGetUiProgramStageId = (state) => sGetUiProgram(state).stageId

export const sGetUiItemsByDimension = (state, dimension) =>
    sGetUiItems(state)[dimension] || DEFAULT_UI.itemsByDimension[dimension]

export const sGetDimensionIdsFromLayout = (state) =>
    Object.values(sGetUiLayout(state)).reduce(
        (ids, axisDimensionIds) => ids.concat(axisDimensionIds),
        []
    )

export const sGetUiDimensionIdsByAxisId = (state, axisId) =>
    sGetUiLayout(state)[axisId]

export const sGetUiConditionsByDimension = (state, dimension) => {
    const conds = sGetUiConditions(state)
    return conds[dimension]
}

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
    const store = useStore()
    const programId = useSelector(sGetUiProgramId)
    const inputType = useSelector(sGetUiInputType)

    return useMemo(() => {
        const { metadata } = store.getState()
        const programType = programId && metadata[programId].programType

        return Object.values(getMainDimensions()).map((dimension) => {
            const disabledReason = getIsMainDimensionDisabled({
                dimensionId: dimension.id,
                inputType,
                programType,
            })
            return {
                ...dimension,
                disabled: Boolean(disabledReason),
                disabledReason,
            }
        })
    }, [programId, inputType])
}

export const useTimeDimensions = () => {
    const store = useStore()
    const inputType = useSelector(sGetUiInputType)
    const programId = useSelector(sGetUiProgramId)
    const programStageId = useSelector(sGetUiProgramStageId)
    const eventDateDim = useSelector((state) =>
        sGetMetadataById(state, DIMENSION_ID_EVENT_DATE)
    )
    const enrollmentDateDim = useSelector((state) =>
        sGetMetadataById(state, DIMENSION_ID_ENROLLMENT_DATE)
    )
    const incidentDateDim = useSelector((state) =>
        sGetMetadataById(state, DIMENSION_ID_INCIDENT_DATE)
    )
    // const scheduledDateDim = useSelector((state) =>
    //     sGetMetadataById(state, DIMENSION_ID_SCHEDULED_DATE)
    // )
    const lastUpdatedDim = useSelector((state) =>
        sGetMetadataById(state, DIMENSION_ID_LAST_UPDATED)
    )

    return useMemo(() => {
        const { metadata } = store.getState()
        const program = metadata[programId]
        const stage = metadata[programStageId]
        const timeDimensions = [
            eventDateDim,
            enrollmentDateDim,
            incidentDateDim,
            // scheduledDateDim,
            lastUpdatedDim,
        ]

        if (timeDimensions.every((dimension) => !!dimension)) {
            const disabledTimeDimensions = getDisabledTimeDimensions(
                inputType,
                program,
                stage
            )

            return timeDimensions.map((dimension) => ({
                ...dimension,
                disabled: Boolean(disabledTimeDimensions[dimension.id]),
                disabledReason: disabledTimeDimensions[dimension.id],
            }))
        } else {
            return null
        }
    }, [
        inputType,
        programId,
        programStageId,
        eventDateDim,
        enrollmentDateDim,
        incidentDateDim,
        // scheduledDateDim,
        lastUpdatedDim,
    ])
}
