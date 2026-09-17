import i18n from '@dhis2/d2-i18n'
import { Popper, Layer } from '@dhis2/ui'
import React, { useState, useRef } from 'react'
import { DownloadMenu } from '../DownloadMenu/DownloadMenu.jsx'
import { useDownload } from '../DownloadMenu/useDownload.js'
import { ToolbarMenuDropdownTrigger } from './ToolbarMenuDropdownTrigger.jsx'
import styles from './ToolbarMenuDropdownTrigger.module.css'

export const ExportDropDown = () => {
    const { isDownloadDisabled, download } = useDownload()
    const [menuOpen, setMenuOpen] = useState(false)
    const anchorRef = useRef(null)

    const handleDownload = (...args) => {
        download(...args)
        setMenuOpen(false)
    }

    return (
        <>
            <div ref={anchorRef} className={styles.wrapper}>
                <ToolbarMenuDropdownTrigger
                    onClick={() => setMenuOpen(!menuOpen)}
                    dataTest="export-menu"
                    open={menuOpen}
                    label={i18n.t('Export')}
                    disabled={isDownloadDisabled}
                />
            </div>
            {menuOpen && !isDownloadDisabled && (
                <Layer onBackdropClick={() => setMenuOpen(false)}>
                    <Popper reference={anchorRef} placement="bottom-start">
                        <DownloadMenu
                            download={handleDownload}
                            hoverable={false}
                        />
                    </Popper>
                </Layer>
            )}
        </>
    )
}
