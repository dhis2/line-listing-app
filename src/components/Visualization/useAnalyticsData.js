import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    Analytics,
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
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState, useRef, useCallback } from 'react'
import { getBooleanValues, NULL_VALUE } from '../../modules/conditions.js'
import {
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_CREATED,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_IDS_TIME,
} from '../../modules/dimensionConstants.js'
import { getRequestOptions } from '../../modules/getRequestOptions.js'
import { getMainDimensions } from '../../modules/mainDimensions.js'
import { getProgramDimensions } from '../../modules/programDimensions.js'
import { isAoWithTimeDimension } from '../../modules/timeDimensions.js'
import {
    extractDimensionIdParts,
    formatDimensionId,
    getDimensionsWithSuffix,
} from '../../modules/utils.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
    getHeadersMap,
    headersMap,
} from '../../modules/visualization.js'

const analyticsApiEndpointMap = {
    [OUTPUT_TYPE_ENROLLMENT]: 'enrollments',
    [OUTPUT_TYPE_EVENT]: 'events',
    [OUTPUT_TYPE_TRACKED_ENTITY]: 'trackedEntities',
}

const excludedDimensions = [
    DIMENSION_ID_CREATED,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
]

const lookupOptionSetOptionMetadata = (optionSetId, code, metaDataItems) => {
    const optionSetMetaData = metaDataItems?.[optionSetId]

    if (optionSetMetaData) {
        const optionId = optionSetMetaData.options.find(
            (option) => option.code === code
        )?.uid

        return metaDataItems[optionId]
    }

    return undefined
}
const NOT_DEFINED_VALUE = 'ND'

export const cellIsUndefined = (rowContext = {}, rowIndex, columnIndex) =>
    (rowContext[rowIndex] || {})[columnIndex]?.valueStatus === NOT_DEFINED_VALUE

const formatRowValue = ({ rowValue, header, metaDataItems, isUndefined }) => {
    switch (header.valueType) {
        case VALUE_TYPE_BOOLEAN:
        case VALUE_TYPE_TRUE_ONLY:
            return !isUndefined
                ? getBooleanValues()[rowValue || NULL_VALUE]
                : ''
        default: {
            if (!rowValue) {
                return rowValue
            }

            if (header.optionSet) {
                return (
                    lookupOptionSetOptionMetadata(
                        header.optionSet,
                        rowValue,
                        metaDataItems
                    )?.name || rowValue
                )
            }

            return metaDataItems[rowValue]?.name || rowValue
        }
    }
}

const isTimeDimension = (dimensionId) => DIMENSION_IDS_TIME.has(dimensionId)

const getAnalyticsEndpoint = (outputType) => analyticsApiEndpointMap[outputType]

const getAdaptedVisualization = (visualization) => {
    const outputType = visualization.outputType

    const parameters = getRequestOptions(visualization)

    const adaptDimensions = (dimensions) => {
        const adaptedDimensions = []
        dimensions.forEach((dimensionObj) => {
            const dimensionId = dimensionObj.dimension

            if (
                isTimeDimension(dimensionId) ||
                dimensionId === DIMENSION_ID_EVENT_STATUS ||
                dimensionId === DIMENSION_ID_PROGRAM_STATUS ||
                dimensionId === DIMENSION_ID_CREATED
            ) {
                if (dimensionObj.items?.length) {
                    const items = dimensionObj.items?.map((item) => item.id)
                    if (
                        dimensionId === DIMENSION_ID_PROGRAM_STATUS &&
                        Array.isArray(parameters[dimensionId])
                    ) {
                        parameters[dimensionId].push(...items)
                    } else {
                        parameters[dimensionId] = items
                    }
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

    const dimensionHeadersMap = getHeadersMap(visualization)

    const headers = [
        ...visualization[AXIS_ID_COLUMNS],
        ...visualization[AXIS_ID_ROWS],
    ].map(({ dimension, program, programStage, repetition }) => {
        const programStageId = programStage?.id

        if (repetition?.indexes?.length) {
            return repetition.indexes.map((index) =>
                formatDimensionId({
                    programId: program?.id,
                    programStageId: `${programStageId}[${index}]`,
                    dimensionId: dimensionHeadersMap[dimension] || dimension,
                    outputType,
                })
            )
        } else {
            return formatDimensionId({
                programId: program?.id,
                programStageId,
                dimensionId: dimensionHeadersMap[dimension] || dimension,
                outputType,
            })
        }
    })

    return {
        adaptedVisualization: {
            [AXIS_ID_COLUMNS]: adaptedColumns,
            [AXIS_ID_ROWS]: adaptedRows,
            [AXIS_ID_FILTERS]: adaptedFilters,
            outputType,
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
    displayProperty,
}) => {
    // TODO must be reviewed when PT comes around. Most likely LL and PT have quite different handling
    const { adaptedVisualization, headers, parameters } =
        getAdaptedVisualization(visualization)

    let req = new analyticsEngine.request()
        .fromVisualization(adaptedVisualization)
        .withParameters({
            headers,
            totalPages: false,
            ...(visualization.outputType !== OUTPUT_TYPE_EVENT
                ? { rowContext: true }
                : {}),
            ...parameters,
        })
        .withDisplayProperty(displayProperty.toUpperCase())
        .withPageSize(pageSize)
        .withPage(page)
        .withIncludeMetadataDetails()

    // trackedEntity request can use multiple programs
    if (visualization.outputType !== OUTPUT_TYPE_TRACKED_ENTITY) {
        req = req
            .withProgram(visualization.program.id)
            .withOutputType(visualization.outputType)
    }

    if (visualization.outputType === OUTPUT_TYPE_EVENT) {
        req = req.withStage(visualization.programStage?.id)
    }

    if (visualization.outputType === OUTPUT_TYPE_TRACKED_ENTITY) {
        req = req.withTrackedEntityType(visualization.trackedEntityType.id)
    }

    if (relativePeriodDate && isAoWithTimeDimension(visualization)) {
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

const extractHeaders = (analyticsResponse, outputType) => {
    const defaultMetadata = getMainDimensions(outputType)
    const dimensionIds = analyticsResponse.headers.map((header) => {
        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(header.name, outputType)
        const idMatch = Object.keys(headersMap).find(
            (key) => headersMap[key] === dimensionId
        )

        const formattedDimensionId = formatDimensionId({
            dimensionId: [
                DIMENSION_ID_ORGUNIT,
                DIMENSION_ID_PROGRAM_STATUS,
            ].includes(idMatch)
                ? idMatch
                : dimensionId,
            programStageId,
            programId,
            outputType,
        })

        if (
            programId &&
            [DIMENSION_ID_ORGUNIT, DIMENSION_ID_PROGRAM_STATUS].includes(
                idMatch
            )
        ) {
            defaultMetadata[formattedDimensionId] =
                getProgramDimensions(programId)[formattedDimensionId]
        }

        // TODO: add logic/metadata for time dimensions here

        return formattedDimensionId
    })

    const metadata = { ...analyticsResponse.metaData.items, ...defaultMetadata }

    const dimensionsWithSuffix = getDimensionsWithSuffix({
        dimensionIds,
        metadata,
        inputType: outputType,
    })

    const labels = dimensionsWithSuffix.map(({ name, suffix, id }) => ({
        id,
        label: suffix ? `${name}, ${suffix} !!!` : name, // TODO: remove the !!!, just for testing
    }))

    const headers = analyticsResponse.headers.map((header, index) => {
        const result = { ...header, index }
        const { dimensionId, programId, programStageId } =
            extractDimensionIdParts(header.name, outputType)

        const idMatch = Object.keys(headersMap).find(
            (key) => headersMap[key] === dimensionId
        )

        result.column =
            labels.find(
                (label) =>
                    label.id ===
                    formatDimensionId({
                        dimensionId: [
                            DIMENSION_ID_ORGUNIT,
                            DIMENSION_ID_PROGRAM_STATUS,
                        ].includes(idMatch)
                            ? idMatch
                            : dimensionId,
                        programId,
                        programStageId,
                        outputType,
                    })
            )?.label || result.column

        return result
    })
    return headers
}

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
                formatRowValue({
                    rowValue,
                    header,
                    metaDataItems: analyticsResponse.metaData.items,
                    isUndefined: cellIsUndefined(
                        analyticsResponse.rowContext,
                        rowIndex,
                        headerIndex
                    ),
                })
            )
        }

        filteredRows.push(filteredRow)
    }

    return filteredRows
}

const extractRowContext = (analyticsResponse) => analyticsResponse.rowContext

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
    filters,
    isVisualizationLoading: isGlobalLoading,
    displayProperty,
    onResponsesReceived,
    pageSize,
    page,
    sortField,
    sortDirection,
}) => {
    const dataEngine = useDataEngine()
    const [analyticsEngine] = useState(() => Analytics.getAnalytics(dataEngine))
    const mounted = useRef(false)
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(undefined)
    const [data, setData] = useState(null)
    const relativePeriodDate = filters?.relativePeriodDate

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
                displayProperty,
            })
            const headers = extractHeaders(
                analyticsResponse,
                visualization.outputType
            )
            const rows = extractRows(analyticsResponse, headers)
            const rowContext = extractRowContext(analyticsResponse)
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
                visualization.legend.set?.id
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
            mounted.current && setData({ headers, rows, pager, rowContext })
            onResponsesReceived(analyticsResponse)
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
        doFetch,
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
