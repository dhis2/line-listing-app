import { acAddMetadata } from '../actions/metadata.js'

export default ({ dispatch }) =>
    (next) =>
    (action) => {
        if (
            typeof action.metadata === 'object' &&
            !Array.isArray(action.metadata)
        ) {
            dispatch(acAddMetadata(action.metadata))
        } else if (
            typeof action.metadata === 'object' &&
            Array.isArray(action.metadata)
        ) {
            action.metadata.forEach((item) => dispatch(acAddMetadata(item)))
        }

        next(action)
    }
