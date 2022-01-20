import { Layer, Popper, IconMore16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import {
    acAddUiLayoutDimensions,
    acRemoveUiLayoutDimensions,
} from '../../actions/ui.js'
import DimensionMenu from '../DimensionMenu/DimensionMenu.js'
import IconButton from '../IconButton/IconButton.js'

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
                    dataTest={`layout-chip-menu-button-${dimensionId}`}
                >
                    <IconMore16 />
                </IconButton>
            </div>
            {menuIsOpen && (
                <Layer onClick={toggleMenu}>
                    <Popper reference={buttonRef} placement="bottom-start">
                        <DimensionMenu
                            dimensionId={dimensionId}
                            currentAxisId={currentAxisId}
                            visType={visType}
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

const mapDispatchToProps = (dispatch) => ({
    axisItemHandler: ({ dimensionId, axisId }) => {
        dispatch(acAddUiLayoutDimensions({ [dimensionId]: { axisId } }))
    },
    removeItemHandler: (dimensionId) => {
        dispatch(acRemoveUiLayoutDimensions(dimensionId))
    },
})

export default connect(null, mapDispatchToProps)(ChipMenu)
