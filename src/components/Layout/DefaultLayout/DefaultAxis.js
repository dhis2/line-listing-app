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

class Axis extends React.Component {
    onDragOver = e => {
        e.preventDefault()
    }

    render() {
        const {
            axisId,
            axis,
            style,
            type,
            getOpenHandler,
            getItemsByDimension,
        } = this.props

        return (
            <div
                id={axisId}
                data-test={`${axisId}-axis`}
                style={{ ...styles.axisContainer, ...style }}
                onDragOver={this.onDragOver}
            >
                <div style={styles.label}>
                    {this.props.label ||
                        getAxisNameByLayoutType(
                            axisId,
                            getLayoutTypeByVisType(type)
                        )}
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
}

Axis.propTypes = {
    axis: PropTypes.array,
    axisId: PropTypes.string,
    classes: PropTypes.object,
    getItemsByDimension: PropTypes.func,
    getMoveHandler: PropTypes.func,
    getOpenHandler: PropTypes.func,
    getRemoveHandler: PropTypes.func,
    label: PropTypes.string,
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Axis)
