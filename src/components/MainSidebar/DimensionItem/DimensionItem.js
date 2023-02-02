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
import { DimensionActionButton } from './DimensionActionButton.js'
import { DimensionItemBase } from './DimensionItemBase.js'

// Joe prefers this icon as the one in ui is too light
const IconCross16 = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L6.58579 8L3.29289 11.2929C2.90237 11.6834 2.90237 12.3166 3.29289 12.7071C3.68342 13.0976 4.31658 13.0976 4.70711 12.7071L8 9.41421L11.2929 12.7071C11.6834 13.0976 12.3166 13.0976 12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L9.41421 8L12.7071 4.70711C13.0976 4.31658 13.0976 3.68342 12.7071 3.29289C12.3166 2.90237 11.6834 2.90237 11.2929 3.29289L8 6.58579L4.70711 3.29289Z"
            fill="#4A5768"
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
                        <DimensionActionButton
                            icon={
                                selected ? (
                                    <IconCross16 />
                                ) : (
                                    <IconAdd16 color="var(--colors-grey600)" />
                                )
                            }
                            onClick={(e) => {
                                e && e.stopPropagation()

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
