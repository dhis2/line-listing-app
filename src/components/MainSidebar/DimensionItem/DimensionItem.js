import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../../actions/ui.js'
import DimensionMenu from '../../DimensionMenu/DimensionMenu.js'
import { DimensionItemBase } from './DimensionItemBase.js'

export const DimensionItem = ({
    id,
    draggableId,
    name,
    dimensionType,
    valueType,
    optionSet,
    stageName,
    disabled,
    selected,
}) => {
    const dispatch = useDispatch()
    const [mouseIsOver, setMouseIsOver] = useState(false)
    const onClick = disabled
        ? undefined
        : () =>
              dispatch(
                  acSetUiOpenDimensionModal(id, {
                      [id]: {
                          id,
                          name,
                          dimensionType,
                          valueType,
                          optionSet,
                      },
                  })
              )

    const onMouseOver = () => setMouseIsOver(true)
    const onMouseExit = () => setMouseIsOver(false)

    const {
        attributes,
        listeners,
        isSorting,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: draggableId || id,
        disabled: disabled || selected,
        data: {
            name,
            dimensionType,
            valueType,
        },
    })

    const style = transform
        ? {
              transform: isSorting
                  ? undefined
                  : CSS.Translate.toString({
                        x: transform.x,
                        y: transform.y,
                        scaleX: 1,
                        scaleY: 1,
                    }),
              transition,
          }
        : undefined

    return (
        <div
            {...attributes}
            {...listeners}
            ref={setNodeRef}
            style={style}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseExit}
        >
            <DimensionItemBase
                name={name}
                dimensionType={dimensionType}
                disabled={disabled}
                selected={selected}
                stageName={stageName}
                onClick={onClick}
                contextMenu={
                    mouseIsOver && !disabled ? (
                        <DimensionMenu dimensionId={id} />
                    ) : null
                }
            />
        </div>
    )
}

DimensionItem.propTypes = {
    dimensionType: PropTypes.string.isRequired,
    draggableId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    optionSet: PropTypes.string,
    selected: PropTypes.bool,
    stageName: PropTypes.string,
    valueType: PropTypes.string,
}
