import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import {
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
} from '@dhis2/analytics'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
} from '../../../modules/visualization.js'
import { ProgramDataDimensionsList } from '../ProgramDimensionsPanel/ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from '../ProgramDimensionsPanel/useProgramDataDimensions.js'
import { useDebounce } from '../../../modules/utils.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../../modules/programTypes.js'

/**
 * DataPanel displays all data dimensions including:
 * - Program attributes (enrollment)
 * - Data elements (from all stages)
 * - Program indicators
 */
const DataPanel = ({ program, searchTerm }) => {
    const debouncedSearchTerm = useDebounce(searchTerm || '')

    const isProgramWithRegistration =
        program?.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
        program?.programStages &&
        program.programStages.length > 0

    // Get program attributes (enrollment data)
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
    })

    // Get data elements from all stages combined
    const {
        dimensions: dataElementDimensions,
        loading: dataElementsLoading,
        fetching: dataElementsFetching,
        error: dataElementsError,
        hasMore: dataElementsHasMore,
        loadMore: dataElementsLoadMore,
    } = useProgramDataDimensions({
        inputType: OUTPUT_TYPE_EVENT,
        program,
        searchTerm: debouncedSearchTerm,
        dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
        // Don't specify stageId to get all data elements from all stages
    })

    // Get program indicators
    const {
        dimensions: programIndicators,
        loading: indicatorsLoading,
        fetching: indicatorsFetching,
        error: indicatorsError,
        hasMore: indicatorsHasMore,
        loadMore: indicatorsLoadMore,
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

    return (
        <>
            {/* Program attributes (enrollment data) */}
            {isProgramWithRegistration &&
                attributeDimensions &&
                attributeDimensions.length > 0 && (
                    <ProgramDataDimensionsList
                        dimensions={attributeDimensions}
                        loading={attributesLoading}
                        fetching={attributesFetching}
                        error={attributesError}
                        hasMore={attributesHasMore}
                        onLoadMore={attributesLoadMore}
                        program={program}
                        searchTerm={debouncedSearchTerm}
                        dataTest="enrollment-attributes-list"
                    />
                )}

            {/* Data elements (from all stages) */}
            {dataElementDimensions && dataElementDimensions.length > 0 && (
                <ProgramDataDimensionsList
                    dimensions={dataElementDimensions}
                    loading={dataElementsLoading}
                    fetching={dataElementsFetching}
                    error={dataElementsError}
                    hasMore={dataElementsHasMore}
                    onLoadMore={dataElementsLoadMore}
                    program={program}
                    searchTerm={debouncedSearchTerm}
                    dataTest="data-elements-list"
                />
            )}

            {/* Program indicators */}
            {isProgramWithRegistration &&
                programIndicators &&
                programIndicators.length > 0 && (
                    <ProgramDataDimensionsList
                        dimensions={programIndicators}
                        loading={indicatorsLoading}
                        fetching={indicatorsFetching}
                        error={indicatorsError}
                        hasMore={indicatorsHasMore}
                        onLoadMore={indicatorsLoadMore}
                        program={program}
                        searchTerm={debouncedSearchTerm}
                        dataTest="program-indicators-list"
                    />
                )}
        </>
    )
}

DataPanel.propTypes = {
    program: PropTypes.object.isRequired,
    searchTerm: PropTypes.string,
}

export { DataPanel }
