import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_PERIOD,
} from '@dhis2/analytics'
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    rectIntersection,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    IconVisualizationLinelist16,
    IconVisualizationPivotTable16,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiType, acSetUiLayout } from '../../../actions/ui.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import { sGetUiLayout, sGetUiType } from '../../../reducers/ui.js'
import { SourceAxis, TargetAxis, DiscardZone, DISCARD_ZONE_ID } from './ConversionAxis.jsx'
import styles from './styles/ConversionDialog.module.css'

const VIS_LABELS = {
    [VIS_TYPE_LINE_LIST]: i18n.t('Line list'),
    [VIS_TYPE_PIVOT_TABLE]: i18n.t('Pivot table'),
}

const VIS_ICONS = {
    [VIS_TYPE_LINE_LIST]: IconVisualizationLinelist16,
    [VIS_TYPE_PIVOT_TABLE]: IconVisualizationPivotTable16,
}

const VIS_AXES = {
    [VIS_TYPE_LINE_LIST]: [AXIS_ID_COLUMNS, AXIS_ID_FILTERS],
    [VIS_TYPE_PIVOT_TABLE]: [AXIS_ID_COLUMNS, AXIS_ID_ROWS, AXIS_ID_FILTERS],
}

const getInvalidDimensionIds = (allIds, targetType, metadata) => {
    if (targetType !== VIS_TYPE_PIVOT_TABLE) {
        return []
    }
    return allIds.filter(
        (id) => metadata[id]?.dimensionType === DIMENSION_TYPE_PROGRAM_INDICATOR
    )
}

const ConversionDialog = ({ targetType, onClose }) => {
    const dispatch = useDispatch()
    const metadata = useSelector(sGetMetadata)
    const currentLayout = useSelector(sGetUiLayout)
    const currentType = useSelector(sGetUiType)

    const sourceAxes = VIS_AXES[currentType] || []
    const targetAxes = VIS_AXES[targetType] || []

    // All dimension IDs present in the current layout
    const allSourceIds = useMemo(
        () => [
            ...(currentLayout[AXIS_ID_COLUMNS] || []),
            ...(currentLayout[AXIS_ID_ROWS] || []),
            ...(currentLayout[AXIS_ID_FILTERS] || []),
        ],
        [currentLayout]
    )

    const initialInvalidIds = useMemo(
        () => getInvalidDimensionIds(allSourceIds, targetType, metadata),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [] // compute once on mount
    )

    const lockedIds = useMemo(() => new Set(initialInvalidIds), [initialInvalidIds])

    // discardedIds = invalid dims (auto-placed) + any dims the user drags/clicks there
    const [discardedIds, setDiscardedIds] = useState(initialInvalidIds)

    const discardedSet = useMemo(() => new Set(discardedIds), [discardedIds])

    // Target axes start empty
    const [draftLayout, setDraftLayout] = useState({
        [AXIS_ID_COLUMNS]: [],
        [AXIS_ID_ROWS]: [],
        [AXIS_ID_FILTERS]: [],
    })

    // Which chip is selected (for click-then-place): id + origin
    const [selectedChipId, setSelectedChipId] = useState(null)
    const [selectedOrigin, setSelectedOrigin] = useState(null)

    const [activeDragId, setActiveDragId] = useState(null)
    const [activeDragOrigin, setActiveDragOrigin] = useState(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    )

    const getDimension = useCallback(
        (id) => ({
            id,
            name: metadata[id]?.name || id,
            dimensionType: metadata[id]?.dimensionType,
        }),
        [metadata]
    )

    // IDs currently placed in any target axis
    const placedIds = useMemo(
        () =>
            new Set(
                targetAxes.flatMap((axisId) => draftLayout[axisId] || [])
            ),
        [draftLayout, targetAxes]
    )

    // For each source axis: show dims that aren't placed in target and aren't discarded
    const getSourceAxisDimensions = useCallback(
        (axisId) =>
            (currentLayout[axisId] || [])
                .filter((id) => !discardedSet.has(id) && !placedIds.has(id))
                .map(getDimension),
        [currentLayout, discardedSet, placedIds, getDimension]
    )

    // Find which target axis a given chip id currently lives in
    const findTargetAxisForId = useCallback(
        (id) => targetAxes.find((axisId) => (draftLayout[axisId] || []).includes(id)) ?? null,
        [draftLayout, targetAxes]
    )

    // ── Selection (click-to-select) ──

    const handleSourceChipSelect = (chipId) => {
        if (selectedChipId === chipId && selectedOrigin === 'source') {
            setSelectedChipId(null)
            setSelectedOrigin(null)
        } else {
            setSelectedChipId(chipId)
            setSelectedOrigin('source')
        }
    }

    const handleTargetChipSelect = (chipId) => {
        if (selectedChipId === chipId && selectedOrigin === 'target') {
            setSelectedChipId(null)
            setSelectedOrigin(null)
        } else {
            setSelectedChipId(chipId)
            setSelectedOrigin('target')
        }
    }

    const handleDropZoneClick = (axisId) => {
        if (!selectedChipId) return

        if (selectedOrigin === 'source') {
            setDraftLayout((prev) => ({
                ...prev,
                [axisId]: [...(prev[axisId] || []), selectedChipId],
            }))
        } else {
            // Move target chip to a different (or same) target axis
            setDraftLayout((prev) => {
                const next = { ...prev }
                for (const aId of targetAxes) {
                    next[aId] = (prev[aId] || []).filter((id) => id !== selectedChipId)
                }
                next[axisId] = [...(next[axisId] || []), selectedChipId]
                return next
            })
        }
        setSelectedChipId(null)
        setSelectedOrigin(null)
    }

    // Discard the selected chip (from source or target)
    const handleDiscardZoneClick = () => {
        if (!selectedChipId) return

        if (selectedOrigin === 'target') {
            // Remove from target layout
            setDraftLayout((prev) => {
                const next = { ...prev }
                for (const aId of targetAxes) {
                    next[aId] = (prev[aId] || []).filter((id) => id !== selectedChipId)
                }
                return next
            })
        }
        setDiscardedIds((prev) => [...prev, selectedChipId])
        setSelectedChipId(null)
        setSelectedOrigin(null)
    }

    // Return a discarded chip to the source pool (locked/invalid dims cannot be restored)
    const handleDiscardChipRemove = (chipId) => {
        if (lockedIds.has(chipId)) return
        setDiscardedIds((prev) => prev.filter((id) => id !== chipId))
        if (selectedChipId === chipId) {
            setSelectedChipId(null)
            setSelectedOrigin(null)
        }
    }

    // Add all remaining unplaced, non-discarded source dims to the given target axis
    const handleAddAll = useCallback(
        (axisId) => {
            const unplacedIds = allSourceIds.filter(
                (id) => !discardedSet.has(id) && !placedIds.has(id)
            )
            if (unplacedIds.length === 0) return
            setDraftLayout((prev) => ({
                ...prev,
                [axisId]: [...(prev[axisId] || []), ...unplacedIds],
            }))
            setSelectedChipId(null)
            setSelectedOrigin(null)
        },
        [allSourceIds, discardedSet, placedIds]
    )

    const handleAutoConvert = useCallback(() => {
        const unplaced = allSourceIds.filter(
            (id) => !discardedSet.has(id) && !placedIds.has(id)
        )
        const additions = {
            [AXIS_ID_COLUMNS]: [],
            [AXIS_ID_ROWS]: [],
            [AXIS_ID_FILTERS]: [],
        }
        for (const id of unplaced) {
            const dimType = metadata[id]?.dimensionType
            if (currentType === VIS_TYPE_LINE_LIST) {
                if (dimType === DIMENSION_TYPE_ORGANISATION_UNIT) additions[AXIS_ID_COLUMNS].push(id)
                else if (dimType === DIMENSION_TYPE_PERIOD) additions[AXIS_ID_ROWS].push(id)
                else additions[AXIS_ID_FILTERS].push(id)
            } else {
                if (dimType === DIMENSION_TYPE_ORGANISATION_UNIT) additions[AXIS_ID_COLUMNS].push(id)
                else if (dimType === DIMENSION_TYPE_PERIOD) additions[AXIS_ID_COLUMNS].push(id)
                else additions[AXIS_ID_FILTERS].push(id)
            }
        }
        setDraftLayout((prev) => ({
            [AXIS_ID_COLUMNS]: [...(prev[AXIS_ID_COLUMNS] || []), ...additions[AXIS_ID_COLUMNS]],
            [AXIS_ID_ROWS]: [...(prev[AXIS_ID_ROWS] || []), ...additions[AXIS_ID_ROWS]],
            [AXIS_ID_FILTERS]: [...(prev[AXIS_ID_FILTERS] || []), ...additions[AXIS_ID_FILTERS]],
        }))
        setSelectedChipId(null)
        setSelectedOrigin(null)
    }, [allSourceIds, discardedSet, placedIds, metadata, currentType])

    // ── Drag and drop ──

    const handleDragStart = ({ active }) => {
        const origin = active.data.current?.origin ?? null
        setActiveDragId(active.id)
        setActiveDragOrigin(origin)
        setSelectedChipId(null)
        setSelectedOrigin(null)
    }

    const handleDragEnd = ({ active, over }) => {
        setActiveDragId(null)
        setActiveDragOrigin(null)

        if (!over) return

        const activeId = active.id
        const overId = over.id
        const origin = active.data.current?.origin

        // Dropping onto the discard zone (from source or target)
        if (overId === DISCARD_ZONE_ID) {
            if (origin === 'target') {
                setDraftLayout((prev) => {
                    const next = { ...prev }
                    for (const aId of targetAxes) {
                        next[aId] = (prev[aId] || []).filter((id) => id !== activeId)
                    }
                    return next
                })
            }
            setDiscardedIds((prev) => [...prev, activeId])
            return
        }

        if (origin === 'source') {
            // Dragging from source into a target axis
            const targetAxisId = targetAxes.includes(overId)
                ? overId
                : over.data.current?.axisId ?? null

            if (!targetAxisId) return

            setDraftLayout((prev) => ({
                ...prev,
                [targetAxisId]: [...(prev[targetAxisId] || []), activeId],
            }))
        } else if (origin === 'target') {
            // Reordering / moving within target axes
            const fromAxisId = active.data.current?.axisId ?? findTargetAxisForId(activeId)
            const toAxisId = targetAxes.includes(overId)
                ? overId
                : over.data.current?.axisId ?? findTargetAxisForId(overId)

            if (!fromAxisId || !toAxisId) return

            if (fromAxisId === toAxisId) {
                const items = draftLayout[fromAxisId] || []
                const oldIndex = items.indexOf(activeId)
                const newIndex = items.indexOf(overId)
                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    setDraftLayout((prev) => ({
                        ...prev,
                        [fromAxisId]: arrayMove(items, oldIndex, newIndex),
                    }))
                }
            } else {
                setDraftLayout((prev) => {
                    const next = { ...prev }
                    next[fromAxisId] = (prev[fromAxisId] || []).filter((id) => id !== activeId)
                    next[toAxisId] = [...(prev[toAxisId] || []), activeId]
                    return next
                })
            }
        }
    }

    const handleConfirm = () => {
        const newLayout = {
            [AXIS_ID_COLUMNS]: draftLayout[AXIS_ID_COLUMNS] || [],
            [AXIS_ID_ROWS]: draftLayout[AXIS_ID_ROWS] || [],
            [AXIS_ID_FILTERS]: draftLayout[AXIS_ID_FILTERS] || [],
        }
        dispatch(acSetUiLayout(newLayout))
        dispatch(acSetUiType(targetType))
        onClose()
    }

    const SourceIcon = VIS_ICONS[currentType] || IconVisualizationLinelist16
    const TargetIcon = VIS_ICONS[targetType] || IconVisualizationPivotTable16

    const activeDimension = activeDragId ? getDimension(activeDragId) : null

    const hasAutoConvertable =
        !selectedChipId &&
        allSourceIds.some((id) => !discardedSet.has(id) && !placedIds.has(id))

    // Source axes: only highlight when a source chip is selected
    const sourceSelectedId = selectedOrigin === 'source' ? selectedChipId : null
    // Target axes: show "place here" for any active selection
    const targetSelectedId = selectedChipId

    // Render source axes in the same spatial arrangement as the real viz layout
    const renderSourceAxes = (type) => {
        const axis = (axisId) => (
            <SourceAxis
                key={axisId}
                axisId={axisId}
                dimensions={getSourceAxisDimensions(axisId)}
                selectedChipId={sourceSelectedId}
                onChipSelect={handleSourceChipSelect}
            />
        )
        if (type === VIS_TYPE_LINE_LIST) {
            return (
                <div className={styles.lineListLayout}>
                    <div className={styles.lineListLeft}>{axis(AXIS_ID_COLUMNS)}</div>
                    <div className={styles.lineListRight}>{axis(AXIS_ID_FILTERS)}</div>
                </div>
            )
        }
        if (type === VIS_TYPE_PIVOT_TABLE) {
            return (
                <div className={styles.pivotTableLayout}>
                    <div className={styles.pivotTableLeft}>
                        {axis(AXIS_ID_COLUMNS)}
                        {axis(AXIS_ID_ROWS)}
                    </div>
                    <div className={styles.pivotTableRight}>{axis(AXIS_ID_FILTERS)}</div>
                </div>
            )
        }
        return sourceAxes.map(axis)
    }

    // Render target axes in the same spatial arrangement as the real viz layout
    const renderTargetAxes = (type) => {
        const axis = (axisId) => (
            <TargetAxis
                key={axisId}
                axisId={axisId}
                dimensions={(draftLayout[axisId] || []).map(getDimension)}
                selectedChipId={targetSelectedId}
                hasUnplaced={placedIds.size < allSourceIds.length - discardedIds.length}
                onAddAll={handleAddAll}
                onChipSelect={handleTargetChipSelect}
                onDropZoneClick={handleDropZoneClick}
            />
        )
        if (type === VIS_TYPE_LINE_LIST) {
            return (
                <div className={styles.lineListLayout}>
                    <div className={styles.lineListLeft}>{axis(AXIS_ID_COLUMNS)}</div>
                    <div className={styles.lineListRight}>{axis(AXIS_ID_FILTERS)}</div>
                </div>
            )
        }
        if (type === VIS_TYPE_PIVOT_TABLE) {
            return (
                <div className={styles.pivotTableLayout}>
                    <div className={styles.pivotTableLeft}>
                        {axis(AXIS_ID_COLUMNS)}
                        {axis(AXIS_ID_ROWS)}
                    </div>
                    <div className={styles.pivotTableRight}>{axis(AXIS_ID_FILTERS)}</div>
                </div>
            )
        }
        return targetAxes.map(axis)
    }

    return (
        <Modal onClose={onClose} position="top" large>
            <ModalTitle>
                {i18n.t('Convert to {{targetType}}', {
                    targetType: VIS_LABELS[targetType],
                })}
            </ModalTitle>
            <ModalContent>
                <p className={styles.helpText}>
                    {i18n.t(
                        'Drag dimensions from the current layout into the target axes, or click a dimension to select it then click an axis to place it.'
                    )}
                </p>
                <DndContext
                    sensors={sensors}
                    collisionDetection={rectIntersection}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {/* ── Current / source section ── */}
                    <div className={styles.sectionWrapper}>
                        <div className={styles.sectionHeader}>
                            <SourceIcon color="var(--colors-grey700)" />
                            <span className={styles.sectionTitle}>
                                {VIS_LABELS[currentType]}
                            </span>
                        </div>
                        {renderSourceAxes(currentType)}
                    </div>

                    {/* ── Divider ── */}
                    <div className={styles.sectionDivider}>
                        {i18n.t('converting to')}
                    </div>

                    {/* ── Target section ── */}
                    <div className={styles.sectionWrapper}>
                        <div className={styles.sectionHeader}>
                            <TargetIcon color="var(--colors-grey700)" />
                            <span className={styles.sectionTitle}>
                                {VIS_LABELS[targetType]}
                            </span>
                            {hasAutoConvertable && (
                                <button
                                    className={styles.autoConvertBtn}
                                    onClick={handleAutoConvert}
                                >
                                    {i18n.t('Auto-convert')}
                                </button>
                            )}
                        </div>
                        {renderTargetAxes(targetType)}
                    </div>

                    {/* ── Discard zone ── */}
                    <DiscardZone
                        dimensions={discardedIds.map(getDimension)}
                        hasSelection={Boolean(selectedChipId)}
                        lockedIds={lockedIds}
                        onChipRemove={handleDiscardChipRemove}
                        onZoneClick={handleDiscardZoneClick}
                    />

                    <DragOverlay dropAnimation={null}>
                        {activeDimension && (
                            <div className={cx(styles.chip, styles.sourceChip)}>
                                <span className={styles.chipLabel}>
                                    {activeDimension.name}
                                </span>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button primary onClick={handleConfirm}>
                        {i18n.t('Convert to {{targetType}}', {
                            targetType: VIS_LABELS[targetType],
                        })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

ConversionDialog.propTypes = {
    targetType: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ConversionDialog
