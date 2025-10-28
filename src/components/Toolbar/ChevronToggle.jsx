import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiDetailsPanelOpen } from '../../actions/ui.js'
import { sGetCurrentId } from '../../reducers/current.js'
import { sGetUiShowDetailsPanel } from '../../reducers/ui.js'
import styles from './ChevronToggle.module.css'
import { IconChevronRight16, IconChevronLeft16 } from '@dhis2/ui'

export const ChevronToggle = () => {
    const showDetailsPanel = useSelector(sGetUiShowDetailsPanel)
    const id = useSelector(sGetCurrentId)
    const dispatch = useDispatch()

    const onClick = useCallback(() => {
        dispatch(acSetUiDetailsPanelOpen(!showDetailsPanel))
    }, [dispatch, showDetailsPanel])

    return (
        <button
            className={styles.chevronToggle}
            onClick={onClick}
            disabled={!id}
            aria-label={
                showDetailsPanel ? 'Hide details panel' : 'Show details panel'
            }
        >
            {showDetailsPanel ? <IconChevronRight16 /> : <IconChevronLeft16 />}
        </button>
    )
}
