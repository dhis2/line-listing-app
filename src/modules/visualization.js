import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_ID_PERIOD,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { DEFAULT_CURRENT } from '../reducers/current.js'
import { DEFAULT_VISUALIZATION } from '../reducers/visualization.js'
import {
    DIMENSION_TYPE_PERIOD,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED_DATE,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_ID_PROGRAM_STATUS,
} from './dimensionConstants.js'
import { default as options } from './options.js'

export const STATUS_ACTIVE = 'ACTIVE'
export const STATUS_CANCELLED = 'CANCELLED'
export const STATUS_COMPLETED = 'COMPLETED'

export const OUTPUT_TYPE_EVENT = 'EVENT'
export const OUTPUT_TYPE_ENROLLMENT = 'ENROLLMENT'

export const statusNames = {
    [STATUS_ACTIVE]: i18n.t('Active'),
    [STATUS_CANCELLED]: i18n.t('Cancelled'),
    [STATUS_COMPLETED]: i18n.t('Completed'),
}

export const headersMap = {
    [DIMENSION_ID_ORGUNIT]: 'ouname',
    [DIMENSION_ID_PROGRAM_STATUS]: 'programstatus',
    [DIMENSION_ID_EVENT_STATUS]: 'eventstatus',
    [DIMENSION_ID_CREATED_BY]: 'createdbydisplayname',
    [DIMENSION_ID_LAST_UPDATED_BY]: 'lastupdatedbydisplayname',
    [DIMENSION_ID_EVENT_DATE]: 'eventdate',
    [DIMENSION_ID_ENROLLMENT_DATE]: 'enrollmentdate',
    [DIMENSION_ID_INCIDENT_DATE]: 'incidentdate',
    [DIMENSION_ID_SCHEDULED_DATE]: 'scheduleddate',
    [DIMENSION_ID_LAST_UPDATED_DATE]: 'lastupdated',
}

export const outputTypeTimeDimensionMap = {
    [OUTPUT_TYPE_EVENT]: DIMENSION_ID_EVENT_DATE,
    [OUTPUT_TYPE_ENROLLMENT]: DIMENSION_ID_ENROLLMENT_DATE,
}

export const transformVisualization = (visualization) => {
    const transformedColumns = transformDimensions(
        visualization[AXIS_ID_COLUMNS],
        visualization
    )
    const transformedRows = transformDimensions(
        visualization[AXIS_ID_ROWS],
        visualization
    )
    const transformedFilters = transformDimensions(
        visualization[AXIS_ID_FILTERS],
        visualization
    )

    // convert completedOnly option to eventStatus = COMPLETED filter
    if (
        visualization.completedOnly &&
        visualization.outputType === OUTPUT_TYPE_EVENT
    ) {
        transformedFilters.push({
            dimension: DIMENSION_ID_EVENT_STATUS,
            items: [{ id: STATUS_COMPLETED }],
        })
    }

    const transformedVisualization = { ...visualization }
    delete transformedVisualization.completedOnly

    return {
        ...transformedVisualization,
        [AXIS_ID_COLUMNS]: transformedColumns,
        [AXIS_ID_ROWS]: transformedRows,
        [AXIS_ID_FILTERS]: transformedFilters,
    }
}

const transformDimensions = (dimensions, { outputType, type }) =>
    dimensions.map((dimensionObj) => {
        if (dimensionObj.dimensionType === 'PROGRAM_DATA_ELEMENT') {
            return {
                ...dimensionObj,
                dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            }
        } else if (
            dimensionObj.dimension === DIMENSION_ID_PERIOD &&
            type === VIS_TYPE_LINE_LIST
        ) {
            return {
                ...dimensionObj,
                dimension: outputTypeTimeDimensionMap[outputType],
                dimensionType: DIMENSION_TYPE_PERIOD,
            }
        } else {
            return dimensionObj
        }
    })

export const visTypes = [
    { type: VIS_TYPE_LINE_LIST },
    { type: VIS_TYPE_PIVOT_TABLE, disabled: true },
]

export const visTypeDescriptions = {
    [VIS_TYPE_LINE_LIST]: i18n.t('List data from tracked entities and events.'),
    [VIS_TYPE_PIVOT_TABLE]: i18n.t(
        'Explore data with manipulatable columns, rows, and aggregations.'
    ),
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
