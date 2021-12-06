import i18n from '@dhis2/d2-i18n'
import PivotTableIcon from '../assets/PivotTableIcon'
import { DEFAULT_CURRENT } from '../reducers/current'
import { DEFAULT_VISUALIZATION } from '../reducers/visualization'
import { default as options } from './options'

export const VIS_TYPE_PIVOT_TABLE = 'VIS_TYPE_PIVOT_TABLE'
export const VIS_TYPE_LINE_LIST = 'VIS_TYPE_LINE_LIST'

export const visTypeMap = {
    [VIS_TYPE_LINE_LIST]: {
        name: i18n.t('Line list'),
        description: 'TEXT description for Line list',
        icon: PivotTableIcon,
        disabled: false,
    },
    [VIS_TYPE_PIVOT_TABLE]: {
        name: i18n.t('Pivot table'),
        description: 'TEXT description for Pivot table',
        icon: PivotTableIcon,
        disabled: true,
        disabledText: i18n.t('Pivot tables are not supported by this app yet'),
    },
}

export const getVisualizationFromCurrent = (current) => {
    const visualization = Object.assign({}, current)
    const nonSavableOptions = Object.keys(options).filter(
        (option) => !options[option].savable
    )

    nonSavableOptions.forEach((option) => delete visualization[option])

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
