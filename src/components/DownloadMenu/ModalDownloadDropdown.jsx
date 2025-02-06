import i18n from '@dhis2/d2-i18n'
import { DropdownButton } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import { DownloadMenu } from './DownloadMenu.jsx'
import styles from './ModalDownloadDropdown.module.css'
import { useDownload } from './useDownload.js'

const ModalDownloadDropdown = ({ relativePeriodDate }) => {
    const { isDownloadDisabled, download } = useDownload(relativePeriodDate)
    const [isOpen, setIsOpen] = useState(false)
    const toggleOpen = useCallback(() => {
        setIsOpen((currentIsOpen) => !currentIsOpen)
    }, [])

    return (
        <div className={styles.container}>
            <DropdownButton
                component={<DownloadMenu download={download} />}
                disabled={isDownloadDisabled}
                onClick={toggleOpen}
                open={isOpen}
                secondary
                small
            >
                {i18n.t('Download data from this date')}
            </DropdownButton>
        </div>
    )
}

ModalDownloadDropdown.propTypes = {
    relativePeriodDate: PropTypes.string,
}

export { ModalDownloadDropdown }
