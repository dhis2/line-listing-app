import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getAxisName } from '../../../modules/axis'
import { sGetDimensions } from '../../../reducers/dimensions'
import { sGetMetadata } from '../../../reducers/metadata'
import { sGetUiItemsByDimension, sGetUiLayout } from '../../../reducers/ui'
import Chip from '../Chip'
import ChipMenu from '../ChipMenu'
import styles from './styles/DefaultAxis.module.css'

const DefaultAxis = ({
    axis,
    axisId,
    getItemsByDimension,
    getOpenHandler,
    className,
    renderChips,
    visType,
}) => {
    const onDragOver = e => {
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
                {provided => (
                    <div
                        className={styles.content}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {renderChips &&
                            axis.map((dimensionId, index) => {
                                const key = `${axisId}-${dimensionId}`

                                const items = getItemsByDimension(dimensionId)

                                return (
                                    <Draggable
                                        key={key}
                                        draggableId={key}
                                        index={index}
                                    >
                                        {provided => (
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
    getItemsByDimension: PropTypes.func,
    getOpenHandler: PropTypes.func,
    layout: PropTypes.object,
    renderChips: PropTypes.bool,
    visType: PropTypes.string,
}

export const renderChipsSelector = createSelector(
    // only render chips when all have names (from metadata or dimensions) available
    [sGetUiLayout, sGetMetadata, sGetDimensions],
    (layout, metadata, dimensions) => {
        const layoutItems = Object.values(layout || {}).flat()
        const dataObjects = [
            ...Object.values(metadata || {}),
            ...Object.values(dimensions || {}),
        ]

        return layoutItems.every(item =>
            dataObjects.some(data => data.id === item)
        )
    }
)

const mapStateToProps = state => ({
    layout: sGetUiLayout(state),
    getItemsByDimension: dimensionId =>
        sGetUiItemsByDimension(state, dimensionId) || [],
    renderChips: renderChipsSelector(state),
})

const mapDispatchToProps = () => ({
    getOpenHandler: () => () => alert('getOpenHandler'),
    // TODO: Trigger the dimensions modal to open on click
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
