import { combineReducers } from 'redux'
import current from './current'
import dimensions from './dimensions'
import metadata from './metadata'
import settings from './settings'
import ui from './ui'
import user from './user'
import visualization from './visualization'

// Reducers

export default combineReducers({
    current,
    dimensions,
    metadata,
    settings,
    ui,
    user,
    visualization,
})
