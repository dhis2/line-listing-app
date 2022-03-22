import { Layer, Popper, IconMore16 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
    acAddUiLayoutDimensions,
    acRemoveUiLayoutDimensions,
} from '../../actions/ui.js'
import IconButton from '../IconButton/IconButton.js'
import styles from './DimensionMenu.module.css'
import MenuItems from './MenuItems.js'

const getAxisIdForDimension = (dimensionId, layout) => {
    const axisLayout = Object.entries(layout).find(([, dimensionIds]) =>
        dimensionIds.includes(dimensionId)
    )

    return axisLayout ? axisLayout[0] : undefined
}

const DimensionMenu = ({
    currentAxisId,
    dimensionId,
    dimensionMetadata,
    visType,
    layout,
}) => {
    const dispatch = useDispatch()

    const axisId = currentAxisId || getAxisIdForDimension(dimensionId, layout)

    const buttonRef = useRef()
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const toggleMenu = () => setMenuIsOpen(!menuIsOpen)

    const getMenuId = () => `menu-for-${dimensionId}`

    const axisItemHandler = ({ dimensionId, axisId }) => {
        dispatch(
            acAddUiLayoutDimensions(
                { [dimensionId]: { axisId } },
                dimensionMetadata
            )
        )
    }

    const removeItemHandler = (id) => dispatch(acRemoveUiLayoutDimensions(id))

    return (
        <>
            <div
                ref={buttonRef}
                className={cx(styles.button, {
                    [styles.hidden]: !currentAxisId,
                })}
            >
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
    dimensionMetadata: PropTypes.object,
    layout: PropTypes.object,
    visType: PropTypes.string,
}

const MemoizedDimensionMenu = React.memo(DimensionMenu)

export default MemoizedDimensionMenu
