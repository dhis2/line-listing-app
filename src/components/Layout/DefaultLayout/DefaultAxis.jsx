import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import i18n from '@dhis2/d2-i18n'
import { Layer, Popper, FlyoutMenu, MenuItem, MenuDivider } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    acSetUiOpenDimensionModal,
    acRemoveUiLayoutDimensions,
    acRemoveUiItems,
    acSetUiLayout,
} from '../../../actions/ui.js'
import { getAxisName } from '../../../modules/axis.js'
import { getDimensionsWithSuffix } from '../../../modules/getDimensionsWithSuffix.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import {
    sGetUiDraggingId,
    sGetUiDimensionIdsByAxisId,
    sGetUiInputType,
    sGetUiLayout,
    renderChipsSelector,
} from '../../../reducers/ui.js'
import { LAST, getDropzoneId } from '../../DndContext.jsx'
import Chip from '../Chip.jsx'
import { DropZone } from './DropZone.jsx'
import styles from './styles/DefaultAxis.module.css'

const DefaultAxis = ({ axisId, className }) => {
    const lastDropZoneId = getDropzoneId(axisId, LAST)
    const { over, setNodeRef } = useDroppable({
        id: lastDropZoneId,
    })

    const dispatch = useDispatch()
    const dimensionIds = useSelector((state) =>
        sGetUiDimensionIdsByAxisId(state, axisId)
    )
    const layout = useSelector(sGetUiLayout)
    const renderChips = useSelector(renderChipsSelector)
    const draggingId = useSelector(sGetUiDraggingId)
    const metadata = useSelector(sGetMetadata)
    const inputType = useSelector(sGetUiInputType)

    const activeIndex = draggingId ? dimensionIds.indexOf(draggingId) : -1

    const overLastDropZone = over?.id === lastDropZoneId

    // Axis menu state
    const [menuOpen, setMenuOpen] = useState(false)
    const labelRef = useRef()

    const toggleMenu = (e) => {
        setMenuOpen(!menuOpen)
        e?.stopPropagation()
    }

    const closeMenu = () => setMenuOpen(false)

    const axisName = getAxisName(axisId)

    const handleClearAxis = () => {
        if (dimensionIds.length > 0) {
            dispatch(acRemoveUiLayoutDimensions(dimensionIds))
            dispatch(acRemoveUiItems(dimensionIds))
        }
        closeMenu()
    }

    // Sort dimensions alphabetically by name (A-Z)
    const handleArrangeAlphabetically = () => {
        if (dimensionIds.length <= 1) {
            closeMenu()
            return
        }

        const sortedIds = [...dimensionIds].sort((a, b) => {
            const nameA = (metadata[a]?.name || a).toLowerCase()
            const nameB = (metadata[b]?.name || b).toLowerCase()
            return nameA.localeCompare(nameB)
        })

        dispatch(
            acSetUiLayout({
                ...layout,
                [axisId]: sortedIds,
            })
        )
        closeMenu()
    }

    // Sort dimensions by type, then alphabetically within each type
    const handleArrangeByType = () => {
        if (dimensionIds.length <= 1) {
            closeMenu()
            return
        }

        const sortedIds = [...dimensionIds].sort((a, b) => {
            const typeA = (
                metadata[a]?.dimensionType ||
                metadata[a]?.valueType ||
                ''
            ).toLowerCase()
            const typeB = (
                metadata[b]?.dimensionType ||
                metadata[b]?.valueType ||
                ''
            ).toLowerCase()

            // First sort by type
            const typeCompare = typeA.localeCompare(typeB)
            if (typeCompare !== 0) return typeCompare

            // Then sort alphabetically within the same type
            const nameA = (metadata[a]?.name || a).toLowerCase()
            const nameB = (metadata[b]?.name || b).toLowerCase()
            return nameA.localeCompare(nameB)
        })

        dispatch(
            acSetUiLayout({
                ...layout,
                [axisId]: sortedIds,
            })
        )
        closeMenu()
    }

    const hasDimensions = dimensionIds.length > 0
    const hasMultipleDimensions = dimensionIds.length > 1

    return (
        <div ref={setNodeRef} className={styles.lastDropzone}>
            <div id={axisId} className={cx(styles.axisContainer, className)}>
                <div className={styles.label}>
                    <span
                        ref={labelRef}
                        className={styles.labelClickable}
                        onClick={toggleMenu}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                toggleMenu(e)
                            }
                        }}
                    >
                        {axisName}
                    </span>
                    {menuOpen && (
                        <Layer onBackdropClick={closeMenu}>
                            <Popper
                                reference={labelRef}
                                placement="bottom-start"
                            >
                                <FlyoutMenu
                                    dense
                                    dataTest={`axis-menu-${axisId}`}
                                >
                                    <MenuItem
                                        label={i18n.t('Arrange items A-Z')}
                                        onClick={handleArrangeAlphabetically}
                                        disabled={!hasMultipleDimensions}
                                        dataTest={`axis-menu-arrange-az-${axisId}`}
                                    />
                                    <MenuItem
                                        label={i18n.t('Arrange items by type')}
                                        onClick={handleArrangeByType}
                                        disabled={!hasMultipleDimensions}
                                        dataTest={`axis-menu-arrange-type-${axisId}`}
                                    />
                                    <MenuDivider dense />
                                    <MenuItem
                                        destructive
                                        label={i18n.t('Clear {{axisName}}', {
                                            axisName,
                                        })}
                                        onClick={handleClearAxis}
                                        disabled={!hasDimensions}
                                        dataTest={`axis-menu-clear-${axisId}`}
                                    />
                                </FlyoutMenu>
                            </Popper>
                        </Layer>
                    )}
                </div>
                <SortableContext id={axisId} items={dimensionIds}>
                    <div
                        className={styles.content}
                        data-test={`${axisId}-axis`}
                    >
                        <DropZone
                            axisId={axisId}
                            firstElementId={dimensionIds[0]}
                            overLastDropZone={overLastDropZone}
                        />
                        {renderChips &&
                            getDimensionsWithSuffix({
                                dimensionIds,
                                metadata,
                                inputType,
                            }).map((dimension, i) => (
                                <Chip
                                    key={`${axisId}-${dimension.id}`}
                                    onClick={() =>
                                        dispatch(
                                            acSetUiOpenDimensionModal(
                                                dimension.id
                                            )
                                        )
                                    }
                                    dimension={dimension}
                                    axisId={axisId}
                                    isLast={i === dimensionIds.length - 1}
                                    overLastDropZone={overLastDropZone}
                                    activeIndex={activeIndex}
                                />
                            ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    )
}

DefaultAxis.propTypes = {
    axisId: PropTypes.string,
    className: PropTypes.string,
}

export default DefaultAxis
