import { VisualizationOptions } from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useState } from 'react'
import { HoverMenuBar } from '../../analyticsComponents/HoverMenuBar/HoverMenuBar.js'
import { getOptionsByType } from '../../modules/options/config.js'
import UpdateVisualizationContainer from '../UpdateButton/UpdateVisualizationContainer.js'

const VisualizationOptionsManager = () => {
    const [selectedOptionConfigKey, setSelectedOptionConfigKey] = useState(null)
    const { serverVersion } = useConfig()

    const onOptionsUpdate = (handler) => {
        handler()
        setSelectedOptionConfigKey(null)
    }

    const optionsConfig = getOptionsByType({ serverVersion })

    console.log(optionsConfig)

    return (
        <>
            <HoverMenuBar.Dropdown label={i18n.t('Options')}>
                <HoverMenuBar.Menu dataTest="file-menu-container">
                    {optionsConfig.map(({ label, key }) => (
                        <HoverMenuBar.MenuItem
                            key={key}
                            label={label}
                            onClick={() => {
                                setSelectedOptionConfigKey(key)
                            }}
                        />
                    ))}
                </HoverMenuBar.Menu>
            </HoverMenuBar.Dropdown>
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
