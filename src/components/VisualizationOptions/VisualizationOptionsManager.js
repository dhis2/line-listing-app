import { VisualizationOptions } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current.js'
import { acSetShowExpandedLayoutPanel } from '../../actions/ui.js'
import { getOptionsByType } from '../../modules/options/config.js'
import MenuButton from '../Toolbar/MenuBar/MenuButton.js'
//import UpdateVisualizationContainer from '../UpdateButton/UpdateVisualizationContainer.js'

const VisualizationOptionsManager = ({ onUpdate }) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const dispatch = useDispatch()

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
        dispatch(acSetShowExpandedLayoutPanel(false))
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
