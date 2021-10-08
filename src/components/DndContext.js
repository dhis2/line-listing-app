import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { acAddUiLayoutDimensions, acSetUiLayout } from '../actions/ui'
import { SOURCE_DIMENSIONS } from '../modules/layout'
import { sGetUiLayout, sGetUiItems } from '../reducers/ui'

class DndContext extends Component {
    rearrangeLayoutDimensions = ({
        sourceAxisId,
        sourceIndex,
        destinationAxisId,
        destinationIndex,
    }) => {
        const layout = this.props.layout

        const sourceList = Array.from(layout[sourceAxisId])
        const [moved] = sourceList.splice(sourceIndex, 1)

        if (sourceAxisId === destinationAxisId) {
            sourceList.splice(destinationIndex, 0, moved)

            this.props.onReorderDimensions({
                ...layout,
                [sourceAxisId]: sourceList,
            })
        } else {
            this.props.onAddDimensions({
                [moved]: {
                    axisId: destinationAxisId,
                    index: destinationIndex,
                },
            })
        }
    }

    addDimensionToLayout = ({ axisId, index, dimensionId }) => {
        this.props.onAddDimensions({ [dimensionId]: { axisId, index } })
        //TODO: Add onDropWithoutItems
    }

    onDragEnd = result => {
        const { source, destination, draggableId } = result

        if (!destination) {
            return
        }

        if (source.droppableId === SOURCE_DIMENSIONS) {
            this.addDimensionToLayout({
                axisId: destination.droppableId,
                index: destination.index,
                dimensionId: draggableId,
            })
        } else {
            this.rearrangeLayoutDimensions({
                sourceAxisId: source.droppableId,
                sourceIndex: source.index,
                destinationAxisId: destination.droppableId,
                destinationIndex: destination.index,
            })
        }
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {this.props.children}
            </DragDropContext>
        )
    }
}

DndContext.propTypes = {
    children: PropTypes.node,
    layout: PropTypes.object,
    onAddDimensions: PropTypes.func,
    onReorderDimensions: PropTypes.func,
}

const mapStateToProps = state => ({
    layout: sGetUiLayout(state),
    itemsByDimension: sGetUiItems(state),
})

const mapDispatchToProps = dispatch => ({
    onAddDimensions: map => dispatch(acAddUiLayoutDimensions(map)),
    onReorderDimensions: layout => dispatch(acSetUiLayout(layout)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DndContext)
