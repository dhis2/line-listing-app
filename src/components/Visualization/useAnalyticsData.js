import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    Analytics,
    useCachedDataQuery,
    LEGEND_DISPLAY_STRATEGY_FIXED,
    LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_TRUE_ONLY,
    VALUE_TYPE_UNIT_INTERVAL,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
} from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { BOOLEAN_VALUES, NULL_VALUE } from '../../modules/conditions.js'
import {
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_IDS_TIME,
} from '../../modules/dimensionConstants.js'
import { USER_SETTINGS_DISPLAY_PROPERTY } from '../../modules/userSettings.js'
import { extractDimensionIdParts } from '../../modules/utils.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
    headersMap,
} from '../../modules/visualization.js'
import { sGetIsVisualizationLoading } from '../../reducers/loader.js'

const analyticsApiEndpointMap = {
    [OUTPUT_TYPE_ENROLLMENT]: 'enrollments',
    [OUTPUT_TYPE_EVENT]: 'events',
}

const excludedDimensions = [
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
]

const findOptionSetItem = (code, metaDataItems) =>
    Object.values(metaDataItems).find((item) => item.code === code)

const formatRowValue = (rowValue, header, metaDataItems) => {
    switch (header.valueType) {
        case VALUE_TYPE_BOOLEAN:
        case VALUE_TYPE_TRUE_ONLY:
            return BOOLEAN_VALUES[rowValue || NULL_VALUE]
        default:
            return header.optionSet
                ? findOptionSetItem(rowValue, metaDataItems)?.name || rowValue
                : metaDataItems[rowValue]?.name || rowValue
    }
}

const isTimeDimension = (dimensionId) => DIMENSION_IDS_TIME.has(dimensionId)

const getAnalyticsEndpoint = (outputType) => analyticsApiEndpointMap[outputType]

const getAdaptedVisualization = (visualization) => {
    const parameters = {}

    const adaptDimensions = (dimensions) => {
        const adaptedDimensions = []
        dimensions.forEach((dimensionObj) => {
            const dimensionId = dimensionObj.dimension

            if (
                isTimeDimension(dimensionId) ||
                dimensionId === DIMENSION_ID_EVENT_STATUS ||
                dimensionId === DIMENSION_ID_PROGRAM_STATUS
            ) {
                if (dimensionObj.items?.length) {
                    parameters[dimensionId] = dimensionObj.items?.map(
                        (item) => item.id
                    )
                }
            } else if (!excludedDimensions.includes(dimensionId)) {
                adaptedDimensions.push(dimensionObj)
            }
        })

        return adaptedDimensions
    }

    const adaptedColumns = adaptDimensions(visualization[AXIS_ID_COLUMNS])
    const adaptedRows = adaptDimensions(visualization[AXIS_ID_ROWS])
    const adaptedFilters = adaptDimensions(visualization[AXIS_ID_FILTERS])

    const headers = [
        ...visualization[AXIS_ID_COLUMNS],
        ...visualization[AXIS_ID_ROWS],
    ].map(({ dimension, programStage, repetition }) => {
        const headerId = programStage?.id
            ? `${programStage.id}.${dimension}`
            : headersMap[dimension] || dimension

        if (repetition?.indexes?.length) {
            return repetition.indexes.map((index) =>
                headerId.replace(/\./, `[${index}].`)
            )
        } else {
            return headerId
        }
    })

    return {
        adaptedVisualization: {
            [AXIS_ID_COLUMNS]: adaptedColumns,
            [AXIS_ID_ROWS]: adaptedRows,
            [AXIS_ID_FILTERS]: adaptedFilters,
        },
        headers,
        parameters,
    }
}

const fetchAnalyticsData = async ({
    analyticsEngine,
    visualization,
    pageSize,
    page,
    relativePeriodDate,
    sortField,
    sortDirection,
    nameProp,
}) => {
    // TODO must be reviewed when PT comes around. Most likely LL and PT have quite different handling
    const { adaptedVisualization, headers, parameters } =
        getAdaptedVisualization(visualization)

    let req = new analyticsEngine.request()
        .fromVisualization(adaptedVisualization)
        .withParameters({
            headers,
            totalPages: false,
            ...parameters,
        })
        .withProgram(visualization.program.id)
        .withDisplayProperty(nameProp)
        .withOutputType(visualization.outputType)
        .withPageSize(pageSize)
        .withPage(page)
        .withIncludeMetadataDetails()

    if (relativePeriodDate) {
        req = req.withRelativePeriodDate(relativePeriodDate)
    }

    if (sortField) {
        switch (sortDirection) {
            case 'asc':
                req = req.withAsc(sortField)
                break
            case 'desc':
                req = req.withDesc(sortField)
                break
        }
    }

    const analyticsApiEndpoint = getAnalyticsEndpoint(visualization.outputType)

    // for 2.38 only /query is used (since only Line List is enabled)
    const rawResponse = await analyticsEngine[analyticsApiEndpoint].getQuery(
        req
    )

    return rawResponse
}

const legendSetsQuery = {
    resource: 'legendSets',
    params: ({ ids }) => ({
        fields: 'id,displayName~rename(name),legends[id,displayName~rename(name),startValue,endValue,color]',
        filter: `id:in:[${ids.join(',')}]`,
    }),
}

const apiFetchLegendSetsByIds = async ({ dataEngine, ids }) => {
    const legendSetsData = await dataEngine.query(
        { legendSets: legendSetsQuery },
        {
            variables: { ids },
        }
    )

    return legendSetsData.legendSets.legendSets
}

const fetchLegendSets = async ({ legendSetIds, dataEngine }) => {
    if (!legendSetIds.length) {
        return []
    }

    const legendSets = await apiFetchLegendSetsByIds({
        dataEngine,
        ids: legendSetIds,
    })

    return legendSets
}

const extractHeaders = (analyticsResponse) =>
    analyticsResponse.headers.map((header, index) => {
        const result = { ...header, index }
        const { dimensionId, programStageId } = extractDimensionIdParts(
            header.name
        )
        if (
            programStageId &&
            analyticsResponse.headers.filter((h) =>
                h.name.includes(dimensionId)
            ).length > 1
        ) {
            result.column += ` - ${analyticsResponse.metaData.items[programStageId].name}`
        }
        return result
    })

const extractRows = (analyticsResponse, headers) => {
    const filteredRows = []

    for (
        let rowIndex = 0, rowsCount = analyticsResponse.rows.length;
        rowIndex < rowsCount;
        rowIndex++
    ) {
        const row = analyticsResponse.rows[rowIndex]

        const filteredRow = []

        for (
            let headerIndex = 0, headersCount = headers.length;
            headerIndex < headersCount;
            headerIndex++
        ) {
            const header = headers[headerIndex]

            const rowValue = row[header.index]

            filteredRow.push(
                formatRowValue(
                    rowValue,
                    header,
                    analyticsResponse.metaData.items
                )
            )
        }

        filteredRows.push(filteredRow)
    }

    return filteredRows
}

const valueTypeIsNumeric = (valueType) =>
    [
        VALUE_TYPE_NUMBER,
        VALUE_TYPE_UNIT_INTERVAL,
        VALUE_TYPE_PERCENTAGE,
        VALUE_TYPE_INTEGER,
        VALUE_TYPE_INTEGER_POSITIVE,
        VALUE_TYPE_INTEGER_NEGATIVE,
        VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
    ].includes(valueType)

const useAnalyticsData = ({
    visualization,
    relativePeriodDate,
    onResponseReceived,
    pageSize,
    page,
    sortField,
    sortDirection,
}) => {
    const dataEngine = useDataEngine()
    const isGlobalLoading = useSelector(sGetIsVisualizationLoading)
    const [analyticsEngine] = useState(() => Analytics.getAnalytics(dataEngine))
    const mounted = useRef(false)
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(undefined)
    const [data, setData] = useState(null)
    const { userSettings } = useCachedDataQuery()

    const doFetch = useCallback(async () => {
        try {
            const analyticsResponse = await fetchAnalyticsData({
                analyticsEngine,
                page,
                pageSize,
                relativePeriodDate,
                sortDirection,
                sortField,
                visualization,
                nameProp:
                    userSettings[USER_SETTINGS_DISPLAY_PROPERTY].toUpperCase(),
            })
            const headers = extractHeaders(analyticsResponse)
            const rows = extractRows(analyticsResponse, headers)
            const pager = analyticsResponse.metaData.pager
            const legendSetIds = []
            const headerLegendSetMap = headers.reduce(
                (acc, header) => ({
                    ...acc,
                    [header.name]:
                        analyticsResponse.metaData.items[header.name]
                            ?.legendSet,
                }),
                {}
            )
            if (
                visualization.legend?.strategy ===
                    LEGEND_DISPLAY_STRATEGY_FIXED &&
                visualization.legend?.set?.id
            ) {
                legendSetIds.push(visualization.legend.set.id)
            } else if (
                visualization.legend?.strategy ===
                LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM
            ) {
                Object.values(headerLegendSetMap)
                    .filter((legendSet) => legendSet)
                    .forEach((legendSet) => legendSetIds.push(legendSet))
            }

            const legendSets = await fetchLegendSets({
                legendSetIds,
                dataEngine,
            })

            if (legendSets.length) {
                headers
                    .filter((header) => valueTypeIsNumeric(header.valueType))
                    .forEach((header) => {
                        switch (visualization.legend.strategy) {
                            case LEGEND_DISPLAY_STRATEGY_FIXED:
                                header.legendSet = legendSets[0]
                                break
                            case LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM: {
                                header.legendSet = legendSets.find(
                                    (legendSet) =>
                                        legendSet.id ===
                                        headerLegendSetMap[header.name]
                                )
                                break
                            }
                        }
                    })
            }

            mounted.current && setError(undefined)
            mounted.current && setData({ headers, rows, ...pager })
            onResponseReceived(analyticsResponse)
        } catch (error) {
            mounted.current && setError(error)
        } finally {
            mounted.current && setLoading(false)
            mounted.current && setFetching(false)
        }
    }, [
        analyticsEngine,
        page,
        pageSize,
        relativePeriodDate,
        sortDirection,
        sortField,
        visualization,
    ])

    useEffect(() => {
        /*
         * Hack to prevent state updates on unmounted components
         * needed because the analytics engine cannot cancel requests
         */
        mounted.current = true

        return () => {
            mounted.current = false
        }
    }, [])

    useEffect(() => {
        setFetching(true)
        doFetch()
    }, [
        visualization,
        page,
        pageSize,
        sortField,
        sortDirection,
        relativePeriodDate,
    ])

    useEffect(() => {
        // Do a full reset when loading a new visualization
        if (isGlobalLoading) {
            setFetching(false)
            setLoading(false)
            setError(undefined)
            setData(null)
        }
    }, [isGlobalLoading])

    return {
        loading,
        fetching,
        error,
        data,
        isGlobalLoading,
    }
}

export { useAnalyticsData, getAnalyticsEndpoint, getAdaptedVisualization }
