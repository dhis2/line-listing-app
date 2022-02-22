import { formatValue, AXIS_ID_COLUMNS } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DataTable,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableBody,
    DataTableFoot,
    Pagination,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetLoadError } from '../../actions/loader.js'
import {
    DIMENSION_TYPE_EVENT_STATUS,
    DIMENSION_TYPE_PROGRAM_STATUS,
} from '../../modules/dimensionTypes.js'
import { genericServerError, noPeriodError } from '../../modules/error.js'
import {
    DISPLAY_DENSITY_COMFORTABLE,
    DISPLAY_DENSITY_COMPACT,
    FONT_SIZE_LARGE,
    FONT_SIZE_NORMAL,
    FONT_SIZE_SMALL,
} from '../../modules/options.js'
import { headersMap } from '../../modules/visualization.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import styles from './styles/Visualization.module.css'
import { useAnalyticsData } from './useAnalyticsData.js'
import { useAvailableWidth } from './useAvailableWidth.js'

const getFontSizeClass = (fontSize) => {
    switch (fontSize) {
        case FONT_SIZE_LARGE:
            return styles.fontSizeLarge
        case FONT_SIZE_SMALL:
            return styles.fontSizeSmall
        case FONT_SIZE_NORMAL:
        default:
            return styles.fontSizeNormal
    }
}

export const Visualization = ({
    visualization,
    onResponseReceived,
    relativePeriodDate,
}) => {
    const dispatch = useDispatch()
    const metadata = useSelector(sGetMetadata)
    const { availableOuterWidth, availableInnerWidth } = useAvailableWidth()
    const defaultSortField = visualization[AXIS_ID_COLUMNS][0].dimension
    const defaultSortDirection = 'asc'

    const [{ sortField, sortDirection }, setSorting] = useState({
        sortField: headersMap[defaultSortField] || defaultSortField,
        sortDirection: defaultSortDirection,
    })
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(100)
    const { fetching, error, data } = useAnalyticsData({
        visualization,
        relativePeriodDate,
        onResponseReceived,
        sortField,
        sortDirection,
        page,
        pageSize,
    })

    useEffect(() => {
        if (visualization) {
            const sortField = visualization[AXIS_ID_COLUMNS][0].dimension

            setSorting({
                sortField: headersMap[sortField] || sortField,
                sortDirection: defaultSortDirection,
            })
            setPage(1)
            setPageSize(100)
        }
    }, [visualization])

    if (error) {
        let output
        if (error.details) {
            switch (error.details.errorCode) {
                case 'E7205':
                    output = noPeriodError()
                    break
                default:
                    output = error
            }
        } else {
            output = genericServerError()
        }
        dispatch(acSetLoadError(output))
    }

    if (!data || error) {
        return null
    }

    const large = visualization.displayDensity === DISPLAY_DENSITY_COMFORTABLE
    const small = visualization.displayDensity === DISPLAY_DENSITY_COMPACT
    const fontSizeClass = getFontSizeClass(visualization.fontSize)
    const colSpan = String(Math.max(data.headers.length, 1))

    const formatCellValue = (value, header) => {
        if (
            [
                headersMap[DIMENSION_TYPE_EVENT_STATUS],
                headersMap[DIMENSION_TYPE_PROGRAM_STATUS],
            ].includes(header?.name)
        ) {
            return metadata[value]?.name || value
        } else {
            return formatValue(value, header?.valueType || 'TEXT', {
                digitGroupSeparator: visualization.digitGroupSeparator,
                skipRounding: false, // TODO should there be an option for this?
            })
        }
    }

    return (
        <div className={styles.wrapper}>
            <div
                className={cx(styles.fetchIndicator, {
                    [styles.fetching]: fetching,
                })}
            >
                <DataTable
                    scrollHeight="100%"
                    width="auto"
                    scrollWidth={`${availableOuterWidth}px`}
                >
                    <DataTableHead>
                        <DataTableRow>
                            {data.headers.map((header, index) =>
                                header ? (
                                    <DataTableColumnHeader
                                        fixed
                                        top="0"
                                        key={header.name}
                                        name={header.name}
                                        onSortIconClick={({
                                            name,
                                            direction,
                                        }) =>
                                            setSorting({
                                                sortField: name,
                                                sortDirection: direction,
                                            })
                                        }
                                        sortDirection={
                                            header.name === sortField
                                                ? sortDirection
                                                : 'default'
                                        }
                                        large={large}
                                        small={small}
                                        className={fontSizeClass}
                                    >
                                        {header.column}
                                    </DataTableColumnHeader>
                                ) : (
                                    <DataTableColumnHeader
                                        fixed
                                        top="0"
                                        key={`undefined_${index}`} // FIXME this is due to pe not being present in headers, needs special handling
                                        large={large}
                                        small={small}
                                        className={fontSizeClass}
                                    />
                                )
                            )}
                        </DataTableRow>
                    </DataTableHead>
                    {/* https://jira.dhis2.org/browse/LIBS-278 */}
                    <DataTableBody>
                        {data.rows.map((row, index) => (
                            <DataTableRow key={index}>
                                {row.map((value, index) => (
                                    <DataTableCell
                                        key={index}
                                        large={large}
                                        small={small}
                                        className={fontSizeClass}
                                    >
                                        {formatCellValue(
                                            value,
                                            data.headers[index]
                                        )}
                                    </DataTableCell>
                                ))}
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                    <DataTableFoot className={styles.stickyFooter}>
                        <DataTableRow>
                            <DataTableCell
                                colSpan={colSpan}
                                staticStyle
                                className={styles.footerCell}
                            >
                                <div
                                    className={styles.stickyNavigation}
                                    style={{
                                        maxWidth: availableInnerWidth,
                                    }}
                                >
                                    <Pagination
                                        page={page}
                                        pageCount={data.pageCount}
                                        pageSize={pageSize}
                                        total={data.total}
                                        onPageChange={setPage}
                                        onPageSizeChange={setPageSize}
                                        pageSizeSelectText={i18n.t(
                                            'Cases per page'
                                        )}
                                        pageSummaryText={({
                                            firstItem,
                                            lastItem,
                                            total,
                                        }) =>
                                            i18n.t(
                                                '{{firstCaseIndex}}-{{lastCaseIndex}} of {{count}} cases',
                                                {
                                                    firstCaseIndex: firstItem,
                                                    lastCaseIndex: lastItem,
                                                    count: total,
                                                    // FIXME does it make sense if there is only 1 case?! "1 of 1 case"
                                                    // not sure is possible to have empty string for singular with i18n
                                                    // TODO also, this string for some reason is not extracted
                                                    defaultValue:
                                                        '{{firstCaseIndex}} of {{count}} case',
                                                    defaultValue_plural:
                                                        '{{firstCaseIndex}}-{{lastCaseIndex}} of {{count}} cases',
                                                }
                                            )
                                        }
                                    />
                                </div>
                            </DataTableCell>
                        </DataTableRow>
                    </DataTableFoot>
                </DataTable>
            </div>
        </div>
    )
}

Visualization.defaultProps = {
    onResponseReceived: Function.prototype,
}

Visualization.propTypes = {
    visualization: PropTypes.object.isRequired,
    onResponseReceived: PropTypes.func.isRequired,
    relativePeriodDate: PropTypes.string,
}
