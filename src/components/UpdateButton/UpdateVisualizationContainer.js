import { useDispatch } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current.js'

const UpdateVisualizationContainer = ({ renderComponent }) => {
    const dispatch = useDispatch()

    const onClick = () => {
        dispatch(tSetCurrentFromUi())
    }

    return renderComponent(onClick)
}

export default UpdateVisualizationContainer
