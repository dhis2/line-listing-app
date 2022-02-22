import { Layer, Popper, IconMore16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    acAddUiLayoutDimensions,
    acRemoveUiLayoutDimensions,
} from '../../actions/ui.js'
import { sGetUiType, sGetUiLayout } from '../../reducers/ui.js'
import IconButton from '../IconButton/IconButton.js'
import MenuItems from './MenuItems.js'

const getAxisIdForDimension = (dimensionId, layout) => {
    const axisLayout = Object.entries(layout).find(([, dimensionIds]) =>
        dimensionIds.includes(dimensionId)
    )

    return axisLayout ? axisLayout[0] : undefined
}

const DimensionMenu = ({ currentAxisId, dimensionId }) => {
    const dispatch = useDispatch()
    const visType = useSelector(sGetUiType)
    const layout = useSelector(sGetUiLayout)

    const axisId = currentAxisId || getAxisIdForDimension(dimensionId, layout)

    const buttonRef = useRef()
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const toggleMenu = () => setMenuIsOpen(!menuIsOpen)

    const getMenuId = () => `menu-for-${dimensionId}`

    const axisItemHandler = ({ dimensionId, axisId }) => {
        dispatch(acAddUiLayoutDimensions({ [dimensionId]: { axisId } }))
    }

    const removeItemHandler = (id) => dispatch(acRemoveUiLayoutDimensions(id))

    return (
        <>
            <div ref={buttonRef}>
                <IconButton
                    ariaOwns={menuIsOpen ? getMenuId() : null}
                    ariaHaspopup={true}
                    onClick={toggleMenu}
                    dataTest={`layout-dimension-menu-button-${dimensionId}`}
                >
                    <IconMore16 />
                </IconButton>
            </div>
            {menuIsOpen && (
                <Layer onClick={toggleMenu}>
                    <Popper reference={buttonRef} placement="bottom-start">
                        <MenuItems
                            dimensionId={dimensionId}
                            currentAxisId={axisId}
                            visType={visType}
                            axisItemHandler={axisItemHandler}
                            removeItemHandler={removeItemHandler}
                            onClose={toggleMenu}
                            dataTest={'layout-dimension-menu-dimension-menu'}
                        />
                    </Popper>
                </Layer>
            )}
        </>
    )
}

DimensionMenu.propTypes = {
    currentAxisId: PropTypes.string,
    dimensionId: PropTypes.string,
}

export default DimensionMenu
