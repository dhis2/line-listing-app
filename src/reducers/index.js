import { combineReducers } from 'redux'
import alertbar from './alertbar'
import current from './current'
import dimensions from './dimensions'
import metadata from './metadata'
import settings from './settings'
import ui from './ui'
import user from './user'
import visualization from './visualization'

// Reducers

export default combineReducers({
    alertbar,
    current,
    dimensions,
    metadata,
    settings,
    ui,
    user,
    visualization,
})
