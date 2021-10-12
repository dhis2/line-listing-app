import {
    getAxisNameByLayoutType,
    getLayoutTypeByVisType,
} from '@dhis2/analytics'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { sGetUiItemsByDimension, sGetUiLayout } from '../../../reducers/ui'
import Chip from '../Chip'
import styles from './styles/DefaultAxis.module.css'

const DefaultAxis = ({
    axis,
    axisId,
    getItemsByDimension,
    getOpenHandler,
    className,
    type,
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
            <div className={styles.label}>
                {
                    // TODO: Falls back to the 'default' case in getAxisNameByLayoutType, add a new layout type in Analytics?
                    getAxisNameByLayoutType(
                        axisId,
                        getLayoutTypeByVisType(type)
                    )
                }
            </div>
            <Droppable droppableId={axisId} direction="horizontal">
                {provided => (
                    <div
                        className={styles.content}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {axis.map((dimensionId, index) => {
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
                                                // TODO: implement the chip menu with contextMenu
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
    className: PropTypes.object,
    getItemsByDimension: PropTypes.func,
    getOpenHandler: PropTypes.func,
    layout: PropTypes.object,
    type: PropTypes.string,
}

const mapStateToProps = state => ({
    layout: sGetUiLayout(state),
    getItemsByDimension: dimensionId =>
        sGetUiItemsByDimension(state, dimensionId) || [],
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
