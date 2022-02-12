import { connect } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current.js'
import {
    acSetLoadError,
    acClearLoadError,
    acSetVisualizationLoading,
} from '../../actions/loader.js'
import { acSetShowExpandedLayoutPanel } from '../../actions/ui.js'
import { genericClientError } from '../../modules/error.js'
import { validateLayout } from '../../modules/layoutValidation.js'
import { sGetCurrent, sGetCurrentFromUi } from '../../reducers/current.js'

const UpdateVisualizationContainer = ({
    renderComponent,
    getCurrentFromUi,
    onUpdate,
    setLoadError,
    clearLoadError,
    onLoadingStart,
    hideLayoutPanel,
}) => {
    const onClick = () => {
        try {
            validateLayout(getCurrentFromUi())
            clearLoadError()
        } catch (error) {
            setLoadError(error || genericClientError())
        }

        hideLayoutPanel()

        onLoadingStart()

        onUpdate()

        // const urlContainsCurrentAOKey =
        //     history.location.pathname === '/' + CURRENT_AO_KEY

        // const current = getCurrent()

        // const pathWithoutInterpretation =
        //     current && current.id ? `/${current.id}` : '/'

        // if (
        //     !urlContainsCurrentAOKey &&
        //     history.location.pathname !== pathWithoutInterpretation
        // ) {
        //     history.push(pathWithoutInterpretation)
        // }
    }

    return renderComponent(onClick)
}

const mapDispatchToProps = {
    getCurrent: () => (dispatch, getState) => sGetCurrent(getState()),
    getCurrentFromUi: () => (dispatch, getState) =>
        sGetCurrentFromUi(getState()),
    onUpdate: tSetCurrentFromUi,
    setLoadError: acSetLoadError,
    clearLoadError: acClearLoadError,
    onLoadingStart: () => acSetVisualizationLoading(true),
    hideLayoutPanel: () => acSetShowExpandedLayoutPanel(false),
}

export default connect(null, mapDispatchToProps)(UpdateVisualizationContainer)
