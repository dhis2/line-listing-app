import { DIMENSION_TYPE_PROGRAM_INDICATOR } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { useDebounce } from '../../../modules/utils.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../../modules/visualization.js'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from './useProgramDataDimensions.js'

const ProgramIndicatorsPanel = ({ program, searchTerm }) => {
    const debouncedSearchTerm = useDebounce(searchTerm || '')

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
    })

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    // Don't render if no indicators
    if (!indicatorDimensions || indicatorDimensions.length === 0) {
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
}

export { ProgramIndicatorsPanel }
