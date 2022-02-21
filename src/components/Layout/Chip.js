import { Tooltip } from '@dhis2/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { ChipBase } from './ChipBase.js'
import styles from './styles/Chip.module.css'
import { default as TooltipContent } from './TooltipContent.js'

const BEFORE = 'BEFORE'
const AFTER = 'AFTER'

const Chip = ({
    numberOfConditions,
    dimensionId,
    dimensionName,
    dimensionType,
    items,
    onClick,
    contextMenu,
    activeIndex,
}) => {
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
        },
    })

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

    const renderTooltipContent = () => (
        <TooltipContent dimensionId={dimensionId} itemIds={items} />
    )

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cx(styles.chipWrapper, {
                [styles.chipEmpty]: !items.length && !numberOfConditions,
                [styles.active]: isDragging,
                [styles.insertBefore]: insertPosition === BEFORE,
                [styles.insertAfter]: insertPosition === AFTER,
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
                                className={cx(styles.chip, styles.chipLeft)}
                                onClick={onClick}
                                ref={ref}
                                onMouseOver={onMouseOver}
                                onMouseOut={onMouseOut}
                            >
                                <ChipBase
                                    dimensionName={dimensionName}
                                    dimensionType={dimensionType}
                                    numberOfConditions={numberOfConditions}
                                    items={items}
                                />
                            </div>
                        )}
                    </Tooltip>
                }
                {contextMenu && (
                    <div className={cx(styles.chip, styles.chipRight)}>
                        {contextMenu}
                    </div>
                )}
            </div>
        </div>
    )
}

Chip.propTypes = {
    dimensionId: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    activeIndex: PropTypes.number,
    contextMenu: PropTypes.object,
    dimensionName: PropTypes.string,
    dimensionType: PropTypes.string,
    items: PropTypes.array,
    numberOfConditions: PropTypes.number,
}

Chip.defaultProps = {
    conditions: [],
    items: [],
}

export default Chip
