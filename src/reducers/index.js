import { combineReducers } from 'redux'
import current from './current'
import metadata from './metadata'
import ui from './ui'
import visualization from './visualization'

// Reducers

export default combineReducers({
    current,
    metadata,
    ui,
    visualization,
})
