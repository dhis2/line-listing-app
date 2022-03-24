import { AXIS_ID_FILTERS } from '@dhis2/analytics'
import { Tooltip } from '@dhis2/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../actions/ui.js'
import { sGetLoadError } from '../../reducers/loader.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import {
    sGetUiItemsByDimension,
    sGetUiConditionsByDimension,
} from '../../reducers/ui.js'
import DimensionMenu from '../DimensionMenu/DimensionMenu.js'
import { ChipBase } from './ChipBase.js'
import styles from './styles/Chip.module.css'
import { default as TooltipContent } from './TooltipContent.js'

const BEFORE = 'BEFORE'
const AFTER = 'AFTER'

const Chip = ({ dimension, axisId, isLast, overLastDropZone, activeIndex }) => {
    const dispatch = useDispatch()
    const { id, name, dimensionType, valueType, optionSet } = dimension

    const memoizedDimensionMetadata = useMemo(
        () => ({
            id,
            name,
            dimensionType,
            valueType,
            optionSet,
        }),
        [id, name, dimensionType, valueType, optionSet]
    )

    const {
        attributes,
        listeners,
        index,
        isDragging,
        isSorting,
        over,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id,
        data: memoizedDimensionMetadata,
    })
    const globalLoadError = useSelector(sGetLoadError)
    const metadata = useSelector(sGetMetadata)
    const conditions = useSelector((state) =>
        sGetUiConditionsByDimension(state, id)
    )
    const items = useSelector((state) => sGetUiItemsByDimension(state, id))
    const memoizedOnClick = useCallback(
        () => dispatch(acSetUiOpenDimensionModal(id)),
        [dispatch, id]
    )

    let insertPosition = undefined
    if (over?.id === id) {
        // This chip is being hovered over by a dragged item
        if (activeIndex === -1) {
            //This item came from the dimensions panel
            insertPosition = AFTER
        } else {
            insertPosition = index > activeIndex ? AFTER : BEFORE
        }
    }

    if (isLast && overLastDropZone) {
        insertPosition = AFTER
    }

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

    const randomId = Math.random().toString(36)

    const dataTest = `layout-chip-${id}`

    const renderTooltipContent = () => <TooltipContent dimension={dimension} />

    if (globalLoadError && !name) {
        return null
    }

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={isLast ? styles.isLast : null}
            style={style}
        >
            <div
                className={cx(styles.chip, {
                    [styles.chipEmpty]:
                        axisId === AXIS_ID_FILTERS &&
                        !items.length &&
                        !conditions?.condition?.length &&
                        !conditions.legendSet,
                    [styles.active]: isDragging,
                    [styles.insertBefore]: insertPosition === BEFORE,
                    [styles.insertAfter]: insertPosition === AFTER,
                    [styles.showBlank]: !name,
                })}
            >
                <div className={styles.content}>
                    {
                        <Tooltip
                            content={renderTooltipContent()}
                            placement="bottom"
                        >
                            {({ ref, onMouseOver, onMouseOut }) => (
                                <div
                                    data-test={dataTest}
                                    id={randomId}
                                    onClick={memoizedOnClick}
                                    ref={ref}
                                    onMouseOver={onMouseOver}
                                    onMouseOut={onMouseOut}
                                >
                                    <ChipBase
                                        dimension={dimension}
                                        conditions={conditions}
                                        items={items}
                                        metadata={metadata}
                                    />
                                </div>
                            )}
                        </Tooltip>
                    }
                    <DimensionMenu dimensionId={id} currentAxisId={axisId} />
                </div>
            </div>
        </div>
    )
}

Chip.propTypes = {
    dimension: PropTypes.object.isRequired,
    activeIndex: PropTypes.number,
    axisId: PropTypes.string,
    isLast: PropTypes.bool,
    overLastDropZone: PropTypes.bool,
}

export default Chip
