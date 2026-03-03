import { DIMENSION_TYPE_PROGRAM_INDICATOR, VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { CARD_TYPE_PROGRAM_INDICATORS } from '../../../modules/paginationConfig.js'
import { useDebounce } from '../../../modules/utils.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../../modules/visualization.js'
import { sGetUiType } from '../../../reducers/ui.js'
import { usePaginationConfig } from '../../PaginationConfigContext.jsx'
import { DimensionsList } from '../DimensionsList/index.js'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from './useProgramDataDimensions.js'

// Type filter constants (must match MainSidebar)
const TYPE_FILTER_PROGRAM_INDICATORS = 'PROGRAM_INDICATORS'

const ProgramIndicatorsPanel = ({
    program,
    searchTerm,
    typeFilter = null,
    onEmptyStateChange,
}) => {
    const uiType = useSelector(sGetUiType)
    const isPivotTable = uiType === VIS_TYPE_PIVOT_TABLE
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

    // Filter dimensions based on type filter
    const filteredDimensions = useMemo(() => {
        if (!indicatorDimensions) return []
        // If type filter is active and doesn't match program indicators, return empty
        if (typeFilter && typeFilter !== TYPE_FILTER_PROGRAM_INDICATORS) {
            return []
        }
        return indicatorDimensions
    }, [indicatorDimensions, typeFilter])

    // Check if empty and notify parent
    const isEmpty = !loading && !fetching && filteredDimensions.length === 0
    React.useEffect(() => {
        if (onEmptyStateChange) {
            onEmptyStateChange(isEmpty)
        }
    }, [isEmpty, onEmptyStateChange])

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    // If no indicators or filtered out, show empty state
    if (filteredDimensions.length === 0) {
        return (
            <DimensionsList
                dimensions={[]}
                loading={loading}
                fetching={fetching}
                error={null}
                hasMore={false}
                onLoadMore={() => {}}
                dataTest="program-indicators-dimensions-list"
            />
        )
    }

    const disabledDimensions = isPivotTable
        ? filteredDimensions.map((d) => ({
              ...d,
              disabled: true,
              disabledTooltip: i18n.t('Not valid with pivot tables'),
          }))
        : filteredDimensions

    return (
        <ProgramDataDimensionsList
            dimensions={disabledDimensions}
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
    onEmptyStateChange: PropTypes.func,
    searchTerm: PropTypes.string,
    typeFilter: PropTypes.string,
}

export { ProgramIndicatorsPanel }
