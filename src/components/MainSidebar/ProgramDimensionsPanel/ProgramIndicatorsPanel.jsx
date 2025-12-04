import { DIMENSION_TYPE_PROGRAM_INDICATOR } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { CARD_TYPE_PROGRAM_INDICATORS } from '../../../modules/paginationConfig.js'
import { useDebounce } from '../../../modules/utils.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../../modules/visualization.js'
import { usePaginationConfig } from '../../PaginationConfigContext.jsx'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from './useProgramDataDimensions.js'

// Type filter constants (must match MainSidebar)
const TYPE_FILTER_ALL = 'ALL'
const TYPE_FILTER_PROGRAM_INDICATORS = 'PROGRAM_INDICATORS'

const ProgramIndicatorsPanel = ({
    program,
    searchTerm,
    typeFilter = TYPE_FILTER_ALL,
}) => {
    const debouncedSearchTerm = useDebounce(searchTerm || '')
    const { getPageSize } = usePaginationConfig()
    const pageSize = getPageSize(CARD_TYPE_PROGRAM_INDICATORS)

    // Get program indicators (data dimensions)
    const {
        dimensions: indicatorDimensions,
        loading,
        fetching,
        error,
        hasMore,
        loadMore,
    } = useProgramDataDimensions({
        inputType: OUTPUT_TYPE_ENROLLMENT,
        program,
        searchTerm: debouncedSearchTerm,
        dimensionType: DIMENSION_TYPE_PROGRAM_INDICATOR,
        pageSize,
    })

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    // Don't render if no indicators
    if (!indicatorDimensions || indicatorDimensions.length === 0) {
        return null
    }

    // Don't render if type filter doesn't match program indicators
    if (
        typeFilter !== TYPE_FILTER_ALL &&
        typeFilter !== TYPE_FILTER_PROGRAM_INDICATORS
    ) {
        return null
    }

    return (
        <ProgramDataDimensionsList
            dimensions={indicatorDimensions}
            loading={loading}
            fetching={fetching}
            error={error}
            hasMore={hasMore}
            onLoadMore={loadMore}
            program={program}
            searchTerm={debouncedSearchTerm}
        />
    )
}

ProgramIndicatorsPanel.propTypes = {
    program: PropTypes.object.isRequired,
    searchTerm: PropTypes.string,
    typeFilter: PropTypes.string,
}

export { ProgramIndicatorsPanel }
