// TODO: Refactor chip to contain less logic
import {
    getPredefinedDimensionProp,
    DIMENSION_PROP_NO_ITEMS,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { sGetDimensions } from '../../reducers/dimensions'
//import DynamicDimensionIcon from '../../assets/DynamicDimensionIcon'
// import { setDataTransfer } from '../../modules/dnd'
// import { sGetDimensions } from '../../reducers/dimensions'
import { sGetMetadata } from '../../reducers/metadata'
import { styles } from './styles/Chip.style'
import TooltipContent from './TooltipContent'

const Chip = ({
    dimensionId,
    dimensionName,
    //axisId,
    items,
    onClick,
    contextMenu,
}) => {
    const id = Math.random().toString(36)

    const dataTest = `layout-chip-${dimensionId}`

    const handleClick = () => {
        if (!getPredefinedDimensionProp(dimensionId, DIMENSION_PROP_NO_ITEMS)) {
            onClick()
        }
    }

    const getDragStartHandler = () => event => {
        console.log(event) //setDataTransfer(event, axisId)
    }

    const getWrapperStyles = () => ({
        ...styles.chipWrapper,
        ...(!getPredefinedDimensionProp(dimensionId, DIMENSION_PROP_NO_ITEMS) &&
        !items.length
            ? styles.chipEmpty
            : {}),
    })

    const renderChipLabelSuffix = () => {
        const itemsLabel = i18n.t('{{total}} selected', {
            total: items.length,
        })
        return items.length > 0 ? `: ${itemsLabel}` : ''
    }

    // const renderChipIcon = () => {
    //     const Icon = getPredefinedDimensionProp(dimensionId, 'icon')
    //     return Icon ? (
    //         <Icon style={styles.fixedDimensionIcon} />
    //     ) : (
    //         <DynamicDimensionIcon style={styles.dynamicDimensionIcon} />
    //     )
    // }

    const renderTooltipContent = () => (
        <TooltipContent dimensionId={dimensionId} itemIds={items} />
    )

    const renderChipContent = () => (
        <>
            {/* <div style={styles.leftIconWrapper}>{renderChipIcon()}</div> */}
            <span style={styles.label}>{dimensionName}</span>
            <span>{renderChipLabelSuffix()}</span>
        </>
    )

    return (
        <div
            style={getWrapperStyles()}
            data-dimensionid={dimensionId}
            onDragStart={getDragStartHandler()}
        >
            {
                <Tooltip content={renderTooltipContent()} placement="bottom">
                    {({ ref, onMouseOver, onMouseOut }) => (
                        <div
                            data-test={dataTest}
                            id={id}
                            style={styles.chipLeft}
                            onClick={handleClick}
                            ref={ref}
                            onMouseOver={onMouseOver}
                            onMouseOut={onMouseOut}
                        >
                            {renderChipContent()}
                        </div>
                    )}
                </Tooltip>
            }
            {contextMenu && <div style={styles.chipRight}> {contextMenu}</div>}
        </div>
    )
}

Chip.propTypes = {
    //axisId: PropTypes.string.isRequired,
    dimensionId: PropTypes.string.isRequired,
    dimensionName: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    contextMenu: PropTypes.object,
    items: PropTypes.array,
}

Chip.defaultProps = {
    items: [],
}

const mapStateToProps = (state, ownProps) => ({
    dimensionName: (sGetDimensions(state)[ownProps.dimensionId] || {}).name,
    metadata: sGetMetadata(state),
})

export default connect(mapStateToProps)(Chip)
