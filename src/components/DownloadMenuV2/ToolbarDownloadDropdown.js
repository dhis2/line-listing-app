import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { HoverMenuBar } from '../../analyticsComponents/index.js'
import { DownloadMenu } from './DownloadMenu.js'
import { useDownload } from './useDownload.js'

const ToolbarDownloadDropdown = () => {
    const { isDownloadDisabled, download } = useDownload()

    return (
        <HoverMenuBar.Dropdown
            label={i18n.t('Download')}
            disabled={isDownloadDisabled}
        >
            <DownloadMenu download={download} />
        </HoverMenuBar.Dropdown>
    )
}

export { ToolbarDownloadDropdown }
