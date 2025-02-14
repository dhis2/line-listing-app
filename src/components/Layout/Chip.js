import { AXIS_ID_FILTERS } from '@dhis2/analytics'
import { Tooltip } from '@dhis2/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import { getConditionsTexts } from '../../modules/conditions.js'
import { sGetLoadError } from '../../reducers/loader.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import {
    sGetUiItemsByDimension,
    sGetUiConditionsByDimension,
    sGetUiOptions,
    sGetUiInputType,
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
    const { id, name, dimensionType, valueType, optionSet } = dimension

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
        data: {
            name,
            dimensionType,
            valueType,
            optionSet,
        },
    })

    const metadata = useSelector(sGetMetadata)
    const inputType = useSelector(sGetUiInputType)
    const { digitGroupSeparator } = useSelector(sGetUiOptions)
    const conditions = useSelector((state) =>
        sGetUiConditionsByDimension(state, dimension.id)
    )
    const items = useSelector((state) =>
        sGetUiItemsByDimension(state, dimension.id)
    )

    const globalLoadError = useSelector(sGetLoadError)
    if (globalLoadError && !name) {
        return null
    }

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

    const conditionsTexts = getConditionsTexts({
        conditions,
        metadata,
        dimension,
        formatValueOptions: { digitGroupSeparator, skipRounding: false },
    })

    const renderTooltipContent = () => (
        <TooltipContent
            dimension={dimension}
            conditionsTexts={conditionsTexts}
            axisId={axisId}
        />
    )

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
                    [styles.showBlank]: !name,
                })}
            >
                <div className={styles.content} data-test={`layout-chip-${id}`}>
                    {
                        <Tooltip
                            content={renderTooltipContent()}
                            placement="bottom"
                            dataTest="layout-chip-tooltip"
                            closeDelay={0}
                        >
                            {({ ref, onMouseOver, onMouseOut }) => (
                                <div
                                    id={Math.random().toString(36)}
                                    onClick={onClick}
                                    ref={ref}
                                    onMouseOver={onMouseOver}
                                    onMouseOut={onMouseOut}
                                >
                                    <ChipBase
                                        dimension={dimension}
                                        conditionsLength={
                                            conditionsTexts.length
                                        }
                                        itemsLength={items.length}
                                        inputType={inputType}
                                        axisId={axisId}
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
    onClick: PropTypes.func.isRequired,
    activeIndex: PropTypes.number,
    axisId: PropTypes.string,
    isLast: PropTypes.bool,
    overLastDropZone: PropTypes.bool,
}

export default Chip
