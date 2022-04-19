import { AXIS_ID_COLUMNS } from '@dhis2/analytics'
import { acSetUiSorting } from '../actions/ui.js'
import { formatDimensionId } from '../modules/utils.js'
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
    PAGE_SIZE,
} from '../reducers/ui.js'

const acSetCurrent = (value) => ({
    type: SET_CURRENT,
    value,
})

export const tSetCurrent = (visualization) => (dispatch) => {
    const firstColumnDimension = visualization[AXIS_ID_COLUMNS][0]
    const defaultSortField = formatDimensionId(
        firstColumnDimension?.dimension,
        firstColumnDimension?.programStage?.id
    )

    dispatch(acSetCurrent(visualization))
    dispatch(
        acSetUiSorting({
            sortField: headersMap[defaultSortField] || defaultSortField,
            sortDirection: DEFAULT_SORT_DIRECTION,
            page: FIRST_PAGE,
            pageSize: PAGE_SIZE,
        })
    )
}

export const acClearCurrent = () => ({
    type: CLEAR_CURRENT,
})

export const acSetCurrentFromUi = (value) => ({
    type: SET_CURRENT_FROM_UI,
    value,
})

export const tSetCurrentFromUi = () => async (dispatch, getState) => {
    const { sortField, sortDirection } = sGetUiSorting(getState())
    const ui = sGetUi(getState())

    const allDimensions = [
        ...ui.layout.columns,
        ...ui.layout.rows,
        ...ui.layout.filters,
    ].map((d) => headersMap[d] || d)

    const sorting = {
        sortField,
        sortDirection,
        page: FIRST_PAGE,
        pageSize: PAGE_SIZE,
    }

    if (!sortField || !allDimensions.includes(sortField)) {
        const defaultSortField = ui.layout[AXIS_ID_COLUMNS][0]

        sorting.sortField = headersMap[defaultSortField] || defaultSortField
        sorting.sortDirection = DEFAULT_SORT_DIRECTION
    }

    dispatch(acSetCurrentFromUi(ui))
    dispatch(acSetUiSorting(sorting))
}
