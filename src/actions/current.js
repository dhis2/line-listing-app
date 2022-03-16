import { AXIS_ID_COLUMNS } from '@dhis2/analytics'
import { acSetUiSorting } from '../actions/ui.js'
import { headersMap } from '../modules/visualization.js'
import {
    SET_CURRENT,
    CLEAR_CURRENT,
    SET_CURRENT_FROM_UI,
} from '../reducers/current.js'
import {
    sGetUi,
    sGetUiSorting,
    DEFAULT_SORT_DIRECTION,
    FIRST_PAGE,
} from '../reducers/ui.js'

const acSetCurrent = (value) => ({
    type: SET_CURRENT,
    value,
})

export const tSetCurrent = (visualization) => (dispatch, getState) => {
    const { sortField, sortDirection, page } = sGetUiSorting(getState())

    let sorting = { sortField, sortDirection, page }

    const allDimensions = [
        ...visualization.columns,
        ...visualization.rows,
        ...visualization.filters,
    ].map((f) => headersMap[f.dimension] || f.dimension)

    if (!sortField || !allDimensions.includes(sortField)) {
        const defaultSortField = visualization[AXIS_ID_COLUMNS][0].dimension
        sorting = {
            sortField: headersMap[defaultSortField] || defaultSortField,
            sortDirection: DEFAULT_SORT_DIRECTION,
            page: FIRST_PAGE,
        }
    }

    dispatch(acSetCurrent(visualization))
    dispatch(acSetUiSorting(sorting))
}

export const acClearCurrent = () => ({
    type: CLEAR_CURRENT,
})

export const acSetCurrentFromUi = (value) => ({
    type: SET_CURRENT_FROM_UI,
    value,
})

export const tSetCurrentFromUi = () => async (dispatch, getState) => {
    const { sortField } = sGetUiSorting(getState())
    const ui = sGetUi(getState())

    const allDimensions = [
        ...ui.layout.columns,
        ...ui.layout.rows,
        ...ui.layout.filters,
    ].map((d) => headersMap[d] || d)

    if (!sortField || !allDimensions.includes(sortField)) {
        const defaultSortField = ui.layout[AXIS_ID_COLUMNS][0]
        const sorting = {
            sortField: headersMap[defaultSortField] || defaultSortField,
            sortDirection: DEFAULT_SORT_DIRECTION,
            page: FIRST_PAGE,
        }

        dispatch(acSetUiSorting(sorting))
    }

    dispatch(acSetCurrentFromUi(ui))
}
