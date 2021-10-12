import { DimensionMenu, VIS_TYPE_PIE } from '@dhis2/analytics'
import { Layer, Popper } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import {
    acAddUiLayoutDimensions,
    acRemoveUiLayoutDimensions,
} from '../../actions/ui'
import MoreHorizontalIcon from '../../assets/MoreHorizontalIcon'
import IconButton from '../IconButton/IconButton'
import { styles } from './styles/Menu.style'

const ChipMenu = ({
    axisItemHandler,
    currentAxisId,
    dimensionId,
    removeItemHandler,
    visType,
}) => {
    const buttonRef = useRef()
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const toggleMenu = () => setMenuIsOpen(!menuIsOpen)

    const getMenuId = () => `menu-for-${dimensionId}`

    return (
        <>
            <div ref={buttonRef}>
                <IconButton
                    ariaOwns={menuIsOpen ? getMenuId() : null}
                    ariaHaspopup={true}
                    onClick={toggleMenu}
                    style={styles.icon}
                    dataTest={`layout-chip-menu-button-${dimensionId}`}
                >
                    <MoreHorizontalIcon style={styles.icon} />
                </IconButton>
            </div>
            {menuIsOpen && (
                <Layer onClick={toggleMenu}>
                    <Popper reference={buttonRef} placement="bottom-start">
                        <DimensionMenu
                            dimensionId={dimensionId}
                            currentAxisId={currentAxisId}
                            visType={visType || VIS_TYPE_PIE} // TODO: Change this once LL has its own type (temp fix since pie has same axes as LL)
                            axisItemHandler={axisItemHandler}
                            removeItemHandler={removeItemHandler}
                            onClose={toggleMenu}
                            dataTest={'layout-chip-menu-dimension-menu'}
                        />
                    </Popper>
                </Layer>
            )}
        </>
    )
}

ChipMenu.propTypes = {
    axisItemHandler: PropTypes.func,
    currentAxisId: PropTypes.string,
    dimensionId: PropTypes.string,
    removeItemHandler: PropTypes.func,
    visType: PropTypes.string,
}

const mapDispatchToProps = dispatch => ({
    axisItemHandler: ({ dimensionId, axisId }) => {
        dispatch(acAddUiLayoutDimensions({ [dimensionId]: { axisId } }))
    },
    removeItemHandler: dimensionId => {
        dispatch(acRemoveUiLayoutDimensions(dimensionId))
    },
})

export default connect(null, mapDispatchToProps)(ChipMenu)
