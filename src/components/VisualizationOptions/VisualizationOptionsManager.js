import { VisualizationOptions } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import React, { useState } from 'react'
import { getOptionsByType } from '../../modules/options/config.js'
import MenuButton from '../Toolbar/MenuBar/MenuButton.js'
import UpdateVisualizationContainer from '../UpdateButton/UpdateVisualizationContainer.js'

const VisualizationOptionsManager = () => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false)

    const onClick = (handler) => {
        handler()
        setDialogIsOpen(false)
    }

    const optionsConfig = getOptionsByType()

    return (
        <>
            <MenuButton
                data-test={'app-menubar-options-button'}
                onClick={() => setDialogIsOpen(true)}
            >
                {i18n.t('Options')}
            </MenuButton>
            {dialogIsOpen && (
                <UpdateVisualizationContainer
                    renderComponent={(handler) => (
                        <VisualizationOptions
                            optionsConfig={optionsConfig}
                            onUpdate={() => onClick(handler)}
                            onClose={() => setDialogIsOpen(false)}
                        />
                    )}
                />
            )}
        </>
    )
}

export default VisualizationOptionsManager
