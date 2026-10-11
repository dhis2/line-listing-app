import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiDetailsPanelOpen } from '../../actions/ui.js'
import { sGetCurrentId } from '../../reducers/current.js'
import { sGetUiShowDetailsPanel } from '../../reducers/ui.js'
import styles from './ChevronToggle.module.css'
import { IconChevronRight16, IconChevronLeft16 } from '@dhis2/ui'
import { Button } from '@dhis2/ui'

export const ChevronToggle = () => {
    const showDetailsPanel = useSelector(sGetUiShowDetailsPanel)
    const id = useSelector(sGetCurrentId)
    const dispatch = useDispatch()

    const onClick = useCallback(() => {
        dispatch(acSetUiDetailsPanelOpen(!showDetailsPanel))
    }, [dispatch, showDetailsPanel])

    return (
        <Button
            icon={
                showDetailsPanel ? (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="1.5"
                            y="1.5"
                            width="13"
                            height="13"
                            rx="1.5"
                            stroke="#4A5768"
                        />
                        <rect
                            x="9"
                            y="2"
                            width="1"
                            height="12"
                            fill="#4A5768"
                        />
                        <rect
                            x="10"
                            y="2"
                            width="4"
                            height="12"
                            fill="#4A5768"
                            fill-opacity="0.2"
                        />
                        <path d="M4 10V6L7 8L4 10Z" fill="#4A5768" />
                    </svg>
                ) : (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="1.5"
                            y="1.5"
                            width="13"
                            height="13"
                            rx="1.5"
                            stroke="#4A5768"
                        />
                        <rect
                            x="9"
                            y="2"
                            width="1"
                            height="12"
                            fill="#4A5768"
                        />
                        <path d="M7 6V10L4 8L7 6Z" fill="#4A5768" />
                    </svg>
                )
            }
            small
            secondary
            className={styles.chevronToggle}
            onClick={onClick}
            disabled={!id}
            aria-label={
                showDetailsPanel ? 'Hide details panel' : 'Show details panel'
            }
        ></Button>
    )
}
