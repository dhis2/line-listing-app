import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_ID_PERIOD,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT,
    DIMENSION_TYPE_PERIOD,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { DEFAULT_CURRENT } from '../reducers/current.js'
import { DEFAULT_VISUALIZATION } from '../reducers/visualization.js'
import {
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_ID_PROGRAM_STATUS,
} from './dimensionConstants.js'
import { getRequestOptions } from './getRequestOptions.js'
import { default as options } from './options.js'

export const STATUS_ACTIVE = 'ACTIVE'
export const STATUS_CANCELLED = 'CANCELLED'
export const STATUS_COMPLETED = 'COMPLETED'
export const STATUS_SCHEDULED = 'SCHEDULE'

export const OUTPUT_TYPE_EVENT = 'EVENT'
export const OUTPUT_TYPE_ENROLLMENT = 'ENROLLMENT'
export const OUTPUT_TYPE_TRACKED_ENTITY = 'TRACKED_ENTITY_INSTANCE'

export const getStatusNames = () => ({
    [STATUS_ACTIVE]: i18n.t('Active'),
    [STATUS_CANCELLED]: i18n.t('Cancelled'),
    [STATUS_COMPLETED]: i18n.t('Completed'),
    [STATUS_SCHEDULED]: i18n.t('Scheduled'),
})

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
    [DIMENSION_ID_LAST_UPDATED]: 'lastupdated',
}

export const getHeadersMap = ({ showHierarchy }) => {
    const map = Object.assign({}, headersMap)

    if (showHierarchy) {
        map[DIMENSION_ID_ORGUNIT] = 'ounamehierarchy'
    }

    return map
}

export const getDimensionIdFromHeaderName = (headerName, visualization) => {
    const headersMap = getHeadersMap(getRequestOptions(visualization))

    return Object.keys(headersMap).find((key) => headersMap[key] === headerName)
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
    dimensions
        .filter(
            (dimensionObj) =>
                !['longitude', 'latitude'].includes(dimensionObj.dimension)
        )
        .map((dimensionObj) => {
            if (
                dimensionObj.dimensionType ===
                DIMENSION_TYPE_PROGRAM_DATA_ELEMENT
            ) {
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

export const getVisTypeDescriptions = () => ({
    [VIS_TYPE_LINE_LIST]: i18n.t('List data from tracked entities and events.'),
    [VIS_TYPE_PIVOT_TABLE]: i18n.t(
        'Explore data with manipulatable columns, rows, and aggregations.'
    ),
})

const defaultRemoveDimensionProps = ['dimensionType', 'valueType']

const removeDimensionPropsBeforeSaving = (
    axis,
    props = defaultRemoveDimensionProps
) =>
    axis?.map((dim) => {
        const dimension = Object.assign({}, dim)

        props.forEach((prop) => {
            delete dimension[prop]
        })

        return dimension
    })

export const getSaveableVisualization = (vis) => {
    const visualization = Object.assign({}, vis)
    const nonSavableOptions = Object.keys(options).filter(
        (option) => !options[option].savable
    )

    nonSavableOptions.forEach((option) => delete visualization[option])

    visualization.columns = removeDimensionPropsBeforeSaving(
        visualization.columns
    )
    visualization.filters = removeDimensionPropsBeforeSaving(
        visualization.filters
    )

    !visualization.programStage?.id && delete visualization.programStage

    // When saving a copy of an AO created with the Event Reports app, remove the legacy flag.
    // This copy won't work in Event Reports app anyway.
    // This also unlocks the Save button on the copied (and converted to new format) AO in LL app.
    delete visualization.legacy

    // format sorting
    visualization.sorting = vis.sorting?.length
        ? [
              {
                  dimension:
                      getDimensionIdFromHeaderName(
                          vis.sorting[0].dimension,
                          vis
                      ) || vis.sorting[0].dimension,
                  direction: vis.sorting[0].direction.toUpperCase(),
              },
          ]
        : undefined

    return visualization
}

export const getVisualizationState = (visualization, current, ui = null) => {
    if (visualization === DEFAULT_VISUALIZATION) {
        if (current === DEFAULT_CURRENT) {
            // Check if UI state indicates user has started creating a visualization
            if (ui && hasUserStartedCreatingVisualization(ui)) {
                return STATE_UNSAVED
            }
            return STATE_EMPTY
        }
        return STATE_UNSAVED
    } else if (current === visualization) {
        return STATE_SAVED
    } else {
        return STATE_DIRTY
    }
}

const hasUserStartedCreatingVisualization = (ui) => {
    // Check if user has selected a program or tracked entity type
    const hasProgram = ui.program?.id && ui.program.id !== undefined
    const hasEntityType = ui.entityType?.id && ui.entityType.id !== undefined

    // Check if user has added dimensions
    const hasColumns = ui.layout?.columns && ui.layout.columns.length > 0
    const hasFilters = ui.layout?.filters && ui.layout.filters.length > 0

    // Check if user has selected any items for dimensions (beyond empty arrays)
    const hasSelectedItems =
        ui.itemsByDimension &&
        Object.values(ui.itemsByDimension).some(
            (items) => items && items.length > 0
        )

    return (
        hasProgram ||
        hasEntityType ||
        hasColumns ||
        hasFilters ||
        hasSelectedItems
    )
}

export const STATE_EMPTY = 'EMPTY'
export const STATE_SAVED = 'SAVED'
export const STATE_UNSAVED = 'UNSAVED'
export const STATE_DIRTY = 'DIRTY'

export const dimensionMetadataPropMap = {
    dataElementDimensions: 'dataElement',
    attributeDimensions: 'attribute',
    programIndicatorDimensions: 'programIndicator',
    categoryDimensions: 'category',
    categoryOptionGroupSetDimensions: 'categoryOptionGroupSet',
    organisationUnitGroupSetDimensions: 'organisationUnitGroupSet',
    dataElementGroupSetDimensions: 'dataElementGroupSet',
}

// Loop through and collect dimension metadata from the visualization
export const getDimensionMetadataFromVisualization = (visualization) =>
    Object.entries(dimensionMetadataPropMap).reduce(
        (metaData, [listName, dimensionName]) => {
            const dimensionList = visualization[listName] || []

            dimensionList.forEach((dimensionWrapper) => {
                const dimension = dimensionWrapper[dimensionName]
                metaData[dimension.id] = dimension
            })

            return metaData
        },
        {}
    )

export const getDimensionMetadataFields = () =>
    Object.entries(dimensionMetadataPropMap).map(
        ([listName, objectName]) => `${listName}[${objectName}[id,name]]`
    )
