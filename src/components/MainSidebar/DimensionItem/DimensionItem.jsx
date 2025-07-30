import { IconAdd16 } from '@dhis2/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import {
    acAddUiLayoutDimensions,
    acRemoveUiLayoutDimensions,
    acSetUiOpenDimensionModal,
} from '../../../actions/ui.js'
import { DimensionItemBase } from './DimensionItemBase.jsx'
import { DimensionItemButton } from './DimensionItemButton.jsx'

// TODO: import from `ui` when available
const IconSubtract16 = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill="var(--colors-grey600)"
            d="M2 8C2 7.44772 2.44772 7 3 7H13C13.5523 7 14 7.44772 14 8V8C14 8.55228 13.5523 9 13 9H3C2.44772 9 2 8.55228 2 8V8Z"
        />
    </svg>
)

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
    const dimensionMetadata = {
        [id]: {
            id,
            name,
            dimensionType,
            valueType,
            optionSet,
        },
    }

    const onClick = disabled
        ? undefined
        : () => dispatch(acSetUiOpenDimensionModal(id, dimensionMetadata))

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
        data: dimensionMetadata[id],
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
        <div {...attributes} {...listeners} ref={setNodeRef} style={style}>
            <DimensionItemBase
                name={name}
                dimensionType={dimensionType}
                disabled={disabled}
                selected={selected}
                stageName={stageName}
                onClick={onClick}
                dataTest={`dimension-item-${id}`}
                contextMenu={
                    !disabled && (
                        <DimensionItemButton
                            dataTest={`item-button-${id}`}
                            icon={
                                selected ? (
                                    <IconSubtract16 />
                                ) : (
                                    <IconAdd16 color="var(--colors-grey600)" />
                                )
                            }
                            onClick={(e) => {
                                e?.stopPropagation()

                                if (!selected) {
                                    dispatch(
                                        acAddUiLayoutDimensions(
                                            { [id]: { axisId: 'columns' } },
                                            dimensionMetadata
                                        )
                                    )
                                } else {
                                    dispatch(acRemoveUiLayoutDimensions(id))
                                }
                            }}
                        />
                    )
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
