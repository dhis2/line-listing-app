import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import {
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_ID_ORGUNIT,
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

const EnrollmentDimensionsPanel = ({ program, searchTerm }) => {
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

    // Filter dimensions based on search term
    const filteredEnrollmentDimensions = useMemo(() => {
        if (!searchTerm) return enrollmentDimensions
        return enrollmentDimensions.filter((dimension) =>
            dimension.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [enrollmentDimensions, searchTerm])

    // Add draggableId to dimensions
    const draggableEnrollmentDimensions = filteredEnrollmentDimensions.map(
        (dimension) => ({
            draggableId: `enrollment-${dimension.id}`,
            ...dimension,
        })
    )

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    return (
        <>
            {/* Enrollment org unit, periods, and status */}
            {filteredEnrollmentDimensions.length > 0 && (
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
            {attributeDimensions && attributeDimensions.length > 0 && (
                <ProgramDataDimensionsList
                    dimensions={attributeDimensions}
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
}

export { EnrollmentDimensionsPanel }
