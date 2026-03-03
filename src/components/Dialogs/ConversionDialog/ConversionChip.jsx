import { useDraggable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { DimensionIcon } from '../../MainSidebar/DimensionItem/DimensionIcon.jsx'
import styles from './styles/ConversionDialog.module.css'

// Chip in the discard zone — styled differently.
// locked=true means it's an invalid dimension that can't be restored.
export const DiscardedChip = ({ dimension, onRemove, locked }) => {
    const handleRemove = (e) => {
        e.stopPropagation()
        onRemove(dimension.id)
    }

    return (
        <div className={cx(styles.chip, styles.discardedChip)}>
            <span className={styles.chipIcon}>
                <DimensionIcon dimensionType={dimension.dimensionType} />
            </span>
            <span className={styles.chipLabel}>{dimension.name}</span>
            {!locked && (
                <button
                    className={styles.removeBtn}
                    onClick={handleRemove}
                    type="button"
                    aria-label={`Restore ${dimension.name}`}
                >
                    <IconCross16 />
                </button>
            )}
        </div>
    )
}

DiscardedChip.propTypes = {
    dimension: PropTypes.shape({
        dimensionType: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
    }).isRequired,
    locked: PropTypes.bool,
    onRemove: PropTypes.func.isRequired,
}

// Draggable chip in the source panel — can be dragged into target axes
// or clicked to select (for click-then-place interaction)
export const DraggableSourceChip = ({
    dimension,
    isSelected,
    onSelect,
}) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: dimension.id,
        data: { origin: 'source' },
    })

    const handleClick = (e) => {
        e.stopPropagation()
        onSelect(dimension.id)
    }

    return (
        <div
            ref={setNodeRef}
            className={cx(styles.chip, styles.sourceChip, {
                [styles.selected]: isSelected,
                [styles.draggingGhost]: isDragging,
            })}
            onClick={handleClick}
            {...attributes}
            {...listeners}
        >
            <span className={styles.chipIcon}>
                <DimensionIcon dimensionType={dimension.dimensionType} />
            </span>
            <span className={styles.chipLabel}>{dimension.name}</span>
        </div>
    )
}

DraggableSourceChip.propTypes = {
    dimension: PropTypes.shape({
        dimensionType: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
    }).isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
}

// Sortable chip in a target axis — can be reordered within an axis,
// moved to another axis, selected for click-then-place, or removed
export const TargetChip = ({
    dimension,
    axisId,
    isSelected,
    onSelect,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: dimension.id,
        data: { origin: 'target', axisId },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleClick = (e) => {
        e.stopPropagation()
        onSelect(dimension.id)
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cx(styles.chip, styles.targetChip, {
                [styles.selected]: isSelected,
                [styles.dragging]: isDragging,
            })}
            onClick={handleClick}
            {...attributes}
            {...listeners}
        >
            <span className={styles.chipIcon}>
                <DimensionIcon dimensionType={dimension.dimensionType} />
            </span>
            <span className={styles.chipLabel}>{dimension.name}</span>
        </div>
    )
}

TargetChip.propTypes = {
    axisId: PropTypes.string.isRequired,
    dimension: PropTypes.shape({
        dimensionType: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
    }).isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
}
