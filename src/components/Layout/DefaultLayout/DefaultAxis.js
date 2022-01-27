import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { acSetUiOpenDimensionModal } from '../../../actions/ui.js'
import { getAxisName } from '../../../modules/axis.js'
import { parseConditionsStringToArray } from '../../../modules/conditions.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import {
    sGetUiItemsByDimension,
    sGetUiLayout,
    sGetUiConditionsByDimension,
} from '../../../reducers/ui.js'
import Chip from '../Chip.js'
import ChipMenu from '../ChipMenu.js'
import styles from './styles/DefaultAxis.module.css'

const DefaultAxis = ({
    axis,
    axisId,
    getConditionsByDimension,
    getItemsByDimension,
    getOpenHandler,
    className,
    renderChips,
    visType,
}) => {
    const onDragOver = (e) => {
        e.preventDefault()
    }

    return (
        <div
            id={axisId}
            data-test={`${axisId}-axis`}
            className={cx(styles.axisContainer, className)}
            onDragOver={onDragOver}
        >
            <div className={styles.label}>{getAxisName(axisId)}</div>
            <Droppable droppableId={axisId} direction="horizontal">
                {(provided) => (
                    <div
                        className={styles.content}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {renderChips &&
                            axis.map((dimensionId, index) => {
                                const key = `${axisId}-${dimensionId}`

                                const items = getItemsByDimension(dimensionId)

                                const conditions =
                                    getConditionsByDimension(dimensionId)
                                const numberOfConditions =
                                    parseConditionsStringToArray(
                                        conditions.condition
                                    ).length || conditions.legendSet
                                        ? 1
                                        : 0

                                return (
                                    <Draggable
                                        key={key}
                                        draggableId={key}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Chip
                                                    onClick={getOpenHandler(
                                                        dimensionId
                                                    )}
                                                    axisId={axisId}
                                                    dimensionId={dimensionId}
                                                    items={items}
                                                    numberOfConditions={
                                                        numberOfConditions
                                                    }
                                                    contextMenu={
                                                        <ChipMenu
                                                            dimensionId={
                                                                dimensionId
                                                            }
                                                            currentAxisId={
                                                                axisId
                                                            }
                                                            visType={visType}
                                                        />
                                                    }
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
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
    layout: PropTypes.object,
    renderChips: PropTypes.bool,
    visType: PropTypes.string,
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
