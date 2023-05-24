import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiDetailsPanelOpen } from '../../actions/ui.js'
import {
    InterpretationsAndDetailsToggler as AnalyticsInterpretationsAndDetailsToggler,
    Toolbar,
} from '../../analyticsComponents/index.js'
import { sGetCurrentId } from '../../reducers/current.js'
import { sGetUiShowDetailsPanel } from '../../reducers/ui.js'

export const InterpretationsAndDetailsToggler = () => {
    const showDetailsPanel = useSelector(sGetUiShowDetailsPanel)
    const id = useSelector(sGetCurrentId)
    const dispatch = useDispatch()
    const onClick = () => {
        dispatch(acSetUiDetailsPanelOpen(!showDetailsPanel))
    }

    return (
        <Toolbar.Aside>
            <AnalyticsInterpretationsAndDetailsToggler
                disabled={!id}
                onClick={onClick}
                isShowing={showDetailsPanel}
            />
        </Toolbar.Aside>
    )
}
