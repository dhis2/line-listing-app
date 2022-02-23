import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect, useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { acSetUiOpenDimensionModal } from '../../../actions/ui.js'
import { getAxisName } from '../../../modules/axis.js'
import { parseConditionsStringToArray } from '../../../modules/conditions.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import {
    sGetUiDraggingId,
    sGetUiItemsByDimension,
    sGetUiLayout,
    sGetUiConditionsByDimension,
} from '../../../reducers/ui.js'
import DimensionMenu from '../../DimensionMenu/DimensionMenu.js'
import { LAST, getDropzoneId } from '../../DndContext.js'
import Chip from '../Chip.js'
import { DropZone } from './DropZone.js'
import styles from './styles/DefaultAxis.module.css'

const DefaultAxis = ({
    axis,
    axisId,
    getConditionsByDimension,
    getItemsByDimension,
    getOpenHandler,
    className,
    renderChips,
}) => {
    const lastDropZoneId = getDropzoneId(axisId, LAST)
    const { over, setNodeRef } = useDroppable({
        id: lastDropZoneId,
    })
    const draggingId = useSelector(sGetUiDraggingId)
    const metadata = useSelector(sGetMetadata)

    // TODO - using the rawDimensionId instead of dimensionId
    // is a temporary workaround
    // until the backend is updated to return programStageId.dimensionId
    // in analytics response.metadata.items
    const getDimensionName = (id) => {
        let name
        if (metadata[id]?.name) {
            name = metadata[id].name || ''
        } else {
            const [rawDimensionId] = id.split('.').reverse()
            name = metadata[rawDimensionId]?.name || ''
        }

        return name
    }

    const getDimensionType = (id) => {
        let dimensionType
        if (metadata[id]?.dimensionType) {
            dimensionType = metadata[id].dimensionType || null
        } else {
            const [rawDimensionId] = id.split('.').reverse()
            dimensionType = metadata[rawDimensionId]?.dimensionType || null
        }

        return dimensionType
    }

    const activeIndex = draggingId ? axis.indexOf(draggingId) : -1

    const getNumberOfConditions = (dimensionId) => {
        const conditions = getConditionsByDimension(dimensionId)
        const numberOfConditions =
            parseConditionsStringToArray(conditions.condition).length ||
            conditions.legendSet
                ? 1
                : 0

        return numberOfConditions
    }

    const overLastDropZone = over?.id === lastDropZoneId

    return (
        <div ref={setNodeRef} className={styles.lastDropzone}>
            <div
                id={axisId}
                data-test={`${axisId}-axis`}
                className={cx(styles.axisContainer, className)}
            >
                <div className={styles.label}>{getAxisName(axisId)}</div>
                <SortableContext id={axisId} items={axis}>
                    <div className={styles.content}>
                        <DropZone
                            axisId={axisId}
                            firstElementId={axis[0]}
                            overLastDropZone={overLastDropZone}
                        />
                        {renderChips &&
                            axis.map((id, i) => (
                                <Chip
                                    key={`${axisId}-${id}`}
                                    onClick={getOpenHandler(id)}
                                    dimensionId={id}
                                    dimensionName={getDimensionName(id)}
                                    dimensionType={getDimensionType(id)}
                                    items={getItemsByDimension(id)}
                                    numberOfConditions={getNumberOfConditions(
                                        id
                                    )}
                                    isLast={i === axis.length - 1}
                                    overLastDropZone={overLastDropZone}
                                    contextMenu={
                                        <DimensionMenu
                                            dimensionId={id}
                                            currentAxisId={axisId}
                                        />
                                    }
                                    activeIndex={activeIndex}
                                />
                            ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    )
}

DefaultAxis.propTypes = {
    axis: PropTypes.array,
    axisId: PropTypes.string,
    className: PropTypes.string,
    getConditionsByDimension: PropTypes.func,
    getItemsByDimension: PropTypes.func,
    getOpenHandler: PropTypes.func,
    renderChips: PropTypes.bool,
}

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

const mapStateToProps = (state) => ({
    layout: sGetUiLayout(state),
    getConditionsByDimension: (dimensionId) =>
        sGetUiConditionsByDimension(state, dimensionId) || {},
    getItemsByDimension: (dimensionId) =>
        sGetUiItemsByDimension(state, dimensionId) || [],
    renderChips: renderChipsSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
    getOpenHandler: (dimensionId) => () =>
        dispatch(acSetUiOpenDimensionModal(dimensionId)),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    axis: stateProps.layout[ownProps.axisId],
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(DefaultAxis)
