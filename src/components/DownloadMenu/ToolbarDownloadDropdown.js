import i18n from '@dhis2/d2-i18n'
import { Layer, Popper } from '@dhis2/ui'
import React, { useRef } from 'react'
import { default as MenuButton } from '../Toolbar/MenuBar/MenuButton.js'
import { DownloadMenu } from './DownloadMenu.js'
import { useDownloadMenu } from './useDownloadMenu.js'
const ToolbarDownloadDropdown = () => {
    const buttonRef = useRef()
    const { isOpen, toggleOpen, disabled, download } = useDownloadMenu()

    return (
        <>
            <MenuButton
                ref={buttonRef}
                onClick={toggleOpen}
                disabled={disabled}
            >
                {i18n.t('Download')}
            </MenuButton>
            {isOpen && (
                <Layer onBackdropClick={toggleOpen}>
                    <Popper reference={buttonRef} placement="bottom-start">
                        <DownloadMenu download={download} />
                    </Popper>
                </Layer>
            )}
        </>
    )
}

export { ToolbarDownloadDropdown }
