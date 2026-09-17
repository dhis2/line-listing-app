import { VisualizationOptions } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { FlyoutMenu, MenuItem, IconSettings16, Popper, Layer } from '@dhis2/ui'
import React, { useState, useRef } from 'react'
import { getOptionsByType } from '../../modules/options/config.js'
import { ToolbarMenuDropdownTrigger } from '../Toolbar/ToolbarMenuDropdownTrigger.jsx'
import styles from '../Toolbar/ToolbarMenuDropdownTrigger.module.css'
import UpdateVisualizationContainer from '../UpdateButton/UpdateVisualizationContainer.js'

const VisualizationOptionsManager = () => {
    const [selectedOptionConfigKey, setSelectedOptionConfigKey] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const anchorRef = useRef(null)

    const onOptionsUpdate = (handler) => {
        handler()
        setSelectedOptionConfigKey(null)
    }

    const handleMenuItemClick = (key) => {
        setSelectedOptionConfigKey(key)
        setMenuOpen(false)
    }

    const optionsConfig = getOptionsByType()

    return (
        <>
            <div ref={anchorRef} className={styles.wrapper}>
                <ToolbarMenuDropdownTrigger
                    icon={<IconSettings16 color="#6C7787" />}
                    label={i18n.t('Options')}
                    onClick={() => setMenuOpen(!menuOpen)}
                    dataTest="options-menu-button"
                    open={menuOpen}
                />
            </div>
            {menuOpen && (
                <Layer onBackdropClick={() => setMenuOpen(false)}>
                    <Popper reference={anchorRef} placement="bottom-start">
                        <FlyoutMenu dense dataTest="options-menu-list">
                            {optionsConfig.map(({ label, key }) => (
                                <MenuItem
                                    key={key}
                                    label={label}
                                    onClick={() => handleMenuItemClick(key)}
                                />
                            ))}
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
            {selectedOptionConfigKey && (
                <UpdateVisualizationContainer
                    renderComponent={(handler) => (
                        <VisualizationOptions
                            optionsConfig={optionsConfig}
                            onUpdate={() => onOptionsUpdate(handler)}
                            onClose={() => setSelectedOptionConfigKey(null)}
                            initiallyActiveTabKey={selectedOptionConfigKey}
                        />
                    )}
                />
            )}
        </>
    )
}

export default VisualizationOptionsManager
