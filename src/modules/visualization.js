import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
    DIMENSION_ID_PERIOD,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { DEFAULT_CURRENT } from '../reducers/current.js'
import { DEFAULT_VISUALIZATION } from '../reducers/visualization.js'
import {
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_EVENT_STATUS,
    DIMENSION_TYPE_EVENT_DATE,
    DIMENSION_TYPE_ENROLLMENT_DATE,
    DIMENSION_TYPE_INCIDENT_DATE,
    DIMENSION_TYPE_SCHEDULED_DATE,
    DIMENSION_TYPE_LAST_UPDATED,
    DIMENSION_TYPE_PROGRAM_STATUS,
    DIMENSION_TYPE_LAST_UPDATED_BY,
} from './dimensionTypes.js'
import { default as options } from './options.js'

export const STATUS_ACTIVE = 'ACTIVE'
export const STATUS_CANCELLED = 'CANCELLED'
export const STATUS_COMPLETED = 'COMPLETED'
export const STATUS_OVERDUE = 'OVERDUE'
export const STATUS_SCHEDULED = 'SCHEDULED'
export const STATUS_SKIPPED = 'SKIPPED'

export const OUTPUT_TYPE_EVENT = 'EVENT'
export const OUTPUT_TYPE_ENROLLMENT = 'ENROLLMENT'

export const statusNames = {
    [STATUS_ACTIVE]: i18n.t('Active'),
    [STATUS_CANCELLED]: i18n.t('Cancelled'),
    [STATUS_COMPLETED]: i18n.t('Completed'),
    [STATUS_OVERDUE]: i18n.t('Overdue'),
    [STATUS_SCHEDULED]: i18n.t('Scheduled'),
    [STATUS_SKIPPED]: i18n.t('Skipped'),
}

export const headersMap = {
    ou: 'ouname',
    [DIMENSION_TYPE_PROGRAM_STATUS]: 'programstatus',
    [DIMENSION_TYPE_EVENT_STATUS]: 'eventstatus',
    createdBy: 'createdby',
    [DIMENSION_TYPE_LAST_UPDATED_BY]: 'lastupdatedby',
    [DIMENSION_TYPE_EVENT_DATE]: 'eventdate',
    [DIMENSION_TYPE_ENROLLMENT_DATE]: 'enrollmentdate',
    [DIMENSION_TYPE_INCIDENT_DATE]: 'incidentdate',
    [DIMENSION_TYPE_SCHEDULED_DATE]: 'scheduleddate',
    [DIMENSION_TYPE_LAST_UPDATED]: 'lastupdated',
}

export const outputTypeMap = {
    [OUTPUT_TYPE_EVENT]: {
        name: i18n.t('Event'),
        description: i18n.t(
            'Events are single registrations or incidents in a program'
        ),
    },
    [OUTPUT_TYPE_ENROLLMENT]: {
        name: i18n.t('Enrollment'),
        description: i18n.t('Programs track enrollments across time'),
    },
}

export const outputTypeTimeDimensionMap = {
    [OUTPUT_TYPE_EVENT]: DIMENSION_TYPE_EVENT_DATE,
    [OUTPUT_TYPE_ENROLLMENT]: DIMENSION_TYPE_ENROLLMENT_DATE,
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
            dimension: DIMENSION_TYPE_EVENT_STATUS,
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
    // TODO review descriptions @scott @joe
    [VIS_TYPE_LINE_LIST]: i18n.t('TEXT description for Line List'),
    [VIS_TYPE_PIVOT_TABLE]: i18n.t('TEXT description for Pivot Table'),
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
