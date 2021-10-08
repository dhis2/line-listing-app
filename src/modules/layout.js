import {
    AXIS_ID_COLUMNS,
    AXIS_ID_FILTERS,
    AXIS_ID_ROWS,
} from '@dhis2/analytics'

// Names for dnd sources
export const SOURCE_DIMENSIONS = 'dimensions'

// Exclude one or many dimensions from layout
export const getFilteredLayout = (layout, excludedIds) => {
    const ids = Array.isArray(excludedIds) ? excludedIds : [excludedIds]

    return {
        [AXIS_ID_COLUMNS]:
            layout[AXIS_ID_COLUMNS]?.filter(dim => !ids.includes(dim)) || [],
        [AXIS_ID_ROWS]:
            layout[AXIS_ID_ROWS]?.filter(dim => !ids.includes(dim)) || [],
        [AXIS_ID_FILTERS]:
            layout[AXIS_ID_FILTERS]?.filter(dim => !ids.includes(dim)) || [],
    }
}
