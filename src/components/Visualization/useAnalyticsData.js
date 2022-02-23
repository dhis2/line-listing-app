import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    Analytics,
} from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import {
    DIMENSION_TYPE_PROGRAM_STATUS,
    DIMENSION_TYPE_EVENT_STATUS,
    DIMENSION_TYPE_CREATED_BY,
    DIMENSION_TYPE_LAST_UPDATED_BY,
    DIMENSION_TYPES_TIME,
} from '../../modules/dimensionTypes.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
    headersMap,
} from '../../modules/visualization.js'
import { sGetIsVisualizationLoading } from '../../reducers/loader.js'

const VALUE_TYPE_BOOLEAN = 'BOOLEAN'
const VALUE_TYPE_TRUE_ONLY = 'TRUE_ONLY'

const booleanMap = {
    0: i18n.t('No'),
    1: i18n.t('Yes'),
}

const analyticsApiEndpointMap = {
    [OUTPUT_TYPE_ENROLLMENT]: 'enrollments',
    [OUTPUT_TYPE_EVENT]: 'events',
}

const excludedDimensions = [
    DIMENSION_TYPE_CREATED_BY,
    DIMENSION_TYPE_LAST_UPDATED_BY,
]

const findOptionSetItem = (code, metaDataItems) =>
    Object.values(metaDataItems).find((item) => item.code === code)

const formatRowValue = (rowValue, header, metaDataItems) => {
    switch (header.valueType) {
        case VALUE_TYPE_BOOLEAN:
        case VALUE_TYPE_TRUE_ONLY:
            return booleanMap[rowValue] || i18n.t('Not answered')
        default:
            return header.optionSet
                ? findOptionSetItem(rowValue, metaDataItems)?.name || rowValue
                : metaDataItems[rowValue]?.name || rowValue
    }
}

const isTimeDimension = (dimensionId) => DIMENSION_TYPES_TIME.has(dimensionId)

const getAdaptedVisualization = (visualization) => {
    const parameters = {}

    const adaptDimensions = (dimensions) => {
        const adaptedDimensions = []
        dimensions.forEach((dimensionObj) => {
            const dimensionId = dimensionObj.dimension

            if (
                isTimeDimension(dimensionId) ||
                dimensionId === DIMENSION_TYPE_EVENT_STATUS ||
                dimensionId === DIMENSION_TYPE_PROGRAM_STATUS
            ) {
                parameters[dimensionId] = dimensionObj.items?.map(
                    (item) => item.id
                )
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

    const analyticsApiEndpoint =
        analyticsApiEndpointMap[visualization.outputType]

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
    sortField,
    sortDirection,
    page,
    pageSize,
}) => {
    const dataEngine = useDataEngine()
    const isGlobalLoading = useSelector(sGetIsVisualizationLoading)
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
            const pageCount = analyticsResponse.metaData.pager.pageCount
            const total = analyticsResponse.metaData.pager.total

            mounted.current && setError(undefined)
            mounted.current && setData({ headers, rows, pageCount, total })
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

export { useAnalyticsData }
