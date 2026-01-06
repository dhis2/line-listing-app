import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_PERIOD,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_ID_REGISTRATION_OU,
    DIMENSION_ID_REGISTRATION_DATE,
} from '../../../modules/dimensionConstants.js'
import { DimensionsList } from '../DimensionsList/index.js'

// Type filter constants (must match MainSidebar)
const TYPE_FILTER_ORG_UNITS = 'ORG_UNITS'
const TYPE_FILTER_PERIODS = 'PERIODS'

// Helper function to check if a dimension matches the type filter
const matchesTypeFilter = (dimension, typeFilter) => {
    // If no filter selected, show all
    if (!typeFilter) return true

    const dimensionType = dimension.dimensionType

    switch (typeFilter) {
        case TYPE_FILTER_ORG_UNITS:
            return dimensionType === DIMENSION_TYPE_ORGANISATION_UNIT
        case TYPE_FILTER_PERIODS:
            return dimensionType === DIMENSION_TYPE_PERIOD
        default:
            return true
    }
}

const PersonDimensionsPanel = ({
    program,
    searchTerm,
    typeFilter = null,
}) => {
    // Create fixed registration dimensions (only registration org unit and date)
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

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    // Don't render if no dimensions match the filter
    const hasRegistrationDimensions = filteredRegistrationDimensions.length > 0

    if (!hasRegistrationDimensions) {
        return null
    }

    return (
        <DimensionsList
            dimensions={draggableRegistrationDimensions}
            loading={false}
            fetching={false}
            error={null}
            hasMore={false}
            onLoadMore={() => {}}
            dataTest="person-registration-dimensions-list"
        />
    )
}

PersonDimensionsPanel.propTypes = {
    program: PropTypes.object.isRequired,
    searchTerm: PropTypes.string,
    typeFilter: PropTypes.string,
}

export { PersonDimensionsPanel }
