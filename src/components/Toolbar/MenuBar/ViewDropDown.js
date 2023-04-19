import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acSetUiSidebarHidden,
    acSetUiLayoutPanelHidden,
} from '../../../actions/ui.js'
import {
    sGetSetUiLayoutPanelHidden,
    sGetSetUiSidebarHidden,
} from '../../../reducers/ui.js'

export default function ViewDropDown() {
    const dispatch = useDispatch()
    const isSidebarHidden = useSelector(sGetSetUiSidebarHidden)
    const isLayoutPanelHidden = useSelector(sGetSetUiLayoutPanelHidden)
    const toggleSidebarHidden = useCallback(
        () => dispatch(acSetUiSidebarHidden(!isSidebarHidden)),
        [dispatch, isSidebarHidden]
    )
    const toggleLayoutPanelHidden = useCallback(
        () => dispatch(acSetUiLayoutPanelHidden(!isLayoutPanelHidden)),
        [dispatch, isLayoutPanelHidden]
    )
    return (
        <>
            <button onClick={toggleSidebarHidden}>Toggle sidebar</button>
            <button onClick={toggleLayoutPanelHidden}>
                Toggle layout panel
            </button>
        </>
    )
}
