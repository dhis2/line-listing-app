import { Analytics } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import {
    DataTable,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
    DataTableToolbar,
    TableHead,
    TableBody,
    Pagination,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/Visualization.module.css'

export const Visualization = ({ visualization, onResponseReceived }) => {
    const dataEngine = useDataEngine()
    const [analyticsResponse, setAnalyticsResponse] = useState(null)
    const [headers, setHeaders] = useState([])
    const [rows, setRows] = useState([])
    const [{ sortField, sortDirection }, setSorting] = useState({
        sortField: 'eventdate', // TODO get field name corresponding to visualization.sortOrder ?!
        sortDirection: 'desc',
    })
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(100)

    const getSortDirection = column =>
        column === sortField ? sortDirection : 'default'

    // analytics
    const fetchAnalyticsData = useCallback(async () => {
        const analyticsEngine = Analytics.getAnalytics(dataEngine)

        const req = new analyticsEngine.request()
            .fromVisualization(visualization)
            .withProgram(visualization.program.id)
            .withStage(visualization.programStage.id)
            .withDisplayProperty('NAME') // TODO from settings ?!
            .withOutputType(visualization.outputType)
            //.withDesc('eventdate') TODO see above/below
            .withPageSize(pageSize)
            .withPage(page)

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
    }, [dataEngine, visualization, page, pageSize, sortField, sortDirection])

    useEffect(() => {
        setAnalyticsResponse(null)

        const doFetch = async () => {
            const analyticsResponse = await fetchAnalyticsData()

            setAnalyticsResponse(analyticsResponse)
        }

        doFetch()
    }, [visualization, page, pageSize, sortField, sortDirection])

    useEffect(() => {
        if (analyticsResponse) {
            onResponseReceived(analyticsResponse)

            // extract headers
            const headers = visualization.columns.reduce((headers, column) => {
                headers.push(analyticsResponse.getHeader(column.dimension)) // TODO figure out what to do when no header match the column (ie. pe)
                return headers
            }, [])

            setHeaders(headers)

            // extract rows
            setRows(
                analyticsResponse.rows.reduce((filteredRows, row) => {
                    filteredRows.push(
                        headers.reduce((filteredRow, header) => {
                            if (header) {
                                const rowValue = row[header.index]
                                const itemKey = header.isPrefix
                                    ? `${header.name}_${rowValue}` // TODO underscore or space? check in AnalyticsResponse
                                    : rowValue

                                filteredRow.push(
                                    analyticsResponse.metaData.items[itemKey]
                                        ?.name || rowValue
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
            )
        }
    }, [analyticsResponse])

    if (!analyticsResponse) {
        return null
    }

    return (
        <>
            <DataTable scrollHeight="500px">
                <TableHead>
                    <DataTableRow>
                        {headers.map((header, index) =>
                            header ? (
                                <DataTableColumnHeader
                                    fixed
                                    top="0"
                                    key={header.name}
                                    name={header.name}
                                    onSortIconClick={({ name, direction }) =>
                                        setSorting({
                                            sortField: name,
                                            sortDirection: direction,
                                        })
                                    }
                                    sortDirection={getSortDirection(
                                        header.name
                                    )}
                                >
                                    {header.column}
                                </DataTableColumnHeader>
                            ) : (
                                <DataTableColumnHeader
                                    fixed
                                    top="0"
                                    key={`undefined_${index}`} // FIXME this is due to pe not being present in headers, needs special handling
                                />
                            )
                        )}
                    </DataTableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <DataTableRow key={index}>
                            {row.map((value, index) => (
                                <DataTableCell key={index}>
                                    {value}
                                </DataTableCell>
                            ))}
                        </DataTableRow>
                    ))}
                </TableBody>
            </DataTable>
            <DataTableToolbar position="bottom">
                <div className={styles.paginationControls}>
                    <Pagination
                        page={page}
                        pageCount={analyticsResponse.metaData.pager.pageCount}
                        pageSize={pageSize}
                        total={analyticsResponse.metaData.pager.total}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                    />
                </div>
            </DataTableToolbar>
        </>
    )
}

Visualization.defaultProps = {
    onResponseReceived: Function.prototype,
}

Visualization.propTypes = {
    visualization: PropTypes.object.isRequired,
    onResponseReceived: PropTypes.func,
}
