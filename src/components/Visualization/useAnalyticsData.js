import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    Analytics,
} from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useEffect, useState, useRef } from 'react'
import {
    DIMENSION_TYPE_EVENT_DATE,
    DIMENSION_TYPE_ENROLLMENT_DATE,
    DIMENSION_TYPE_INCIDENT_DATE,
    DIMENSION_TYPE_SCHEDULED_DATE,
    DIMENSION_TYPE_LAST_UPDATED,
} from '../../modules/dimensionTypes.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
    headersMap,
} from '../../modules/visualization.js'

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

const isTimeDimension = (dimensionId) =>
    [
        DIMENSION_TYPE_EVENT_DATE,
        DIMENSION_TYPE_ENROLLMENT_DATE,
        DIMENSION_TYPE_INCIDENT_DATE,
        DIMENSION_TYPE_SCHEDULED_DATE,
        DIMENSION_TYPE_LAST_UPDATED,
    ].includes(dimensionId)

const getAdaptedVisualization = (visualization) => {
    const timeDimensionParameters = {}

    const adaptDimensions = (dimensions) => {
        const adaptedDimensions = []
        dimensions.forEach((dimensionObj) => {
            const dimensionId = dimensionObj.dimension

            isTimeDimension(dimensionId)
                ? (timeDimensionParameters[dimensionId] =
                      dimensionObj.items?.map((item) => item.id))
                : adaptedDimensions.push(dimensionObj)
        })
        return adaptedDimensions
    }

    const adaptedColumns = adaptDimensions(visualization[AXIS_ID_COLUMNS])
    const adaptedRows = adaptDimensions(visualization[AXIS_ID_ROWS])
    const adaptedFilters = adaptDimensions(visualization[AXIS_ID_FILTERS])

    const headers = [
        ...visualization[AXIS_ID_COLUMNS],
        ...visualization[AXIS_ID_ROWS],
    ].map(
        ({ dimension: dimensionId }) => headersMap[dimensionId] || dimensionId
    )

    return {
        adaptedVisualization: {
            [AXIS_ID_COLUMNS]: adaptedColumns,
            [AXIS_ID_ROWS]: adaptedRows,
            [AXIS_ID_FILTERS]: adaptedFilters,
        },
        headers,
        timeDimensionParameters,
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
    const { adaptedVisualization, headers, timeDimensionParameters } =
        getAdaptedVisualization(visualization)

    let req = new analyticsEngine.request()
        .fromVisualization(adaptedVisualization)
        .withParameters({
            headers: headers,
            ...timeDimensionParameters,
        })
        .withProgram(visualization.program.id)
        .withStage(visualization.programStage.id)
        .withDisplayProperty('NAME') // TODO from settings ?!
        .withOutputType(visualization.outputType)
        .withParameters({ completedOnly: visualization.completedOnly })
        .withPageSize(pageSize)
        .withPage(page)

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
    const [analyticsEngine] = useState(() => Analytics.getAnalytics(dataEngine))
    const mounted = useRef(false)
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(undefined)
    const [data, setData] = useState(null)

    useEffect(() => {
        mounted.current = true
        setFetching(true)

        const doFetch = async () => {
            try {
                const analyticsResponse = await fetchAnalyticsData({
                    analyticsEngine,
                    visualization,
                    pageSize,
                    page,
                    relativePeriodDate,
                    sortField,
                    sortDirection,
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
        }

        doFetch()

        return () => {
            // Hack to prevent state updates on unmounted components
            // needed because the analytics engine cannot cancel requests
            mounted.current = false
        }
    }, [
        visualization,
        page,
        pageSize,
        sortField,
        sortDirection,
        relativePeriodDate,
    ])

    return {
        loading,
        fetching,
        error,
        data,
    }
}

export { useAnalyticsData }
