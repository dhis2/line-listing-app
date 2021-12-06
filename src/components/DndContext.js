import PropTypes from 'prop-types'
import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { acAddUiLayoutDimensions, acSetUiLayout } from '../actions/ui.js'
import { SOURCE_DIMENSIONS } from '../modules/layout.js'
import { sGetUiLayout, sGetUiItems } from '../reducers/ui.js'

const DndContext = ({
    children,
    layout,
    onAddDimensions,
    onReorderDimensions,
}) => {
    const rearrangeLayoutDimensions = ({
        sourceAxisId,
        sourceIndex,
        destinationAxisId,
        destinationIndex,
    }) => {
        const sourceList = Array.from(layout[sourceAxisId])
        const [moved] = sourceList.splice(sourceIndex, 1)

        if (sourceAxisId === destinationAxisId) {
            sourceList.splice(destinationIndex, 0, moved)

            onReorderDimensions({
                ...layout,
                [sourceAxisId]: sourceList,
            })
        } else {
            onAddDimensions({
                [moved]: {
                    axisId: destinationAxisId,
                    index: destinationIndex,
                },
            })
        }
    }

    const addDimensionToLayout = ({ axisId, index, dimensionId }) => {
        onAddDimensions({ [dimensionId]: { axisId, index } })
        //TODO: Add onDropWithoutItems
    }

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result

        if (!destination) {
            return
        }

        if (source.droppableId === SOURCE_DIMENSIONS) {
            addDimensionToLayout({
                axisId: destination.droppableId,
                index: destination.index,
                dimensionId: draggableId,
            })
        } else {
            rearrangeLayoutDimensions({
                sourceAxisId: source.droppableId,
                sourceIndex: source.index,
                destinationAxisId: destination.droppableId,
                destinationIndex: destination.index,
            })
        }
    }

    return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
}

DndContext.propTypes = {
    children: PropTypes.node,
    layout: PropTypes.object,
    onAddDimensions: PropTypes.func,
    onReorderDimensions: PropTypes.func,
}

const mapStateToProps = (state) => ({
    layout: sGetUiLayout(state),
    itemsByDimension: sGetUiItems(state),
})

const mapDispatchToProps = (dispatch) => ({
    onAddDimensions: (map) => dispatch(acAddUiLayoutDimensions(map)),
    onReorderDimensions: (layout) => dispatch(acSetUiLayout(layout)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DndContext)
