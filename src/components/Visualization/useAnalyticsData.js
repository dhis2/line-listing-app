import { Analytics } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useEffect, useState, useRef } from 'react'

const VALUE_TYPE_BOOLEAN = 'BOOLEAN'

const booleanMap = {
    0: i18n.t('No'),
    1: i18n.t('Yes'),
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
    let req = new analyticsEngine.request()
        .fromVisualization(visualization)
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

    const rawResponse = await analyticsEngine.events.getQuery(req)

    return rawResponse
}

const reduceHeaders = (analyticsResponse, visualization) => {
    // special handling for ou column, use the value from the ouname column instead of the id from ou
    const ouNameHeaderIndex = analyticsResponse.headers.findIndex(
        (header) => header.name === 'ouname'
    )

    return visualization.columns.reduce((headers, column) => {
        const headerIndex = analyticsResponse.headers.findIndex(
            (header) => header.name === column.dimension
        )

        if (headerIndex !== -1) {
            headers.push({
                ...analyticsResponse.headers[headerIndex],
                index:
                    column.dimension === 'ou' ? ouNameHeaderIndex : headerIndex,
            })
        } else {
            // TODO figure out what to do when no header match the column (ie. pe)
            headers.push(undefined)
        }

        return headers
    }, [])
}

const reduceRows = (analyticsResponse, headers) =>
    analyticsResponse.rows.reduce((filteredRows, row) => {
        filteredRows.push(
            headers.reduce((filteredRow, header) => {
                if (header) {
                    const rowValue = row[header.index]

                    filteredRow.push(
                        header.valueType === VALUE_TYPE_BOOLEAN
                            ? booleanMap[rowValue]
                            : analyticsResponse.metaData.items[rowValue]
                                  ?.name || rowValue
                    )
                } else {
                    // TODO solve the case of visualization.column not mapping to any response.header (ie. "pe")
                    filteredRow.push('-')
                }
                return filteredRow
            }, [])
        )
        return filteredRows
    }, [])

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
                const headers = reduceHeaders(analyticsResponse, visualization)
                const rows = reduceRows(analyticsResponse, headers)
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
