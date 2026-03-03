import { useDroppable } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { getAxisName } from '../../../modules/axis.js'
import { DraggableSourceChip, TargetChip, DiscardedChip } from './ConversionChip.jsx'
import styles from './styles/ConversionDialog.module.css'

export const DISCARD_ZONE_ID = 'discard'

// Source axis — displays draggable chips matching real layout axis style.
// Only shows dimensions that haven't been placed in a target axis yet.
export const SourceAxis = ({ axisId, dimensions, selectedChipId, onChipSelect }) => {
    const axisName = getAxisName(axisId)

    return (
        <div className={styles.axisBlock}>
            <div className={styles.axisLabel}>{axisName}</div>
            <div className={styles.axisChips}>
                {dimensions.map((dim) => (
                    <DraggableSourceChip
                        key={dim.id}
                        dimension={dim}
                        isSelected={selectedChipId === dim.id}
                        onSelect={onChipSelect}
                    />
                ))}
            </div>
        </div>
    )
}

SourceAxis.propTypes = {
    axisId: PropTypes.string.isRequired,
    dimensions: PropTypes.arrayOf(
        PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
    ).isRequired,
    selectedChipId: PropTypes.string,
    onChipSelect: PropTypes.func.isRequired,
}

// Target axis — droppable, sortable chip area matching real layout axis style.
export const TargetAxis = ({
    axisId,
    dimensions,
    selectedChipId,
    onChipSelect,
    onDropZoneClick,
    onAddAll,
    hasUnplaced,
}) => {
    const axisName = getAxisName(axisId)
    const hasSelection = Boolean(selectedChipId)

    const { setNodeRef, isOver } = useDroppable({ id: axisId })

    const handleZoneClick = () => {
        if (hasSelection) {
            onDropZoneClick(axisId)
        }
    }

    const showAddAll = hasUnplaced && !hasSelection

    return (
        <div className={styles.axisBlock}>
            <div className={styles.axisLabel}>
                <span>{axisName}</span>
                {showAddAll && (
                    <button
                        type="button"
                        className={styles.addAllBtn}
                        onClick={() => onAddAll(axisId)}
                    >
                        {i18n.t('Add all here')}
                    </button>
                )}
            </div>
            <SortableContext
                id={axisId}
                items={dimensions.map((d) => d.id)}
                strategy={horizontalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className={cx(styles.axisChips, {
                        [styles.dropZoneOver]: isOver,
                        [styles.dropZoneClickable]: hasSelection && !isOver,
                    })}
                    onClick={handleZoneClick}
                >
                    {dimensions.map((dim) => (
                        <TargetChip
                            key={dim.id}
                            dimension={dim}
                            axisId={axisId}
                            isSelected={selectedChipId === dim.id}
                            onSelect={onChipSelect}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    )
}

TargetAxis.propTypes = {
    axisId: PropTypes.string.isRequired,
    dimensions: PropTypes.arrayOf(
        PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
    ).isRequired,
    hasUnplaced: PropTypes.bool.isRequired,
    selectedChipId: PropTypes.string,
    onAddAll: PropTypes.func.isRequired,
    onChipSelect: PropTypes.func.isRequired,
    onDropZoneClick: PropTypes.func.isRequired,
}

// Discard zone — droppable area for dimensions the user doesn't want
export const DiscardZone = ({
    dimensions,
    hasSelection,
    lockedIds,
    onChipRemove,
    onZoneClick,
}) => {
    const { setNodeRef, isOver } = useDroppable({ id: DISCARD_ZONE_ID })

    return (
        <div className={styles.discardZoneWrapper}>
            <div className={styles.discardZoneLabel}>
                {i18n.t('Discard')}
            </div>
            <div
                ref={setNodeRef}
                className={cx(styles.discardZoneChips, {
                    [styles.discardZoneOver]: isOver,
                    [styles.discardZoneClickable]: hasSelection && !isOver,
                })}
                onClick={() => hasSelection && onZoneClick()}
            >
                {dimensions.length === 0 && !hasSelection && (
                    <span className={styles.emptyPlaceholder}>
                        {i18n.t('Drag dimensions here to discard them')}
                    </span>
                )}
                {dimensions.map((dim) => (
                    <DiscardedChip
                        key={dim.id}
                        dimension={dim}
                        locked={lockedIds.has(dim.id)}
                        onRemove={onChipRemove}
                    />
                ))}
            </div>
        </div>
    )
}

DiscardZone.propTypes = {
    dimensions: PropTypes.arrayOf(
        PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
    ).isRequired,
    hasSelection: PropTypes.bool.isRequired,
    lockedIds: PropTypes.instanceOf(Set).isRequired,
    onChipRemove: PropTypes.func.isRequired,
    onZoneClick: PropTypes.func.isRequired,
}
