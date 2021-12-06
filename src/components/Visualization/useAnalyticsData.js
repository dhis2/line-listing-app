import { Analytics } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState, useRef } from 'react'

const fetchAnalyticsData = async ({
    analyticsEngine,
    visualization,
    pageSize,
    page,
    relativePeriodDate,
    sortField,
    sortDirection,
}) => {
    const req = new analyticsEngine.request()
        .fromVisualization(visualization)
        .withProgram(visualization.program.id)
        .withStage(visualization.programStage.id)
        .withDisplayProperty('NAME') // TODO from settings ?!
        .withOutputType(visualization.outputType)
        .withParameters({ completedOnly: visualization.completedOnly })
        .withPageSize(pageSize)
        .withPage(page)

    if (relativePeriodDate) {
        req.withRelativePeriodDate(relativePeriodDate)
    }

    if (sortField) {
        switch (sortDirection) {
            case 'asc':
                req.withAsc(sortField)
                break
            case 'desc':
                req.withDesc(sortField)
                break
        }
    }

    const rawResponse = await analyticsEngine.events.getQuery(req)

    return new analyticsEngine.response(rawResponse)
}

const reduceHeaders = (analyticsResponse, visualization) =>
    visualization.columns.reduce((headers, column) => {
        headers.push(analyticsResponse.getHeader(column.dimension)) // TODO figure out what to do when no header match the column (ie. pe)
        return headers
    }, [])

const reduceRows = (analyticsResponse, headers) =>
    analyticsResponse.rows.reduce((filteredRows, row) => {
        filteredRows.push(
            headers.reduce((filteredRow, header) => {
                if (header) {
                    const rowValue = row[header.index]
                    const itemKey = header.isPrefix
                        ? `${header.name}_${rowValue}` // TODO underscore or space? check in AnalyticsResponse
                        : rowValue

                    filteredRow.push(
                        analyticsResponse.metaData.items[itemKey]?.name ||
                            rowValue
                    )
                } else {
                    // FIXME solve the case of visualization.column not mapping to any response.header (ie. "pe")
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
