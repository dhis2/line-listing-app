import i18n from '@dhis2/d2-i18n'
import { DropdownButton } from '@dhis2/ui'
import React from 'react'
import { DownloadMenu } from './DownloadMenu.js'
import styles from './ModalDownloadDropdown.module.css'
import { useDownloadMenu } from './useDownloadMenu.js'

const ModalDownloadDropdown = () => {
    const { isOpen, toggleOpen, disabled, download } = useDownloadMenu()

    return (
        <div className={styles.container}>
            <DropdownButton
                component={<DownloadMenu download={download} />}
                disabled={disabled}
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

export { ModalDownloadDropdown }
