import {
    getColorByValueFromLegendSet,
    LegendKey,
    LEGEND_DISPLAY_STYLE_FILL,
    LEGEND_DISPLAY_STYLE_TEXT,
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_UNIT_INTERVAL,
    VALUE_TYPE_TIME,
    VALUE_TYPE_DATE,
    VALUE_TYPE_DATETIME,
    VALUE_TYPE_PHONE_NUMBER,
    VALUE_TYPE_URL,
} from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
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
    Tooltip,
    Button,
    IconLegend24,
    NoticeBox,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback,
    useReducer,
} from 'react'
import {
    DISPLAY_DENSITY_COMFORTABLE,
    DISPLAY_DENSITY_COMPACT,
    FONT_SIZE_LARGE,
    FONT_SIZE_NORMAL,
    FONT_SIZE_SMALL,
} from '../../modules/options.js'
import {
    getFormattedCellValue,
    getHeaderText,
} from '../../modules/tableValues.js'
import { isAoWithTimeDimension } from '../../modules/timeDimensions.js'
import {
    getDefaultSorting,
    getSortingFromVisualization,
} from '../../modules/ui.js'
import {
    getDimensionIdFromHeaderName,
    transformVisualization,
} from '../../modules/visualization.js'
import styles from './styles/Visualization.module.css'
import { cellIsUndefined, useAnalyticsData } from './useAnalyticsData.js'

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

const getDataTableScrollHeight = (isInModal, noTimeDimensionWarningRef) => {
    if (isInModal) {
        const reservedHeight =
            285 + (noTimeDimensionWarningRef?.current?.clientHeight ?? 0)
        return `calc(100vh - ${reservedHeight}px)`
    } else {
        return '100%'
    }
}

const PaginationComponent = ({ offline, ...props }) =>
    offline ? (
        <Tooltip content={i18n.t('Not available offline')}>
            <Pagination {...props} />
        </Tooltip>
    ) : (
        <Pagination {...props} />
    )

PaginationComponent.propTypes = {
    offline: PropTypes.bool,
}

export const Visualization = ({
    filters,
    visualization: AO,
    isVisualizationLoading = false,
    displayProperty = 'name',
    onResponsesReceived = Function.prototype,
    onColumnHeaderClick,
    onDataSorted = Function.prototype,
    onError,
    forDashboard,
}) => {
    const containerRef = useRef(null)
    const noTimeDimensionWarningRef = useRef(null)
    const dataTableRef = useRef(null)
    const fetchContainerRef = useRef(null)
    const dataTableHeadRef = useRef(null)
    const dataTableFootRef = useRef(null)
    const legendKeyRef = useRef(null)

    const [uniqueLegendSets, setUniqueLegendSets] = useState([])
    const [showLegendKey, setShowLegendKey] = useState(false)
    const [measuredDimensions, setMeasuredDimensions] = useState({
        containerMaxWidth: 0,
        paginationMaxWidth: 0,
        noticeBoxMaxWidth: 0,
    })
    const visualization = useMemo(() => AO && transformVisualization(AO), [AO])
    const isInModal = !!filters?.relativePeriodDate
    const hasTimeDimension = useMemo(
        () => isAoWithTimeDimension(visualization),
        [visualization]
    )
    const shouldShowTimeDimensionWarning = isInModal && !hasTimeDimension

    const visualizationRef = useRef(visualization)

    const onResize = useCallback(
        () =>
            requestAnimationFrame(() => {
                if (
                    !containerRef?.current ||
                    containerRef.current.clientWidth === 0
                ) {
                    return
                }
                const containerInnerWidth = containerRef.current.clientWidth
                const scrollBox =
                    containerRef.current.querySelector('.tablescrollbox')
                const scrollbarWidth =
                    scrollBox.offsetWidth - scrollBox.clientWidth
                const legendKeyWidth =
                    legendKeyRef.current?.offsetWidth > 0
                        ? legendKeyRef.current.offsetWidth + 4
                        : 0
                const containerMaxWidth =
                    containerInnerWidth - scrollbarWidth - legendKeyWidth

                setMeasuredDimensions({
                    containerMaxWidth,
                    paginationMaxWidth: containerMaxWidth - scrollbarWidth,
                    noticeBoxMaxWidth: scrollBox.offsetWidth,
                })
            }),
        []
    )

    const sizeObserver = useMemo(
        () => new window.ResizeObserver(onResize),
        [onResize]
    )

    const mountAndObserveContainerRef = useCallback(
        (node) => {
            if (node === null) {
                return
            }

            containerRef.current = node
            sizeObserver.observe(node)

            return () => sizeObserver.unobserve(node)
        },
        [sizeObserver]
    )

    const observeVisualizationContainerRef = useCallback(
        (node) => {
            if (node === null) {
                return
            }

            sizeObserver.observe(node)

            return () => sizeObserver.unobserve(node)
        },
        [sizeObserver]
    )

    const defaultSorting = useMemo(() => getDefaultSorting(), [])

    const getSorting = useCallback(
        (visualization) => {
            const sorting =
                getSortingFromVisualization(visualization) || defaultSorting

            return {
                sortField: sorting.dimension,
                sortDirection: sorting.direction,
            }
        },
        [defaultSorting]
    )

    const { sortField, sortDirection } = getSorting(visualization)

    const [{ pageSize, page }, setPaging] = useReducer(
        (paging, newPaging) => ({ ...paging, ...newPaging }),
        {
            page: FIRST_PAGE,
            pageSize: PAGE_SIZE,
        }
    )

    const setPage = useCallback(
        (pageNum) =>
            setPaging({
                page: pageNum,
            }),
        []
    )

    const setPageSize = useCallback(
        (pageSizeNum) =>
            setPaging({
                pageSize: pageSizeNum,
                page: FIRST_PAGE,
            }),
        []
    )

    const { isDisconnected: offline } = useDhis2ConnectionStatus()

    const { fetching, error, data } = useAnalyticsData({
        filters,
        visualization,
        isVisualizationLoading,
        displayProperty,
        onResponsesReceived,
        pageSize,
        // Set first page directly for new visualization to avoid extra analytics requests
        page: visualization !== visualizationRef.current ? FIRST_PAGE : page,
        sortField,
        sortDirection,
    })

    const fetchIndicatorTop = useMemo(() => {
        if (
            !fetching ||
            !fetchContainerRef?.current ||
            !dataTableHeadRef?.current ||
            !dataTableFootRef?.current
        ) {
            return 'calc(50% - 12px)'
        }

        const containerHeight = fetchContainerRef.current.clientHeight
        const headHeight = dataTableHeadRef.current.offsetHeight
        const footHeight = dataTableFootRef.current.offsetHeight
        // tbody height excluding the parts hidden by scrolling
        const visibleBodyHeight = containerHeight - headHeight - footHeight
        // 12 px is half the loader height
        const top = Math.round(headHeight + visibleBodyHeight / 2 - 12)

        return `${top}px`
    }, [fetching])

    // Reset page when a different visualization is loaded
    useEffect(() => {
        visualizationRef.current = visualization

        setPage(FIRST_PAGE)
    }, [visualization, setPage])

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
            if (relevantLegendSets.length) {
                setUniqueLegendSets(relevantLegendSets)
            } else {
                setUniqueLegendSets([])
            }
            setShowLegendKey(visualization.legend?.showKey)
        } else {
            setUniqueLegendSets([])
            setShowLegendKey(false)
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

    const sortData = ({ name, direction }) => {
        // this causes a re-render of the whole component
        // which resets also the pagination as there is no previous internal state
        onDataSorted({
            dimension: name,
            direction,
        })
    }

    const formatCellValue = (value, header) => {
        if (header?.valueType === VALUE_TYPE_URL) {
            return (
                <a href={value} target="_blank" rel="noreferrer">
                    {value}
                </a>
            )
        } else {
            return getFormattedCellValue({ value, header, visualization })
        }
    }

    const cellValueShouldNotWrap = (header) =>
        [
            VALUE_TYPE_NUMBER,
            VALUE_TYPE_INTEGER,
            VALUE_TYPE_INTEGER_POSITIVE,
            VALUE_TYPE_INTEGER_NEGATIVE,
            VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
            VALUE_TYPE_PERCENTAGE,
            VALUE_TYPE_UNIT_INTERVAL,
            VALUE_TYPE_TIME,
            VALUE_TYPE_DATE,
            VALUE_TYPE_DATETIME,
            VALUE_TYPE_PHONE_NUMBER,
        ].includes(header.valueType) && !header.optionSet

    const formatCellHeader = (header) => {
        const headerText = getHeaderText(header)

        const headerName = Number.isInteger(header.stageOffset)
            ? header.name.replace(/\[-?\d+\]/, '')
            : header.name

        return (
            <span
                className={cx(styles.headerCell, styles.dimensionModalHandler)}
                onClick={
                    onColumnHeaderClick
                        ? () =>
                              onColumnHeaderClick(
                                  getDimensionIdFromHeaderName(
                                      headerName,
                                      visualization
                                  ) || headerName
                              )
                        : undefined
                }
            >
                {headerText}
            </span>
        )
    }

    const getLegendKey = () =>
        forDashboard ? (
            <div className={styles.legendKeyContainer} ref={legendKeyRef}>
                <div className={styles.legendKeyToggle}>
                    <Button
                        small
                        secondary
                        onClick={() => {
                            setShowLegendKey(!showLegendKey)
                            window.requestAnimationFrame(onResize)
                        }}
                        icon={<IconLegend24 />}
                        toggled={showLegendKey}
                    />
                </div>
                {showLegendKey && (
                    <div
                        className={styles.legendKeyWrapper}
                        data-test="visualization-legend-key"
                    >
                        <div className={styles.wrapper}>
                            <LegendKey legendSets={uniqueLegendSets} />
                        </div>
                    </div>
                )}
            </div>
        ) : (
            showLegendKey && (
                <div
                    className={styles.legendKeyScrollbox}
                    data-test="visualization-legend-key"
                    ref={legendKeyRef}
                >
                    <LegendKey legendSets={uniqueLegendSets} />
                </div>
            )
        )

    const renderCellContent = ({ columnIndex, value, isUndefined, props }) => (
        <DataTableCell
            {...props}
            key={columnIndex}
            className={cx(
                styles.cell,
                fontSizeClass,
                sizeClass,
                {
                    [styles.emptyCell]: !value,
                    [styles.nowrap]: cellValueShouldNotWrap(
                        data.headers[columnIndex]
                    ),
                    [styles.undefinedCell]: isUndefined,
                },
                'bordered'
            )}
            backgroundColor={
                visualization.legend?.style === LEGEND_DISPLAY_STYLE_FILL
                    ? getColorByValueFromLegendSet(
                          data.headers[columnIndex].legendSet,
                          value
                      )
                    : undefined
            }
            dataTest="table-cell"
        >
            <div
                style={
                    visualization.legend?.style === LEGEND_DISPLAY_STYLE_TEXT
                        ? {
                              color: getColorByValueFromLegendSet(
                                  data.headers[columnIndex].legendSet,
                                  value
                              ),
                          }
                        : {}
                }
            >
                {formatCellValue(value, data.headers[columnIndex])}
            </div>
        </DataTableCell>
    )

    return (
        <div
            className={styles.pluginContainer}
            ref={mountAndObserveContainerRef}
        >
            <div
                data-test="line-list-fetch-container"
                className={cx(styles.fetchContainer, {
                    [styles.fetching]: fetching,
                })}
                ref={fetchContainerRef}
            >
                <div
                    className={styles.fetchIndicator}
                    style={{ top: fetchIndicatorTop }}
                    data-test={
                        fetching
                            ? 'line-list-table-fetching'
                            : 'line-list-table-idle'
                    }
                />
                <div
                    className={styles.visualizationContainer}
                    ref={observeVisualizationContainerRef}
                    style={{ maxWidth: measuredDimensions.containerMaxWidth }}
                >
                    {shouldShowTimeDimensionWarning && (
                        <div
                            className={styles.noTimeDimensionWarning}
                            ref={noTimeDimensionWarningRef}
                            style={{
                                maxWidth: measuredDimensions.noticeBoxMaxWidth,
                            }}
                        >
                            <NoticeBox warning>
                                {i18n.t(
                                    'This line list may show data that was not available when the interpretation was written.'
                                )}
                            </NoticeBox>
                        </div>
                    )}
                    <DataTable
                        scrollHeight={getDataTableScrollHeight(
                            isInModal,
                            noTimeDimensionWarningRef
                        )}
                        scrollWidth="100%"
                        width="auto"
                        className={cx(
                            styles.dataTable,
                            'push-analytics-linelist-table'
                        )}
                        dataTest="line-list-table"
                        ref={dataTableRef}
                    >
                        <DataTableHead ref={dataTableHeadRef}>
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
                                                offline
                                                    ? undefined
                                                    : header.name === sortField
                                                    ? sortDirection
                                                    : defaultSorting.direction
                                            }
                                            sortIconTitle={i18n.t(
                                                'Sort by "{{column}}" and update',
                                                {
                                                    column: getHeaderText(
                                                        header
                                                    ),
                                                }
                                            )}
                                            className={cx(
                                                styles.headerCell,
                                                fontSizeClass,
                                                sizeClass,
                                                'bordered'
                                            )}
                                            dataTest="table-header"
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
                                            dataTest="table-header"
                                        />
                                    )
                                )}
                            </DataTableRow>
                        </DataTableHead>
                        {/* https://jira.dhis2.org/browse/LIBS-278 */}
                        <DataTableBody dataTest="table-body">
                            {data.rows.map((row, rowIndex) => (
                                <DataTableRow
                                    key={rowIndex}
                                    dataTest="table-row"
                                >
                                    {row.map((value, columnIndex) =>
                                        cellIsUndefined(
                                            data.rowContext,
                                            rowIndex,
                                            columnIndex
                                        ) ? (
                                            <Tooltip
                                                content={i18n.t('No event')}
                                                key={`${rowIndex}_${columnIndex}-tooltip`}
                                            >
                                                {(props) =>
                                                    renderCellContent({
                                                        columnIndex,
                                                        value,
                                                        isUndefined: true,
                                                        props,
                                                    })
                                                }
                                            </Tooltip>
                                        ) : (
                                            renderCellContent({
                                                columnIndex,
                                                value,
                                            })
                                        )
                                    )}
                                </DataTableRow>
                            ))}
                        </DataTableBody>
                        <DataTableFoot
                            className={styles.stickyFooter}
                            ref={dataTableFootRef}
                        >
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
                                        style={{
                                            maxWidth:
                                                measuredDimensions.paginationMaxWidth,
                                        }}
                                    >
                                        <PaginationComponent
                                            offline={offline}
                                            disabled={offline || fetching}
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
            </div>
            {Boolean(uniqueLegendSets.length) && getLegendKey()}
        </div>
    )
}

Visualization.propTypes = {
    displayProperty: PropTypes.string.isRequired,
    isVisualizationLoading: PropTypes.bool.isRequired,
    visualization: PropTypes.object.isRequired,
    onResponsesReceived: PropTypes.func.isRequired,
    filters: PropTypes.object,
    forDashboard: PropTypes.bool,
    onColumnHeaderClick: PropTypes.func,
    onDataSorted: PropTypes.func,
    onError: PropTypes.func,
}
