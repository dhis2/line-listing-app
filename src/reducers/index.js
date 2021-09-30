import { combineReducers } from 'redux'
import metadata from './metadata'
import ui from './ui'

// Reducers

export default combineReducers({
    ui,
    metadata,
})
