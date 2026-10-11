import { Toolbar as AnalyticsToolbar } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    Button,
    IconShare16,
    IconDownload16,
    IconFullscreen16,
    IconFullscreenExit16,
    SharingDialog,
} from '@dhis2/ui'
import { sGetCurrent } from '../../reducers/current.js'
import { sGetUiShowExpandedVisualizationCanvas } from '../../reducers/ui.js'
import { acToggleUiExpandedVisualizationCanvas } from '../../actions/ui.js'
import { ChevronToggle } from './ChevronToggle.jsx'
import { MenuBar } from './MenuBar.jsx'
import { UpdateButton } from './UpdateButton.jsx'
import TitleBar from '../TitleBar/TitleBar.jsx'
import styles from './Toolbar.module.css'

// Custom hook for viewport width
const useViewportWidth = () => {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return width
}

export const Toolbar = ({ onFileMenuAction }) => {
    const [sharingDialogOpen, setSharingDialogOpen] = useState(false)
    const current = useSelector(sGetCurrent)
    const dispatch = useDispatch()
    const isExpanded = useSelector(sGetUiShowExpandedVisualizationCanvas)
    const viewportWidth = useViewportWidth()

    const handleShareClick = () => {
        setSharingDialogOpen(true)
        onFileMenuAction()
    }

    const handleSharingDialogClose = () => {
        setSharingDialogOpen(false)
    }

    const handleExpandToggle = () => {
        dispatch(acToggleUiExpandedVisualizationCanvas())
    }

    // Show TitleBar in toolbar only if viewport >= 1200px
    const showTitleBarInToolbar = viewportWidth >= 1200

    return (
        <>
            <AnalyticsToolbar>
                <UpdateButton />
                <MenuBar onFileMenuAction={onFileMenuAction} />
                {showTitleBarInToolbar && <TitleBar />}
                <div className={styles.toolbarActions}>
                    <Button
                        dense
                        small
                        secondary
                        onClick={handleShareClick}
                        disabled={!current?.id}
                    >
                        <IconShare16 />
                    </Button>
                    <Button
                        icon={<IconDownload16 />}
                        dense
                        small
                        secondary
                        disabled={!current}
                    ></Button>
                    <div className={styles.divider}></div>
                    <Button
                        icon={
                            isExpanded ? (
                                <IconFullscreenExit16 />
                            ) : (
                                <IconFullscreen16 />
                            )
                        }
                        dense
                        small
                        secondary
                        onClick={handleExpandToggle}
                    />
                    <ChevronToggle />
                </div>
            </AnalyticsToolbar>
            {sharingDialogOpen && current?.id && (
                <SharingDialog
                    id={current.id}
                    type="eventVisualization"
                    onClose={handleSharingDialogClose}
                />
            )}
        </>
    )
}

Toolbar.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
