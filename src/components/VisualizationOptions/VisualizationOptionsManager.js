import { VisualizationOptions } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { getOptionsByType } from '../../modules/options/config'
import MenuButton from '../Toolbar/MenuBar/MenuButton'
//import UpdateVisualizationContainer from '../UpdateButton/UpdateVisualizationContainer'

const VisualizationOptionsManager = () => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false)

    const onClick = () => {
        // TODO: update vis
        onClose()
    }

    const onClose = () => {
        toggleVisualizationOptionsDialog()
    }

    const toggleVisualizationOptionsDialog = () => {
        setDialogIsOpen(!dialogIsOpen)
    }

    const optionsConfig = getOptionsByType()

    return (
        <>
            <MenuButton
                data-test={'app-menubar-options-button'}
                onClick={toggleVisualizationOptionsDialog}
            >
                {i18n.t('Options')}
            </MenuButton>
            {dialogIsOpen && (
                <VisualizationOptions
                    optionsConfig={optionsConfig}
                    onUpdate={onClick}
                    onClose={onClose}
                />
            )}
        </>
    )
}

VisualizationOptionsManager.propTypes = {}

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(VisualizationOptionsManager)
