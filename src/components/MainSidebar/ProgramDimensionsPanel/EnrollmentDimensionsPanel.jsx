import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import {
    DIMENSION_ID_ORGUNIT,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
} from '@dhis2/analytics'
import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_PROGRAM_STATUS,
} from '../../../modules/dimensionConstants.js'
import { formatDimensionId } from '../../../modules/dimensionId.js'
import { CARD_TYPE_TRACKED_ENTITY } from '../../../modules/paginationConfig.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { useDebounce } from '../../../modules/utils.js'
import { usePaginationConfig } from '../../PaginationConfigContext.jsx'
import { DimensionsList } from '../DimensionsList/index.js'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from './useProgramDataDimensions.js'

// Type filter constants (must match MainSidebar)
const TYPE_FILTER_ORG_UNITS = 'ORG_UNITS'
const TYPE_FILTER_PERIODS = 'PERIODS'
const TYPE_FILTER_STATUSES = 'STATUSES'
const TYPE_FILTER_PROGRAM_ATTRIBUTES = 'PROGRAM_ATTRIBUTES'

// Helper function to check if a dimension matches the type filter
const matchesTypeFilter = (dimension, typeFilter) => {
    // If no filter selected, show all
    if (!typeFilter) return true

    const dimensionType = dimension.dimensionType

    switch (typeFilter) {
        case TYPE_FILTER_ORG_UNITS:
            return dimensionType === 'ORGANISATION_UNIT'
        case TYPE_FILTER_PERIODS:
            return dimensionType === 'PERIOD'
        case TYPE_FILTER_STATUSES:
            return dimensionType === 'STATUS'
        case TYPE_FILTER_PROGRAM_ATTRIBUTES:
            return dimensionType === DIMENSION_TYPE_PROGRAM_ATTRIBUTE
        default:
            return true
    }
}

const EnrollmentDimensionsPanel = ({
    program,
    searchTerm,
    typeFilter = null,
}) => {
    const debouncedSearchTerm = useDebounce(searchTerm || '')
    const { getPageSize } = usePaginationConfig()
    const pageSize = getPageSize(CARD_TYPE_TRACKED_ENTITY)

    // Get enrollment-specific dimensions from metadata
    const enrollmentOrgUnitId = program?.id
        ? formatDimensionId({
              dimensionId: DIMENSION_ID_ORGUNIT,
              programId: program.id,
              outputType: OUTPUT_TYPE_ENROLLMENT,
          })
        : null
    const enrollmentDateId = program?.id
        ? formatDimensionId({
              dimensionId: DIMENSION_ID_ENROLLMENT_DATE,
              programId: program.id,
              outputType: OUTPUT_TYPE_ENROLLMENT,
          })
        : null
    const incidentDateId = program?.id
        ? formatDimensionId({
              dimensionId: DIMENSION_ID_INCIDENT_DATE,
              programId: program.id,
              outputType: OUTPUT_TYPE_ENROLLMENT,
          })
        : null
    const programStatusId = program?.id
        ? formatDimensionId({
              dimensionId: DIMENSION_ID_PROGRAM_STATUS,
              programId: program.id,
              outputType: OUTPUT_TYPE_ENROLLMENT,
          })
        : null

    const enrollmentOrgUnit = useSelector((state) =>
        sGetMetadataById(state, enrollmentOrgUnitId)
    )
    const enrollmentDate = useSelector((state) =>
        sGetMetadataById(state, enrollmentDateId)
    )
    const incidentDate = useSelector((state) =>
        sGetMetadataById(state, incidentDateId)
    )
    const programStatus = useSelector((state) =>
        sGetMetadataById(state, programStatusId)
    )

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

    // Build enrollment-specific dimensions list (org unit, periods, status)
    const enrollmentDimensions = useMemo(() => {
        const dims = []
        if (enrollmentOrgUnit) dims.push(enrollmentOrgUnit)
        if (enrollmentDate) dims.push(enrollmentDate)
        if (incidentDate && program.displayIncidentDate !== false) {
            dims.push(incidentDate)
        }
        if (programStatus) dims.push(programStatus)
        return dims
    }, [
        enrollmentOrgUnit,
        enrollmentDate,
        incidentDate,
        programStatus,
        program,
    ])

    // Filter enrollment dimensions based on search term and type filter
    const filteredEnrollmentDimensions = useMemo(() => {
        let filtered = enrollmentDimensions

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
    }, [enrollmentDimensions, searchTerm, typeFilter])

    // Add draggableId to enrollment dimensions
    const draggableEnrollmentDimensions = filteredEnrollmentDimensions.map(
        (dimension) => ({
            draggableId: `enrollment-${dimension.id}`,
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

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    // Check what dimensions are available
    const hasEnrollmentDimensions = filteredEnrollmentDimensions.length > 0
    const hasAttributeDimensions = filteredAttributeDimensions.length > 0

    // Don't render if no dimensions match the filter
    if (!hasEnrollmentDimensions && !hasAttributeDimensions) {
        return null
    }

    return (
        <>
            {/* Enrollment org unit, dates, and status */}
            {hasEnrollmentDimensions && (
                <DimensionsList
                    dimensions={draggableEnrollmentDimensions}
                    loading={false}
                    fetching={false}
                    error={null}
                    hasMore={false}
                    onLoadMore={() => {}}
                    dataTest="enrollment-dimensions-list"
                />
            )}

            {/* Program attributes (tracked entity attributes for this program) */}
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

EnrollmentDimensionsPanel.propTypes = {
    program: PropTypes.object.isRequired,
    searchTerm: PropTypes.string,
    typeFilter: PropTypes.string,
}

export { EnrollmentDimensionsPanel }
