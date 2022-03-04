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
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetLoadError } from '../../actions/loader.js'
import { acSetUiOpenDimensionModal } from '../../actions/ui.js'
import {
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
} from '../../modules/dimensionConstants.js'
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
    visualization,
    onResponseReceived,
    relativePeriodDate,
}) => {
    const dispatch = useDispatch()
    const metadata = useSelector(sGetMetadata)
    const isInModal = !!relativePeriodDate
    const { availableOuterWidth, availableInnerWidth } =
        useAvailableWidth(isInModal)
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

    const sizeClass = getSizeClass(visualization.displayDensity)
    const fontSizeClass = getFontSizeClass(visualization.fontSize)
    const colSpan = String(Math.max(data.headers.length, 1))

    const formatCellValue = (value, header) => {
        if (
            [
                headersMap[DIMENSION_ID_EVENT_STATUS],
                headersMap[DIMENSION_ID_PROGRAM_STATUS],
            ].includes(header?.name)
        ) {
            return metadata[value]?.name || value
        } else if (
            [
                DIMENSION_ID_EVENT_DATE,
                DIMENSION_ID_ENROLLMENT_DATE,
                DIMENSION_ID_INCIDENT_DATE,
            ]
                .map((header) => headersMap[header])
                .includes(header?.name)
        ) {
            return moment(value).format('yyyy-MM-DD')
        } else {
            return formatValue(value, header?.valueType || 'TEXT', {
                digitGroupSeparator: visualization.digitGroupSeparator,
                skipRounding: false, // TODO should there be an option for this?
            })
        }
    }

    const formatCellHeader = (header) => {
        let headerName = header.column
        let dimensionId = header.name

        const reverseLookupDimensionId = Object.keys(headersMap).find(
            (key) => headersMap[key] === header.name
        )

        if (header.stageOffset !== undefined) {
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
        } else if (reverseLookupDimensionId) {
            dimensionId = reverseLookupDimensionId
            headerName = metadata[dimensionId]?.name
        }

        return (
            <span
                className={cx(styles.headerCell, styles.dimensionModalHandler)}
                onClick={() => dispatch(acSetUiOpenDimensionModal(dimensionId))}
            >
                {headerName}
            </span>
        )
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
                    className={styles.dataTable}
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
                                        className={cx(
                                            styles.headerCell,
                                            fontSizeClass,
                                            sizeClass
                                        )}
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
                                        className={cx(
                                            styles.cell,
                                            fontSizeClass,
                                            sizeClass
                                        )}
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
                                    className={cx(
                                        styles.stickyNavigation,
                                        sizeClass
                                    )}
                                    style={{
                                        maxWidth: availableInnerWidth,
                                    }}
                                >
                                    <Pagination
                                        page={page}
                                        pageSize={pageSize}
                                        isLastPage={data.isLastPage}
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
