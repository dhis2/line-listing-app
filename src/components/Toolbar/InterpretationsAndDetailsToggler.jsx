import { InterpretationsAndDetailsToggler as AnalyticsInterpretationsAndDetailsToggler } from '@dhis2/analytics'
import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiDetailsPanelOpen } from '../../actions/ui.js'
import { sGetCurrentId } from '../../reducers/current.js'
import { sGetUiShowDetailsPanel } from '../../reducers/ui.js'

export const InterpretationsAndDetailsToggler = () => {
    const showDetailsPanel = useSelector(sGetUiShowDetailsPanel)
    const id = useSelector(sGetCurrentId)
    const dispatch = useDispatch()
    const onClick = useCallback(() => {
        dispatch(acSetUiDetailsPanelOpen(!showDetailsPanel))
    }, [dispatch, showDetailsPanel])

    return (
        <AnalyticsInterpretationsAndDetailsToggler
            disabled={!id}
            onClick={onClick}
            isShowing={showDetailsPanel}
        />
    )
}
