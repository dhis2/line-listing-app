import i18n from '@dhis2/d2-i18n'
import { FlyoutMenu, Layer, MenuItem, Popper } from '@dhis2/ui'
import React, { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acToggleUiSidebarHidden,
    acToggleUiLayoutPanelHidden,
    acSetUiDetailsPanelOpen,
} from '../../../actions/ui.js'
import {
    sGetUiLayoutPanelHidden,
    sGetUiSidebarHidden,
    sGetUiShowDetailsPanel,
} from '../../../reducers/ui.js'
import MenuButton from './MenuButton.js'

export default function ViewDropDown() {
    const dispatch = useDispatch()
    const isSidebarHidden = useSelector(sGetUiSidebarHidden)
    const isLayoutPanelHidden = useSelector(sGetUiLayoutPanelHidden)
    const isDetailsPanelOpen = useSelector(sGetUiShowDetailsPanel)
    const [isOpen, setIsOpen] = useState(false)
    const buttonRef = useRef()

    const toggleMenuOpen = useCallback(() => {
        setIsOpen((currentIsOpen) => !currentIsOpen)
    }, [setIsOpen])

    const toggleLayoutPanelHidden = useCallback(() => {
        dispatch(acToggleUiLayoutPanelHidden())
        toggleMenuOpen()
    }, [dispatch, toggleMenuOpen])

    const toggleSidebarHidden = useCallback(() => {
        dispatch(acToggleUiSidebarHidden())
        toggleMenuOpen()
    }, [dispatch, toggleMenuOpen])

    const toggleDetailsPanelOpen = useCallback(() => {
        dispatch(acSetUiDetailsPanelOpen(!isDetailsPanelOpen))
        toggleMenuOpen()
    }, [dispatch, isDetailsPanelOpen, toggleMenuOpen])

    const toggleLayoutPanelText = isLayoutPanelHidden
        ? i18n.t('Show layout')
        : i18n.t('Hide layout')
    const toggleSidebarText = isSidebarHidden
        ? i18n.t('Show dimensions sidebar')
        : i18n.t('Hide dimensions sidebar')
    const toggleDetailsPanelText = isDetailsPanelOpen
        ? i18n.t('Hide interpretations and details')
        : i18n.t('Show interpretations and details')

    return (
        <>
            <MenuButton ref={buttonRef} onClick={toggleMenuOpen}>
                {i18n.t('View')}
            </MenuButton>
            {isOpen && (
                <Layer onBackdropClick={toggleMenuOpen}>
                    <Popper reference={buttonRef} placement="bottom-start">
                        <FlyoutMenu>
                            <MenuItem
                                label={toggleLayoutPanelText}
                                onClick={toggleLayoutPanelHidden}
                            />
                            <MenuItem
                                label={toggleSidebarText}
                                onClick={toggleSidebarHidden}
                            />
                            <MenuItem
                                label={toggleDetailsPanelText}
                                onClick={toggleDetailsPanelOpen}
                            />
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </>
    )
}
