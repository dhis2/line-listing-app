import i18n from '@dhis2/d2-i18n'
import { Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import DynamicDimensionIcon from '../../assets/DynamicDimensionIcon'
import { setDataTransfer } from '../../modules/dnd'
import { sGetMetadata } from '../../reducers/metadata'
import styles from './styles/Chip.module.css'
import { default as TooltipContent } from './TooltipContent'

const Chip = ({
    conditions,
    dimensionId,
    dimensionName,
    axisId,
    items,
    onClick,
    contextMenu,
}) => {
    const id = Math.random().toString(36)

    const dataTest = `layout-chip-${dimensionId}`

    const getDragStartHandler = () => (event) => {
        setDataTransfer(event, axisId)
    }

    const renderChipLabelSuffix = () => {
        let itemsLabel = ''
        if (items.length) {
            itemsLabel = i18n.t('{{count}} selected', {
                count: items.length,
            })
        } else if (conditions.length) {
            itemsLabel = i18n.t('{{count}} conditions', {
                count: conditions.length,
                defaultValue: '{{count}} condition',
                defaultValue_plural: '{{count}} conditions',
            })
        }
        return itemsLabel ? `: ${itemsLabel}` : ''
    }

    const renderChipIcon = () => {
        // TODO: Add the chip icons once they've been spec'ed properly
        return <DynamicDimensionIcon />
    }

    const renderTooltipContent = () => (
        <TooltipContent dimensionId={dimensionId} itemIds={items} />
    )

    const renderChipContent = () => (
        <>
            <div className={styles.leftIconWrapper}>{renderChipIcon()}</div>
            <span className={styles.label}>{dimensionName}</span>
            <span>{renderChipLabelSuffix()}</span>
        </>
    )

    return (
        <div
            className={cx(styles.chipWrapper, {
                [styles.chipEmpty]: !items.length && !conditions.length,
            })}
            data-dimensionid={dimensionId}
            onDragStart={getDragStartHandler()}
        >
            {
                <Tooltip content={renderTooltipContent()} placement="bottom">
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
                            {renderChipContent()}
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
    )
}

Chip.propTypes = {
    axisId: PropTypes.string.isRequired,
    dimensionId: PropTypes.string.isRequired,
    dimensionName: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    conditions: PropTypes.array,
    contextMenu: PropTypes.object,
    items: PropTypes.array,
}

Chip.defaultProps = {
    conditions: [],
    items: [],
}

const mapStateToProps = (state, ownProps) => ({
    dimensionName: (sGetMetadata(state)[ownProps.dimensionId] || {}).name,
})

export default connect(mapStateToProps)(Chip)
