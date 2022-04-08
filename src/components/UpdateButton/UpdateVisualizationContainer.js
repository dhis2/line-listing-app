import { useSelector, useDispatch } from 'react-redux'
import { tSetCurrentFromUi, acClearCurrent } from '../../actions/current.js'
import {
    acSetLoadError,
    acClearLoadError,
    acSetVisualizationLoading,
} from '../../actions/loader.js'
import { acSetShowExpandedLayoutPanel } from '../../actions/ui.js'
import { genericClientError } from '../../modules/error.js'
import {
    layoutHasProgramId,
    validateLayout,
} from '../../modules/layoutValidation.js'
import { sGetCurrentFromUi } from '../../reducers/current.js'

const UpdateVisualizationContainer = ({ renderComponent }) => {
    const dispatch = useDispatch()
    const currentFromUi = useSelector(sGetCurrentFromUi)

    const onClick = () => {
        try {
            validateLayout(currentFromUi)
            dispatch(acClearLoadError())
            dispatch(acSetVisualizationLoading(true))
        } catch (error) {
            dispatch(acSetLoadError(error || genericClientError()))
        }
        if (layoutHasProgramId(currentFromUi)) {
            dispatch(tSetCurrentFromUi())
        } else {
            dispatch(acClearCurrent())
        }

        dispatch(acSetShowExpandedLayoutPanel(false))
    }

    return renderComponent(onClick)
}

export default UpdateVisualizationContainer
