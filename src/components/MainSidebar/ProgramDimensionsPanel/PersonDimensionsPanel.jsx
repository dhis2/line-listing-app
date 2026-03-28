import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_ID_REGISTRATION_OU,
    DIMENSION_ID_REGISTRATION_DATE,
} from '../../../modules/dimensionConstants.js'
import { CARD_TYPE_TRACKED_ENTITY } from '../../../modules/paginationConfig.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../../modules/visualization.js'
import { useDebounce } from '../../../modules/utils.js'
import { usePaginationConfig } from '../../PaginationConfigContext.jsx'
import { DimensionsList } from '../DimensionsList/index.js'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from './useProgramDataDimensions.js'

// Type filter constants (must match MainSidebar)
const TYPE_FILTER_ORG_UNITS = 'ORG_UNITS'
const TYPE_FILTER_PERIODS = 'PERIODS'
const TYPE_FILTER_PROGRAM_ATTRIBUTES = 'PROGRAM_ATTRIBUTES'

// Helper function to check if a dimension matches the type filter
// PersonDimensionsPanel contains: registration org unit, registration date, and tracked entity attributes
const matchesTypeFilter = (dimension, typeFilter) => {
    // If no filter selected, show all
    if (!typeFilter) return true

    const dimensionType = dimension.dimensionType

    switch (typeFilter) {
        case TYPE_FILTER_ORG_UNITS:
            return dimensionType === DIMENSION_TYPE_ORGANISATION_UNIT
        case TYPE_FILTER_PERIODS:
            return dimensionType === DIMENSION_TYPE_PERIOD
        case TYPE_FILTER_PROGRAM_ATTRIBUTES:
            return dimensionType === DIMENSION_TYPE_PROGRAM_ATTRIBUTE
        // PersonDimensionsPanel doesn't contain statuses, data elements,
        // program indicators, categories, or category option group sets
        default:
            return false
    }
}

const PersonDimensionsPanel = ({
    program,
    searchTerm,
    typeFilter = null,
    onEmptyStateChange,
}) => {
    const debouncedSearchTerm = useDebounce(searchTerm || '')
    const { getPageSize } = usePaginationConfig()
    const pageSize = getPageSize(CARD_TYPE_TRACKED_ENTITY)

    // Get program attributes (tracked entity attributes for this program)
    const {
        dimensions: attributeDimensions,
        loading: attributesLoading,
        fetching: attributesFetching,
        error: attributesError,
        hasMore: attributesHasMore,
        loadMore: attributesLoadMore,
    } = useProgramDataDimensions({
        inputType: OUTPUT_TYPE_ENROLLMENT,
        program,
        searchTerm: debouncedSearchTerm,
        dimensionType: DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
        pageSize,
    })

    // Create fixed registration dimensions (registration org unit and date)
    const registrationDimensions = useMemo(() => {
        return [
            {
                id: DIMENSION_ID_REGISTRATION_OU,
                name: i18n.t('Registration org. unit'),
                dimensionType: DIMENSION_TYPE_ORGANISATION_UNIT,
            },
            {
                id: DIMENSION_ID_REGISTRATION_DATE,
                name: i18n.t('Registration date'),
                dimensionType: DIMENSION_TYPE_PERIOD,
            },
        ]
    }, [])

    // Filter registration dimensions based on search term and type filter
    const filteredRegistrationDimensions = useMemo(() => {
        let filtered = registrationDimensions

        // Apply search term filter
        if (searchTerm) {
            filtered = filtered.filter((dimension) =>
                dimension.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply type filter
        filtered = filtered.filter((dimension) =>
            matchesTypeFilter(dimension, typeFilter)
        )

        return filtered
    }, [registrationDimensions, searchTerm, typeFilter])

    // Add draggableId to registration dimensions
    const draggableRegistrationDimensions = filteredRegistrationDimensions.map(
        (dimension) => ({
            draggableId: `person-${dimension.id}`,
            ...dimension,
        })
    )

    // Filter program attributes based on type filter
    const filteredAttributeDimensions = useMemo(() => {
        if (!attributeDimensions) return []
        return attributeDimensions.filter((dimension) =>
            matchesTypeFilter(dimension, typeFilter)
        )
    }, [attributeDimensions, typeFilter])

    // Check what dimensions are available
    const hasRegistrationDimensions = filteredRegistrationDimensions.length > 0
    const hasAttributeDimensions = filteredAttributeDimensions.length > 0

    // Check if empty and notify parent
    const isEmpty =
        !attributesLoading &&
        !attributesFetching &&
        !hasRegistrationDimensions &&
        !hasAttributeDimensions
    React.useEffect(() => {
        if (onEmptyStateChange) {
            onEmptyStateChange(isEmpty)
        }
    }, [isEmpty, onEmptyStateChange])

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    // If no dimensions match the filter, show empty state
    if (!hasRegistrationDimensions && !hasAttributeDimensions) {
        return (
            <DimensionsList
                dimensions={[]}
                loading={attributesLoading}
                fetching={attributesFetching}
                error={null}
                hasMore={false}
                onLoadMore={() => {}}
                dataTest="person-registration-dimensions-list"
            />
        )
    }

    return (
        <>
            {/* Registration org unit and date */}
            {hasRegistrationDimensions && (
                <DimensionsList
                    dimensions={draggableRegistrationDimensions}
                    loading={false}
                    fetching={false}
                    error={null}
                    hasMore={false}
                    onLoadMore={() => {}}
                    dataTest="person-registration-dimensions-list"
                />
            )}

            {/* Tracked entity attributes (program attributes) */}
            {hasAttributeDimensions && (
                <ProgramDataDimensionsList
                    dimensions={filteredAttributeDimensions}
                    loading={attributesLoading}
                    fetching={attributesFetching}
                    error={attributesError}
                    hasMore={attributesHasMore}
                    onLoadMore={attributesLoadMore}
                    program={program}
                    searchTerm={debouncedSearchTerm}
                />
            )}
        </>
    )
}

PersonDimensionsPanel.propTypes = {
    program: PropTypes.object.isRequired,
    onEmptyStateChange: PropTypes.func,
    searchTerm: PropTypes.string,
    typeFilter: PropTypes.string,
}

export { PersonDimensionsPanel }
