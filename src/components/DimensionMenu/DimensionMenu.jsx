import { Layer, Popper, IconMore16 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    acAddUiLayoutDimensions,
    acRemoveUiLayoutDimensions,
} from '../../actions/ui.js'
import { sGetUiType, sGetUiLayout } from '../../reducers/ui.js'
import IconButton from '../IconButton/IconButton.jsx'
import styles from './DimensionMenu.module.css'
import MenuItems from './MenuItems.jsx'

const getAxisIdForDimension = (dimensionId, layout) => {
    const axisLayout = Object.entries(layout).find(([, dimensionIds]) =>
        dimensionIds.includes(dimensionId)
    )

    return axisLayout ? axisLayout[0] : undefined
}

const DimensionMenu = ({ currentAxisId, dimensionId, dimensionMetadata }) => {
    const dispatch = useDispatch()
    const visType = useSelector(sGetUiType)
    const layout = useSelector(sGetUiLayout)

    const axisId = currentAxisId || getAxisIdForDimension(dimensionId, layout)

    const buttonRef = useRef()
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const toggleMenu = (e) => {
        setMenuIsOpen(!menuIsOpen)
        e && e.stopPropagation()
    }

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
                data-test={'dimension-menu-button'}
            >
                <IconButton
                    ariaOwns={menuIsOpen ? getMenuId() : null}
                    ariaHaspopup={true}
                    onClick={toggleMenu}
                    dataTest={`dimension-menu-button-${dimensionId}`}
                >
                    <IconMore16 />
                </IconButton>
            </div>
            {menuIsOpen && (
                <Layer onBackdropClick={(_, e) => toggleMenu(e)}>
                    <Popper reference={buttonRef} placement="bottom-start">
                        <MenuItems
                            dimensionId={dimensionId}
                            currentAxisId={axisId}
                            visType={visType}
                            axisItemHandler={axisItemHandler}
                            removeItemHandler={removeItemHandler}
                            onClose={toggleMenu}
                            dataTest={`dimension-menu-${dimensionId}`}
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
}

export default DimensionMenu
