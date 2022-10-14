import {
    formatValue,
    getColorByValueFromLegendSet,
    LegendKey,
    LEGEND_DISPLAY_STYLE_FILL,
    LEGEND_DISPLAY_STYLE_TEXT,
    VALUE_TYPE_DATE,
    VALUE_TYPE_DATETIME,
    VALUE_TYPE_TEXT,
    VALUE_TYPE_URL,
} from '@dhis2/analytics'
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
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import {
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_LAST_UPDATED,
} from '../../modules/dimensionConstants.js'
import {
    DISPLAY_DENSITY_COMFORTABLE,
    DISPLAY_DENSITY_COMPACT,
    FONT_SIZE_LARGE,
    FONT_SIZE_NORMAL,
    FONT_SIZE_SMALL,
} from '../../modules/options.js'
import { headersMap, statusNames } from '../../modules/visualization.js'
import styles from './styles/Visualization.module.css'
import { useAnalyticsData } from './useAnalyticsData.js'

export const DEFAULT_SORT_DIRECTION = 'asc'
export const FIRST_PAGE = 1
export const PAGE_SIZE = 100

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

const getSizeClass = (displayDensity) => {
    switch (displayDensity) {
        case DISPLAY_DENSITY_COMFORTABLE:
            return styles.sizeComfortable
        case DISPLAY_DENSITY_COMPACT:
            return styles.sizeCompact
        default:
            return styles.sizeNormal
    }
}

export const Visualization = ({
    filters,
    visualization,
    isVisualizationLoading,
    onResponsesReceived,
    onColumnHeaderClick,
    onError,
}) => {
    const [uniqueLegendSets, setUniqueLegendSets] = useState([])
    const [{ sortField, sortDirection, pageSize, page }, setSorting] = useState(
        {
            sortField: null,
            sortDirection: DEFAULT_SORT_DIRECTION,
            page: FIRST_PAGE,
            pageSize: PAGE_SIZE,
        }
    )

    const isInModal = !!filters?.relativePeriodDate

    const { fetching, error, data } = useAnalyticsData({
        filters,
        visualization,
        isVisualizationLoading,
        onResponsesReceived,
        pageSize,
        page,
        sortField,
        sortDirection,
    })

    useEffect(() => {
        if (data && visualization) {
            const allLegendSets = data.headers
                .filter((header) => header.legendSet)
                .map((header) => header.legendSet)
            const relevantLegendSets = allLegendSets.filter(
                (e, index) =>
                    allLegendSets.findIndex((a) => a.id === e.id) === index &&
                    e.legends?.length
            )
            if (relevantLegendSets.length && visualization.legend?.showKey) {
                setUniqueLegendSets(relevantLegendSets)
            } else {
                setUniqueLegendSets([])
            }
        } else {
            setUniqueLegendSets([])
        }
    }, [data, visualization])

    useEffect(() => {
        if (error && onError) {
            onError(error)
        }
    }, [error, onError])

    if (!data || error) {
        return null
    }

    const sizeClass = getSizeClass(visualization.displayDensity)
    const fontSizeClass = getFontSizeClass(visualization.fontSize)
    const colSpan = String(Math.max(data.headers.length, 1))

    const sortData = ({ name, direction }) =>
        setSorting({
            sortField: name,
            sortDirection: direction,
            pageSize,
            page: FIRST_PAGE,
        })

    const setPage = (pageNum) =>
        setSorting({
            sortField,
            sortDirection,
            pageSize,
            page: pageNum,
        })

    const setPageSize = (pageSizeNum) =>
        setSorting({
            sortField,
            sortDirection,
            pageSize: pageSizeNum,
            page: FIRST_PAGE,
        })

    const reverseLookupDimensionId = (dimensionId) =>
        Object.keys(headersMap).find((key) => headersMap[key] === dimensionId)

    const formatCellValue = (value, header) => {
        if (
            [
                headersMap[DIMENSION_ID_EVENT_STATUS],
                headersMap[DIMENSION_ID_PROGRAM_STATUS],
            ].includes(header?.name)
        ) {
            return statusNames[value] || value
        } else if (
            [VALUE_TYPE_DATE, VALUE_TYPE_DATETIME].includes(header?.valueType)
        ) {
            return (
                value &&
                moment(value).format(
                    header.name === headersMap[DIMENSION_ID_LAST_UPDATED] ||
                        header?.valueType === VALUE_TYPE_DATETIME
                        ? 'yyyy-MM-DD hh:mm'
                        : 'yyyy-MM-DD'
                )
            )
        } else if (header?.valueType === VALUE_TYPE_URL) {
            return (
                <a href={value} target="_blank" rel="noreferrer">
                    {value}
                </a>
            )
        } else {
            return formatValue(value, header?.valueType || VALUE_TYPE_TEXT, {
                digitGroupSeparator: visualization.digitGroupSeparator,
                skipRounding: false, // TODO should there be an option for this?
            })
        }
    }

    const formatCellHeader = (header) => {
        let headerName = header.column

        const dimensionId = Number.isInteger(header?.stageOffset)
            ? header.name.replace(/\[-?\d+\]/, '')
            : header.name

        if (Number.isInteger(header.stageOffset)) {
            let postfix

            if (header.stageOffset === 0) {
                postfix = i18n.t('most recent')
            } else if (header.stageOffset === 1) {
                postfix = i18n.t('oldest')
            } else if (header.stageOffset > 1) {
                postfix = i18n.t('oldest {{repeatEventIndex}}', {
                    repeatEventIndex: `+${header.stageOffset - 1}`,
                })
            } else if (header.stageOffset < 0) {
                postfix = i18n.t('most recent {{repeatEventIndex}}', {
                    repeatEventIndex: header.stageOffset,
                })
            }

            headerName = `${header.column} (${postfix})`
        }

        return (
            <span
                className={cx(styles.headerCell, styles.dimensionModalHandler)}
                onClick={
                    onColumnHeaderClick
                        ? () =>
                              onColumnHeaderClick(
                                  reverseLookupDimensionId(dimensionId) ||
                                      dimensionId
                              )
                        : undefined
                }
            >
                {headerName}
            </span>
        )
    }

    const getLegendKey = () => (
        <div
            className={styles.legendKeyScrollbox}
            data-test="visualization-legend-key"
        >
            <LegendKey legendSets={uniqueLegendSets} />
        </div>
    )

    return (
        <div className={styles.pluginContainer}>
            <div
                className={cx(styles.fetchIndicator, {
                    [styles.fetching]: fetching,
                })}
            >
                <DataTable
                    scrollHeight={isInModal ? 'calc(100vh - 285px)' : '100%'}
                    scrollWidth={'100%'}
                    width="auto"
                    className={styles.dataTable}
                    dataTest="line-list-table"
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
                                        onSortIconClick={sortData}
                                        sortDirection={
                                            header.name === sortField
                                                ? sortDirection
                                                : 'default'
                                        }
                                        className={cx(
                                            styles.headerCell,
                                            fontSizeClass,
                                            sizeClass
                                        )}
                                        dataTest={'table-header'}
                                    >
                                        {formatCellHeader(header)}
                                    </DataTableColumnHeader>
                                ) : (
                                    <DataTableColumnHeader
                                        fixed
                                        top="0"
                                        key={`undefined_${index}`} // FIXME this is due to pe not being present in headers, needs special handling
                                        className={cx(
                                            styles.headerCell,
                                            fontSizeClass,
                                            sizeClass
                                        )}
                                        dataTest={'table-header'}
                                    />
                                )
                            )}
                        </DataTableRow>
                    </DataTableHead>
                    {/* https://jira.dhis2.org/browse/LIBS-278 */}
                    <DataTableBody dataTest={'table-body'}>
                        {data.rows.map((row, index) => (
                            <DataTableRow key={index} dataTest={'table-row'}>
                                {row.map((value, index) => (
                                    <DataTableCell
                                        key={index}
                                        className={cx(
                                            styles.cell,
                                            fontSizeClass,
                                            sizeClass,
                                            {
                                                [styles.emptyCell]: !value,
                                            }
                                        )}
                                        backgroundColor={
                                            visualization.legend?.style ===
                                            LEGEND_DISPLAY_STYLE_FILL
                                                ? getColorByValueFromLegendSet(
                                                      data.headers[index]
                                                          .legendSet,
                                                      value
                                                  )
                                                : undefined
                                        }
                                        dataTest={'table-cell'}
                                    >
                                        <div
                                            style={
                                                visualization.legend?.style ===
                                                LEGEND_DISPLAY_STYLE_TEXT
                                                    ? {
                                                          color: getColorByValueFromLegendSet(
                                                              data.headers[
                                                                  index
                                                              ].legendSet,
                                                              value
                                                          ),
                                                      }
                                                    : {}
                                            }
                                        >
                                            {formatCellValue(
                                                value,
                                                data.headers[index]
                                            )}
                                        </div>
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
                                    className={cx(
                                        styles.stickyNavigation,
                                        sizeClass
                                    )}
                                >
                                    <Pagination
                                        disabled={fetching}
                                        page={data.pager.page}
                                        // DHIS2-13493: avoid a crash when the pager object in the analytics response is malformed.
                                        // When that happens pageSize is 0 which causes the crash because the Rows per page select does not have 0 listed as possible option.
                                        // The backend should always return the value passed in the request, even if there are no rows for the query.
                                        // The workaround here makes sure that if the pageSize returned is 0 we use a value which can be selected in the Rows per page select.
                                        pageSize={
                                            data.pager.pageSize || PAGE_SIZE
                                        }
                                        isLastPage={data.pager.isLastPage}
                                        onPageChange={setPage}
                                        onPageSizeChange={setPageSize}
                                        pageSizeSelectText={i18n.t(
                                            'Rows per page'
                                        )}
                                        pageLength={data.rows.length}
                                        pageSummaryText={({
                                            firstItem,
                                            lastItem,
                                            page,
                                        }) =>
                                            i18n.t(
                                                'Page {{page}}, row {{firstItem}}-{{lastItem}}',
                                                {
                                                    firstItem,
                                                    lastItem,
                                                    page,
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
            {Boolean(uniqueLegendSets.length) && getLegendKey()}
        </div>
    )
}

Visualization.defaultProps = {
    isVisualizationLoading: false,
    onResponsesReceived: Function.prototype,
}

Visualization.propTypes = {
    isVisualizationLoading: PropTypes.bool.isRequired,
    visualization: PropTypes.object.isRequired,
    onResponsesReceived: PropTypes.func.isRequired,
    filters: PropTypes.object,
    onColumnHeaderClick: PropTypes.func,
    onError: PropTypes.func,
}
