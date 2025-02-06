import { AXIS_ID_COLUMNS, AXIS_ID_FILTERS } from '@dhis2/analytics'
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
} from '@dnd-kit/core'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acAddMetadata } from '../actions/metadata.js'
import {
    acAddUiLayoutDimensions,
    acSetUiLayout,
    acSetUiDraggingId,
} from '../actions/ui.js'
import { getConditionsTexts } from '../modules/conditions.js'
import { extractDimensionIdParts } from '../modules/dimensionId.js'
import { sGetMetadata } from '../reducers/metadata.js'
import {
    sGetUiLayout,
    sGetUiItemsByDimension,
    sGetUiDraggingId,
    sGetUiConditionsByDimension,
    sGetUiOptions,
    sGetUiInputType,
} from '../reducers/ui.js'
import styles from './DndContext.module.css'
import { ChipBase } from './Layout/ChipBase.jsx'
import chipStyles from './Layout/styles/Chip.module.css'
import { DimensionItemBase } from './MainSidebar/DimensionItem/DimensionItemBase.jsx'

const FIRST_POSITION = 0
const LAST_POSITION = -1

const DIMENSION_PANEL_SOURCE = 'Sortable'

export const getDropzoneId = (axisId, position) => `${axisId}-${position}`
export const FIRST = 'first'
export const LAST = 'last'

const activateAt15pixels = {
    activationConstraint: {
        distance: 15,
    },
}

function getIntersectionRatio(entry, target) {
    const top = Math.max(target.top, entry.top)
    const left = Math.max(target.left, entry.left)
    const right = Math.min(target.left + target.width, entry.left + entry.width)
    const bottom = Math.min(
        target.top + target.height,
        entry.top + entry.height
    )
    const width = right - left
    const height = bottom - top

    if (left < right && top < bottom) {
        const targetArea = target.width * target.height
        const entryArea = entry.width * entry.height
        const intersectionArea = width * height
        const intersectionRatio =
            intersectionArea / (targetArea + entryArea - intersectionArea)
        return Number(intersectionRatio.toFixed(4))
    } // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)

    return 0
}
function sortCollisionsDesc({ data: { value: a } }, { data: { value: b } }) {
    return b - a
}

const rectIntersectionCustom = ({
    pointerCoordinates,
    droppableContainers,
}) => {
    // create a rect around the pointerCoords for calculating the intersection
    const pointerRect = {
        width: 80,
        height: 40,
        top: pointerCoordinates.y - 20,
        bottom: pointerCoordinates.y + 20,
        left: pointerCoordinates.x - 40,
        right: pointerCoordinates.x + 40,
    }
    const collisions = []

    for (const droppableContainer of droppableContainers) {
        const {
            id,
            rect: { current: rect },
        } = droppableContainer

        if (rect) {
            const intersectionRatio = getIntersectionRatio(rect, pointerRect)

            if (intersectionRatio > 0) {
                collisions.push({
                    id,
                    data: {
                        droppableContainer,
                        value: intersectionRatio,
                    },
                })
            }
        }
    }

    return collisions.sort(sortCollisionsDesc)
}

const getIdFromDraggingId = (draggingId) => {
    const [id] = draggingId.split('-').reverse()
    return id
}

const OuterDndContext = ({ children }) => {
    const [sourceAxis, setSourceAxis] = useState(null)

    const draggingId = useSelector(sGetUiDraggingId)
    const id = draggingId ? getIdFromDraggingId(draggingId) : null

    const layout = useSelector(sGetUiLayout)
    const inputType = useSelector(sGetUiInputType)
    const metadata = useSelector(sGetMetadata)
    const chipItems = useSelector((state) => sGetUiItemsByDimension(state, id))
    const chipConditions = useSelector((state) =>
        sGetUiConditionsByDimension(state, id)
    )
    const { digitGroupSeparator } = useSelector(sGetUiOptions)

    // Wait 15px movement before starting drag, so that click event isn't overridden
    const sensor = useSensor(PointerSensor, activateAt15pixels)
    const sensors = useSensors(sensor)

    const dispatch = useDispatch()

    const getDragOverlay = () => {
        if (!id) {
            return null
        }

        // TODO - using the rawDimensionId instead of dimensionId
        // is a temporary workaround
        // until the backend is updated to return programStageId.dimensionId
        // in analytics response.metadata.items
        let dimension
        if (metadata[id]) {
            dimension = metadata[id]
        } else {
            const { dimensionId } = extractDimensionIdParts(id)
            dimension = metadata[dimensionId]
        }

        if (!dimension) {
            return null
        }

        if (sourceAxis === DIMENSION_PANEL_SOURCE) {
            return (
                <div className={cx(styles.overlay, styles.dimensionItem)}>
                    <DimensionItemBase {...dimension} dragging={true} />
                </div>
            )
        }

        const conditionsTexts = getConditionsTexts({
            conditions: chipConditions,
            metadata,
            dimension,
            formatValueOptions: { digitGroupSeparator, skipRounding: false },
        })

        return (
            <div
                className={cx(
                    chipStyles.chip,
                    chipStyles.dragging,
                    styles.overlay,
                    {
                        [chipStyles.chipEmpty]:
                            sourceAxis === AXIS_ID_FILTERS &&
                            !chipItems.length &&
                            !chipConditions.condition?.length &&
                            !chipConditions.legendSet,
                    }
                )}
            >
                <ChipBase
                    dimension={dimension}
                    conditionsLength={conditionsTexts.length}
                    itemsLength={chipItems.length}
                    inputType={inputType}
                    axisId={sourceAxis}
                />
            </div>
        )
    }

    const rearrangeLayoutDimensions = ({
        sourceAxisId,
        sourceIndex,
        destinationAxisId,
        destinationIndex,
    }) => {
        const destItems = Array.from(layout[destinationAxisId])
        const newIndex =
            destinationIndex !== LAST_POSITION
                ? destinationIndex
                : destItems.length
        const sourceList = Array.from(layout[sourceAxisId])
        const [moved] = sourceList.splice(sourceIndex, 1)

        if (sourceAxisId === destinationAxisId) {
            sourceList.splice(newIndex, 0, moved)

            dispatch(
                acSetUiLayout({
                    ...layout,
                    [sourceAxisId]: sourceList,
                })
            )
        } else {
            dispatch(
                acAddUiLayoutDimensions({
                    [moved]: {
                        axisId: destinationAxisId,
                        index: newIndex,
                    },
                })
            )
        }
    }

    const addDimensionToLayout = ({ axisId, index, dimensionId }) => {
        const sourceList = Array.from(layout[axisId])
        const idx = index !== LAST_POSITION ? index : sourceList.length
        dispatch(
            acAddUiLayoutDimensions({ [dimensionId]: { axisId, index: idx } })
        )
        //TODO: Add onDropWithoutItems
    }

    const onDragStart = ({ active }) => {
        const id = getIdFromDraggingId(active.id)

        setSourceAxis(active.data.current.sortable.containerId)
        dispatch(acSetUiDraggingId(active.id))
        dispatch(
            acAddMetadata({
                [id]: {
                    id,
                    name: active.data.current.name,
                    dimensionType: active.data.current.dimensionType,
                    valueType: active.data.current.valueType,
                    optionSet: active.data.current.optionSet,
                },
            })
        )
    }

    const onDragCancel = () => {
        dispatch(acSetUiDraggingId(null))
    }

    const onDragEnd = (result) => {
        const { active, over } = result

        if (
            !over?.id ||
            over?.data?.current?.sortable?.containerId ===
                DIMENSION_PANEL_SOURCE
        ) {
            // dropped over non-droppable or over dimension panel
            onDragCancel()
            return
        }

        const sourceAxisId = active.data.current.sortable.containerId
        const destinationAxisId = (
            over.data.current?.sortable?.containerId || over.id
        ).split('-')[0]

        let destinationIndex =
            over.data.current?.sortable?.index || FIRST_POSITION

        const isDroppingInFirstPosition = [
            `${AXIS_ID_COLUMNS}-${FIRST}`,
            `${AXIS_ID_FILTERS}-${FIRST}`,
        ].includes(over.id)

        const isDroppingInLastPosition = [
            `${AXIS_ID_COLUMNS}-${LAST}`,
            `${AXIS_ID_FILTERS}-${LAST}`,
        ].includes(over.id)

        if (sourceAxisId === DIMENSION_PANEL_SOURCE) {
            if (isDroppingInFirstPosition) {
                destinationIndex = FIRST_POSITION
            } else if (isDroppingInLastPosition) {
                destinationIndex = LAST_POSITION
            } else {
                ++destinationIndex
            }

            addDimensionToLayout({
                axisId: destinationAxisId,
                index: destinationIndex,
                dimensionId: getIdFromDraggingId(active.id),
            })
        } else {
            const sourceIndex = active.data.current.sortable.index

            if (sourceAxisId !== destinationAxisId) {
                ++destinationIndex
            }

            if (isDroppingInFirstPosition) {
                destinationIndex = FIRST_POSITION
            } else if (isDroppingInLastPosition) {
                destinationIndex = LAST_POSITION
            }

            rearrangeLayoutDimensions({
                sourceAxisId,
                sourceIndex,
                destinationAxisId,
                destinationIndex,
            })
        }
        onDragCancel()
    }

    return (
        <DndContext
            collisionDetection={rectIntersectionCustom}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
            sensors={sensors}
        >
            {children}
            <DragOverlay dropAnimation={null}>{getDragOverlay()}</DragOverlay>
        </DndContext>
    )
}

OuterDndContext.propTypes = {
    children: PropTypes.node,
}

export default OuterDndContext
