import {
    VisualizationOptions,
    HoverMenuDropdown,
    HoverMenuList,
    HoverMenuListItem,
} from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useState } from 'react'
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

    return (
        <>
            <HoverMenuDropdown label={i18n.t('Options')}>
                <HoverMenuList dataTest="options-menu-list">
                    {optionsConfig.map(({ label, key }) => (
                        <HoverMenuListItem
                            key={key}
                            label={label}
                            onClick={() => {
                                setSelectedOptionConfigKey(key)
                            }}
                        />
                    ))}
                </HoverMenuList>
            </HoverMenuDropdown>
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
