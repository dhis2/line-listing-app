import { combineReducers } from 'redux'
import alertbar from './alertbar'
import current from './current'
import dimensions, { sGetDimensions } from './dimensions'
import loader from './loader'
import metadata, { sGetMetadata } from './metadata'
import settings from './settings'
import ui, { sGetUiLayout } from './ui'
import user from './user'
import visualization from './visualization'

// Reducers

export default combineReducers({
    alertbar,
    current,
    dimensions,
    loader,
    metadata,
    settings,
    ui,
    user,
    visualization,
})

export const sAllLayoutItemsHaveData = state => {
    const layoutItems = Object.values(sGetUiLayout(state) || {}).flat()
    const dataObjects = [
        ...Object.values(sGetMetadata(state) || {}),
        ...Object.values(sGetDimensions(state) || {}),
    ]

    return layoutItems.every(item => dataObjects.some(data => data.id === item))
}
