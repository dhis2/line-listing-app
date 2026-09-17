import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Box,
    Button,
    CircularLoader,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
    Input,
    Modal,
    ModalContent,
    ModalTitle,
    NoticeBox,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from 'react'
import history from '../../modules/history.js'
import styles from './styles/OpenVisualizationDialog.module.css'

const CREATED_BY_ALL = 'ALL'
const CREATED_BY_CURRENT_USER = 'CURRENT_USER'
const CREATED_BY_ALL_BUT_CURRENT_USER = 'ALL_BUT_CURRENT_USER'

const getQuery = () => ({
    files: {
        resource: 'eventVisualizations',
        params: ({
            sortField = 'displayName',
            sortDirection = 'iasc',
            page = 1,
            filters,
        }) => {
            const queryParams = {
                filter: filters,
                fields: `id,type,displayName,title,displayDescription,created,lastUpdated,user,access,href`,
                paging: true,
                pageSize: 8,
                page,
            }
            if (sortDirection !== 'default') {
                queryParams.order = `${sortField}:${sortDirection}`
            }
            return queryParams
        },
    },
})

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

const OpenVisualizationDialog = ({ open, onClose, currentUser }) => {
    const filesQuery = useMemo(() => getQuery(), [])
    const defaultFilters = {
        searchTerm: '',
        createdBy: CREATED_BY_ALL,
    }

    const [{ page, sortField, sortDirection, filters }, setState] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            page: 1,
            sortField: 'displayName',
            sortDirection: 'asc',
            filters: defaultFilters,
        }
    )

    const [nameFilterValue, setNameFilterValue] = useState(
        defaultFilters.searchTerm
    )
    const [searchTimeout, setSearchTimeout] = useState(null)

    const formatFilters = useCallback(() => {
        const queryFilters = []

        switch (filters.createdBy) {
            case CREATED_BY_ALL_BUT_CURRENT_USER:
                queryFilters.push(`user.id:!eq:${currentUser.id}`)
                break
            case CREATED_BY_CURRENT_USER:
                queryFilters.push(`user.id:eq:${currentUser.id}`)
                break
            case CREATED_BY_ALL:
            default:
                break
        }

        if (filters.searchTerm) {
            queryFilters.push(`identifiable:token:${filters.searchTerm}`)
        }

        return queryFilters
    }, [currentUser, filters])

    const formatSortDirection = useCallback(() => {
        if (sortField === 'displayName' && sortDirection !== 'default') {
            return `i${sortDirection}`
        }
        return sortDirection
    }, [sortField, sortDirection])

    const { loading, error, data, refetch } = useDataQuery(filesQuery, {
        lazy: true,
        onComplete: (response) => {
            if (page !== response.files.pager.page) {
                setPage(response.files.pager.page)
            }
        },
    })

    const setPage = (pageNum) => setState({ page: pageNum })

    const sortData = ({ name, direction }) =>
        setState({
            sortField: name,
            sortDirection: direction,
            page: 1,
        })

    useEffect(() => {
        if (open) {
            refetch({
                page,
                sortField,
                sortDirection: formatSortDirection(),
                filters: formatFilters(),
            })
        }
    }, [
        open,
        page,
        sortField,
        filters,
        refetch,
        formatFilters,
        formatSortDirection,
    ])

    const headers = [
        { field: 'displayName', label: i18n.t('Name'), width: '470px' },
        { field: 'created', label: i18n.t('Created'), width: '110px' },
        { field: 'lastUpdated', label: i18n.t('Last updated'), width: '110px' },
    ]

    const getSortDirection = (fieldName) =>
        fieldName === sortField ? sortDirection : 'default'

    const onFileSelect = (id) => {
        onClose()
        const path = `/${id}`
        if (history.location.pathname === path) {
            history.replace({ pathname: path }, { isOpening: true })
        } else {
            history.push(path)
        }
    }

    const resetFilters = () => {
        setState({
            filters: defaultFilters,
            page: 1,
        })
        setNameFilterValue(defaultFilters.searchTerm)
    }

    const hasFiltersApplied =
        filters.createdBy !== CREATED_BY_ALL || filters.searchTerm !== ''

    const cypressSelector = 'open-file-dialog-modal'

    if (!open) {
        return null
    }

    return (
        <Modal
            large
            position="top"
            onClose={onClose}
            dataTest={cypressSelector}
        >
            <ModalTitle>{i18n.t('Open a visualization')}</ModalTitle>
            <ModalContent>
                <Box minHeight="496px">
                    <div className={styles.searchAndFilterBar}>
                        <div className={styles.searchFieldContainer}>
                            <Input
                                dense
                                placeholder={i18n.t('Search by name')}
                                value={nameFilterValue}
                                onChange={({ value }) => {
                                    setNameFilterValue(value)
                                    clearTimeout(searchTimeout)
                                    setSearchTimeout(
                                        setTimeout(
                                            () =>
                                                setState({
                                                    page: 1,
                                                    filters: {
                                                        ...filters,
                                                        searchTerm: value,
                                                    },
                                                }),
                                            200
                                        )
                                    )
                                }}
                                dataTest={`${cypressSelector}-name-filter`}
                            />
                        </div>
                        <div className={styles.createdByFieldContainer}>
                            <SingleSelect
                                dense
                                selected={filters.createdBy}
                                onChange={({ selected }) =>
                                    setState({
                                        page: 1,
                                        filters: {
                                            ...filters,
                                            createdBy: selected,
                                        },
                                    })
                                }
                            >
                                <SingleSelectOption
                                    value={CREATED_BY_ALL}
                                    label={i18n.t('All')}
                                />
                                <SingleSelectOption
                                    value={CREATED_BY_CURRENT_USER}
                                    label={i18n.t('Created by me')}
                                />
                                <SingleSelectOption
                                    value={CREATED_BY_ALL_BUT_CURRENT_USER}
                                    label={i18n.t('Created by others')}
                                />
                            </SingleSelect>
                        </div>
                        {hasFiltersApplied && (
                            <Button onClick={resetFilters} secondary small>
                                {i18n.t('Clear filters')}
                            </Button>
                        )}
                    </div>

                    {error ? (
                        <NoticeBox
                            title={i18n.t('Could not load visualizations')}
                            warning
                        >
                            {i18n.t(
                                'There was a problem loading visualizations. Check your network connection and try again.'
                            )}
                        </NoticeBox>
                    ) : (
                        <>
                            <div className={styles.dataTableWrapper}>
                                <DataTable layout="fixed">
                                    <DataTableHead>
                                        <DataTableRow>
                                            {data?.files?.eventVisualizations
                                                ?.length ? (
                                                headers.map(
                                                    ({
                                                        field,
                                                        label,
                                                        width,
                                                    }) => (
                                                        <DataTableColumnHeader
                                                            width={width}
                                                            key={field}
                                                            name={field}
                                                            onSortIconClick={
                                                                sortData
                                                            }
                                                            sortDirection={getSortDirection(
                                                                field
                                                            )}
                                                        >
                                                            {label}
                                                        </DataTableColumnHeader>
                                                    )
                                                )
                                            ) : (
                                                <DataTableColumnHeader />
                                            )}
                                        </DataTableRow>
                                    </DataTableHead>
                                    <DataTableBody
                                        className={styles.dataTableBody}
                                    >
                                        {loading && (
                                            <DataTableRow>
                                                <DataTableCell large>
                                                    <Box height="342px">
                                                        <div
                                                            className={
                                                                styles.infoCell
                                                            }
                                                        >
                                                            <CircularLoader
                                                                small
                                                            />
                                                            <span
                                                                className={
                                                                    styles.infoText
                                                                }
                                                            >
                                                                {i18n.t(
                                                                    'Loading visualizations...'
                                                                )}
                                                            </span>
                                                        </div>
                                                    </Box>
                                                </DataTableCell>
                                            </DataTableRow>
                                        )}

                                        {!loading &&
                                            !(
                                                data?.files?.eventVisualizations
                                                    ?.length > 0
                                            ) && (
                                                <DataTableRow>
                                                    <DataTableCell large>
                                                        <Box minHeight="342px">
                                                            <div
                                                                className={
                                                                    styles.infoCell
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        styles.infoContainer
                                                                    }
                                                                >
                                                                    {hasFiltersApplied ? (
                                                                        <span
                                                                            className={
                                                                                styles.infoText
                                                                            }
                                                                        >
                                                                            {i18n.t(
                                                                                'No visualizations found matching the filter criteria'
                                                                            )}
                                                                        </span>
                                                                    ) : (
                                                                        <>
                                                                            <div
                                                                                className={
                                                                                    styles.infoText
                                                                                }
                                                                            >
                                                                                {i18n.t(
                                                                                    'No visualizations found'
                                                                                )}
                                                                            </div>
                                                                            <div
                                                                                className={
                                                                                    styles.infoButton
                                                                                }
                                                                            >
                                                                                <Button
                                                                                    onClick={() => {
                                                                                        onClose()
                                                                                        history.push(
                                                                                            '/'
                                                                                        )
                                                                                    }}
                                                                                >
                                                                                    {i18n.t(
                                                                                        'New visualization'
                                                                                    )}
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Box>
                                                    </DataTableCell>
                                                </DataTableRow>
                                            )}

                                        {data?.files?.eventVisualizations
                                            ?.length > 0 &&
                                            data.files.eventVisualizations.map(
                                                (visualization) => (
                                                    <DataTableRow
                                                        key={visualization.id}
                                                    >
                                                        <DataTableCell
                                                            onClick={() =>
                                                                onFileSelect(
                                                                    visualization.id
                                                                )
                                                            }
                                                        >
                                                            {
                                                                visualization.displayName
                                                            }
                                                        </DataTableCell>
                                                        <DataTableCell>
                                                            {formatDate(
                                                                visualization.created
                                                            )}
                                                        </DataTableCell>
                                                        <DataTableCell>
                                                            {formatDate(
                                                                visualization.lastUpdated
                                                            )}
                                                        </DataTableCell>
                                                    </DataTableRow>
                                                )
                                            )}
                                    </DataTableBody>
                                </DataTable>
                            </div>

                            {data?.files?.eventVisualizations?.length > 0 && (
                                <div className={styles.paginationControls}>
                                    <Button
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                        small
                                    >
                                        {i18n.t('Previous')}
                                    </Button>
                                    <span className={styles.pageInfo}>
                                        {i18n.t(
                                            'Page {{page}} of {{totalPages}}',
                                            {
                                                page: data.files.pager.page,
                                                totalPages:
                                                    data.files.pager.pageCount,
                                            }
                                        )}
                                    </span>
                                    <Button
                                        disabled={
                                            page >= data.files.pager.pageCount
                                        }
                                        onClick={() => setPage(page + 1)}
                                        small
                                    >
                                        {i18n.t('Next')}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </Box>
            </ModalContent>
        </Modal>
    )
}

OpenVisualizationDialog.propTypes = {
    currentUser: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default OpenVisualizationDialog
