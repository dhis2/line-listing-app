import i18n from '@dhis2/d2-i18n'
import { DEFAULT_CURRENT } from '../reducers/current'
import { DEFAULT_VISUALIZATION } from '../reducers/visualization'
import { default as options } from './options'

export const VIS_TYPE_PIVOT_TABLE = 'VIS_TYPE_PIVOT_TABLE'
export const VIS_TYPE_LINE_LIST = 'VIS_TYPE_LINE_LIST'

export const visTypeDisplayNames = {
    [VIS_TYPE_PIVOT_TABLE]: i18n.t('Pivot table'),
    [VIS_TYPE_LINE_LIST]: i18n.t('Line list'),
}

export const getDisplayNameByVisType = visType => {
    const displayName = visTypeDisplayNames[visType]

    if (!displayName) {
        throw new Error(`${visType} is not a valid visualization type`)
    }

    return displayName
}

export const getVisualizationFromCurrent = current => {
    const visualization = Object.assign({}, current)
    const nonSavableOptions = Object.keys(options).filter(
        option => !options[option].savable
    )

    nonSavableOptions.forEach(option => delete visualization[option])

    return visualization
}

export const getVisualizationState = (visualization, current) => {
    if (current === DEFAULT_CURRENT) {
        return STATE_EMPTY
    } else if (visualization === DEFAULT_VISUALIZATION) {
        return STATE_UNSAVED
    } else if (current === visualization) {
        return STATE_SAVED
    } else {
        return STATE_DIRTY
    }
}

export const STATE_EMPTY = 'EMPTY'
export const STATE_SAVED = 'SAVED'
export const STATE_UNSAVED = 'UNSAVED'
export const STATE_DIRTY = 'DIRTY'
