import { Toolbar as AnalyticsToolbar } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, IconShare16, IconDownload16, SharingDialog } from '@dhis2/ui'
import { sGetCurrent } from '../../reducers/current.js'
import { ChevronToggle } from './ChevronToggle.jsx'
import { MenuBar } from './MenuBar.jsx'
import { UpdateButton } from './UpdateButton.jsx'
import TitleBar from '../TitleBar/TitleBar.jsx'
import styles from './Toolbar.module.css'

export const Toolbar = ({ onFileMenuAction }) => {
    const [sharingDialogOpen, setSharingDialogOpen] = useState(false)
    const current = useSelector(sGetCurrent)

    const handleShareClick = () => {
        setSharingDialogOpen(true)
        onFileMenuAction()
    }

    const handleSharingDialogClose = () => {
        setSharingDialogOpen(false)
    }

    return (
        <>
            <AnalyticsToolbar>
                <UpdateButton />
                <MenuBar onFileMenuAction={onFileMenuAction} />
                <TitleBar />
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
                    ></Button>
                    <div className={styles.divider}></div>
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
