import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    Analytics,
} from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import {
    BOOLEAN_VALUES,
    NULL_VALUE,
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_TRUE_ONLY,
} from '../../modules/conditions.js'
import {
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_IDS_TIME,
} from '../../modules/dimensionConstants.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
    headersMap,
} from '../../modules/visualization.js'
import { sGetIsVisualizationLoading } from '../../reducers/loader.js'
import { sGetUiSorting } from '../../reducers/ui.js'

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
        .withDisplayProperty('NAME') // TODO from settings ?!
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

const extractHeaders = (analyticsResponse) =>
    analyticsResponse.headers.map((header, index) => ({
        ...header,
        index,
    }))

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

const useAnalyticsData = ({
    visualization,
    relativePeriodDate,
    onResponseReceived,
    page,
    pageSize,
}) => {
    const dataEngine = useDataEngine()
    const isGlobalLoading = useSelector(sGetIsVisualizationLoading)
    const { sortField, sortDirection } = useSelector(sGetUiSorting)
    const [analyticsEngine] = useState(() => Analytics.getAnalytics(dataEngine))
    const mounted = useRef(false)
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(undefined)
    const [data, setData] = useState(null)

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
            })
            const headers = extractHeaders(analyticsResponse)
            const rows = extractRows(analyticsResponse, headers)
            const pager = analyticsResponse.metaData.pager

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
