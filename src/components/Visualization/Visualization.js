import { formatValue } from '@dhis2/analytics'
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
    NoticeBox,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    DISPLAY_DENSITY_COMFORTABLE,
    DISPLAY_DENSITY_COMPACT,
    FONT_SIZE_LARGE,
    FONT_SIZE_NORMAL,
    FONT_SIZE_SMALL,
} from '../../modules/options.js'
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
    const maxWidth = useAvailableWidth()
    const [{ sortField, sortDirection }, setSorting] = useState({
        sortField: 'eventdate', // TODO get field name corresponding to visualization.sortOrder ?!
        sortDirection: 'desc',
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

    // if (error) {
    //     return (
    //         <div className={styles.error}>
    //             <NoticeBox error title={i18n.t('Could not load visualization')}>
    //                 {error?.message ||
    //                     i18n.t(
    //                         "The visualization couldn't be displayed. Try again or contact your system administrator."
    //                     )}
    //             </NoticeBox>
    //         </div>
    //     )
    // }

    if (!data) {
        return null
    }

    const large = visualization.displayDensity === DISPLAY_DENSITY_COMFORTABLE
    const small = visualization.displayDensity === DISPLAY_DENSITY_COMPACT
    const fontSizeClass = getFontSizeClass(visualization.fontSize)
    const colSpan = String(Math.max(data.headers.length, 1))

    return (
        <div className={styles.wrapper}>
            <div
                className={cx(styles.fetchIndicator, {
                    [styles.fetching]: fetching,
                })}
            >
                <DataTable
                    scrollHeight="500px"
                    width="auto"
                    scrollWidth={maxWidth}
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
                                        {formatValue(
                                            value,
                                            data.headers[index]?.valueType ||
                                                'TEXT',
                                            {
                                                digitGroupSeparator:
                                                    visualization.digitGroupSeparator,
                                                skipRounding: false, // TODO should there be an option for this?
                                            }
                                        )}
                                    </DataTableCell>
                                ))}
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                    <DataTableFoot className={styles.stickyFooter}>
                        <DataTableRow>
                            <DataTableCell colSpan={colSpan} staticStyle>
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
