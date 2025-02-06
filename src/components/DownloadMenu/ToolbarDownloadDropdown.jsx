import { HoverMenuDropdown } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { DownloadMenu } from './DownloadMenu.jsx'
import { useDownload } from './useDownload.js'

const ToolbarDownloadDropdown = () => {
    const { isDownloadDisabled, download } = useDownload()

    return (
        <HoverMenuDropdown
            label={i18n.t('Download')}
            disabled={isDownloadDisabled}
            className="push-analytics-download-dropdown-menu-button"
        >
            <DownloadMenu download={download} hoverable />
        </HoverMenuDropdown>
    )
}

export { ToolbarDownloadDropdown }
