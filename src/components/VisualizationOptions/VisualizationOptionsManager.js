import { VisualizationOptions } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current'
import { getOptionsByType } from '../../modules/options/config'
import MenuButton from '../Toolbar/MenuBar/MenuButton'
//import UpdateVisualizationContainer from '../UpdateButton/UpdateVisualizationContainer'

const VisualizationOptionsManager = ({ onUpdate }) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false)

    const onClick = () => {
        setDialogIsOpen(false)
        // try {
        //     validateLayout(getCurrentFromUi())
        //     acClearLoadError()
        // } catch (error) {
        //     acSetLoadError(error || new GenericClientError())
        // }
        //onLoadingStart()
        onUpdate()
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
                <VisualizationOptions
                    optionsConfig={optionsConfig}
                    onUpdate={onClick}
                    onClose={() => setDialogIsOpen(false)}
                />
            )}
        </>
    )
}

VisualizationOptionsManager.propTypes = {
    onUpdate: PropTypes.func,
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {
    onUpdate: tSetCurrentFromUi,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisualizationOptionsManager)
