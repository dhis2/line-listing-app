import {
    getAxisNameByLayoutType,
    getLayoutTypeByVisType,
} from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { sGetUiItemsByDimension, sGetUiLayout } from '../../../reducers/ui'
import Chip from '../Chip'
import stylesModule from './styles/DefaultAxis.module.css'
import styles from './styles/DefaultAxis.style'

const DefaultAxis = ({
    axis,
    axisId,
    getItemsByDimension,
    getOpenHandler,
    style,
    type,
}) => {
    const onDragOver = e => {
        e.preventDefault()
    }

    return (
        <div
            id={axisId}
            data-test={`${axisId}-axis`}
            style={{ ...styles.axisContainer, ...style }}
            onDragOver={onDragOver}
        >
            <div style={styles.label}>
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
                        className={stylesModule.content}
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
    getItemsByDimension: PropTypes.func,
    getOpenHandler: PropTypes.func,
    layout: PropTypes.object,
    style: PropTypes.object,
    type: PropTypes.string,
}

const mapStateToProps = state => ({
    layout: sGetUiLayout(state),
    getItemsByDimension: dimensionId =>
        sGetUiItemsByDimension(state, dimensionId) || [],
})

const mapDispatchToProps = () => ({
    getOpenHandler: () => {},
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
