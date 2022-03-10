import { AXIS_ID_FILTERS } from '@dhis2/analytics'
import { Tooltip } from '@dhis2/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
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

const Chip = ({
    dimension,
    axisId,
    isLast,
    overLastDropZone,
    onClick,
    activeIndex,
}) => {
    const {
        id: dimensionId,
        name: dimensionName,
        dimensionType,
        valueType,
        optionSet,
    } = dimension

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
        id: dimensionId,
        data: {
            name: dimensionName,
            dimensionType,
            valueType,
            optionSet,
        },
    })
    const globalLoadError = useSelector(sGetLoadError)
    const metadata = useSelector(sGetMetadata)
    const conditions =
        useSelector((state) =>
            sGetUiConditionsByDimension(state, dimension.id)
        ) || {}
    const items =
        useSelector((state) => sGetUiItemsByDimension(state, dimension.id)) ||
        []

    let insertPosition = undefined
    if (over?.id === dimensionId) {
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

    const id = Math.random().toString(36)

    const dataTest = `layout-chip-${dimensionId}`

    const renderTooltipContent = () => <TooltipContent dimension={dimension} />

    if (globalLoadError && !dimensionName) {
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
                        !conditions.condition?.length &&
                        !conditions.legendSet,
                    [styles.active]: isDragging,
                    [styles.insertBefore]: insertPosition === BEFORE,
                    [styles.insertAfter]: insertPosition === AFTER,
                    [styles.showBlank]: !dimensionName,
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
                                    id={id}
                                    onClick={onClick}
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
                    <DimensionMenu
                        dimensionId={dimensionId}
                        currentAxisId={axisId}
                    />
                </div>
            </div>
        </div>
    )
}

Chip.propTypes = {
    dimension: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    activeIndex: PropTypes.number,
    axisId: PropTypes.string,
    isLast: PropTypes.bool,
    overLastDropZone: PropTypes.bool,
}

export default Chip
