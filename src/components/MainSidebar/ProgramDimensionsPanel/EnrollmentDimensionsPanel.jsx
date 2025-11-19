import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import {
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
} from '@dhis2/analytics'
import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_PROGRAM_STATUS,
} from '../../../modules/dimensionConstants.js'
import { formatDimensionId } from '../../../modules/dimensionId.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from './useProgramDataDimensions.js'
import { useDebounce } from '../../../modules/utils.js'

// Type filter constants (must match MainSidebar)
const TYPE_FILTER_ALL = 'ALL'
const TYPE_FILTER_ORG_UNITS = 'ORG_UNITS'
const TYPE_FILTER_PERIODS = 'PERIODS'
const TYPE_FILTER_STATUSES = 'STATUSES'
const TYPE_FILTER_PROGRAM_ATTRIBUTES = 'PROGRAM_ATTRIBUTES'
const TYPE_FILTER_CATEGORIES = 'CATEGORIES'
const TYPE_FILTER_CATEGORY_OPTION_GROUP_SETS = 'CATEGORY_OPTION_GROUP_SETS'

// Helper function to check if a dimension matches the type filter
const matchesTypeFilter = (dimension, typeFilter) => {
    if (typeFilter === TYPE_FILTER_ALL) return true

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
        case TYPE_FILTER_CATEGORIES:
            return dimensionType === DIMENSION_TYPE_CATEGORY
        case TYPE_FILTER_CATEGORY_OPTION_GROUP_SETS:
            return dimensionType === DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET
        default:
            return true
    }
}

const EnrollmentDimensionsPanel = ({
    program,
    searchTerm,
    typeFilter = TYPE_FILTER_ALL,
}) => {
    const debouncedSearchTerm = useDebounce(searchTerm || '')

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

    // Get program attributes (data dimensions)
    const {
        dimensions: attributeDimensions,
        loading,
        fetching,
        error,
        hasMore,
        loadMore,
    } = useProgramDataDimensions({
        inputType: OUTPUT_TYPE_ENROLLMENT,
        program,
        searchTerm: debouncedSearchTerm,
        dimensionType: DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
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

    // Filter dimensions based on search term and type filter
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

    // Add draggableId to dimensions
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

    // Don't render if no dimensions match the filter
    const hasEnrollmentDimensions = filteredEnrollmentDimensions.length > 0
    const hasAttributeDimensions = filteredAttributeDimensions.length > 0

    if (!hasEnrollmentDimensions && !hasAttributeDimensions) {
        return null
    }

    return (
        <>
            {/* Enrollment org unit, periods, and status */}
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

            {/* Program attributes */}
            {hasAttributeDimensions && (
                <ProgramDataDimensionsList
                    dimensions={filteredAttributeDimensions}
                    loading={loading}
                    fetching={fetching}
                    error={error}
                    hasMore={hasMore}
                    onLoadMore={loadMore}
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
