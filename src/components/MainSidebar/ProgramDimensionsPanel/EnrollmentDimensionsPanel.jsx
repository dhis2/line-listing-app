import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import {
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_PROGRAM_STATUS,
} from '../../../modules/dimensionConstants.js'
import { formatDimensionId } from '../../../modules/dimensionId.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { acAddMetadata } from '../../../actions/metadata.js'
import { DimensionsList } from '../DimensionsList/index.js'

// Type filter constants (must match MainSidebar)
const TYPE_FILTER_ORG_UNITS = 'ORG_UNITS'
const TYPE_FILTER_PERIODS = 'PERIODS'
const TYPE_FILTER_STATUSES = 'STATUSES'

// Helper function to check if a dimension matches the type filter
// EnrollmentDimensionsPanel contains: org unit, dates (periods), and status
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
        // EnrollmentDimensionsPanel doesn't contain program attributes, data elements,
        // program indicators, categories, or category option group sets
        default:
            return false
    }
}

const EnrollmentDimensionsPanel = ({
    program,
    searchTerm,
    typeFilter = null,
    onEmptyStateChange,
}) => {
    const dispatch = useDispatch()

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

    // Create and store mock enrollment dimensions in Redux metadata
    useEffect(() => {
        if (!program?.id) {
            return
        }

        const mockMetadata = {}

        // Create enrollment org unit dimension if it doesn't exist
        if (enrollmentOrgUnitId && !enrollmentOrgUnit) {
            mockMetadata[enrollmentOrgUnitId] = {
                id: enrollmentOrgUnitId,
                name: i18n.t('Enrollment org. unit'),
                dimensionType: 'ORGANISATION_UNIT',
            }
        }
        // Create enrollment date dimension if it doesn't exist
        if (enrollmentDateId && !enrollmentDate) {
            mockMetadata[enrollmentDateId] = {
                id: enrollmentDateId,
                name:
                    program.displayEnrollmentDateLabel ||
                    i18n.t('Enrollment date'),
                dimensionType: 'PERIOD',
            }
        }
        // Create incident date dimension if it doesn't exist
        if (incidentDateId && !incidentDate && program.displayIncidentDate !== false) {
            mockMetadata[incidentDateId] = {
                id: incidentDateId,
                name:
                    program.displayIncidentDateLabel ||
                    i18n.t('Incident date'),
                dimensionType: 'PERIOD',
            }
        }
        // Create program status dimension if it doesn't exist
        if (programStatusId && !programStatus) {
            mockMetadata[programStatusId] = {
                id: programStatusId,
                name: i18n.t('Enrollment status'),
                dimensionType: 'STATUS',
            }
        }

        if (Object.keys(mockMetadata).length > 0) {
            dispatch(acAddMetadata(mockMetadata))
        }
    }, [
        dispatch,
        program?.id,
        program?.displayEnrollmentDateLabel,
        program?.displayIncidentDateLabel,
        program?.displayIncidentDate,
        enrollmentOrgUnitId,
        enrollmentOrgUnit,
        enrollmentDateId,
        enrollmentDate,
        incidentDateId,
        incidentDate,
        programStatusId,
        programStatus,
    ])

    // Build enrollment-specific dimensions list (org unit, periods, status)
    const enrollmentDimensions = useMemo(() => {
        const dims = []
        if (enrollmentOrgUnit) {
            dims.push({
                ...enrollmentOrgUnit,
                name: i18n.t('Enrollment org. unit'),
            })
        }
        if (enrollmentDate) dims.push(enrollmentDate)
        if (incidentDate && program.displayIncidentDate !== false) {
            dims.push(incidentDate)
        }
        if (programStatus) {
            dims.push({
                ...programStatus,
                name: i18n.t('Enrollment status'),
            })
        }
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

    // Check what dimensions are available
    const hasEnrollmentDimensions = filteredEnrollmentDimensions.length > 0

    // Check if empty and notify parent
    const isEmpty = !hasEnrollmentDimensions
    React.useEffect(() => {
        if (onEmptyStateChange) {
            onEmptyStateChange(isEmpty)
        }
    }, [isEmpty, onEmptyStateChange])

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    return (
        <DimensionsList
            dimensions={draggableEnrollmentDimensions}
            loading={false}
            fetching={false}
            error={null}
            hasMore={false}
            onLoadMore={() => {}}
            dataTest="enrollment-dimensions-list"
        />
    )
}

EnrollmentDimensionsPanel.propTypes = {
    program: PropTypes.object.isRequired,
    onEmptyStateChange: PropTypes.func,
    searchTerm: PropTypes.string,
    typeFilter: PropTypes.string,
}

export { EnrollmentDimensionsPanel }
