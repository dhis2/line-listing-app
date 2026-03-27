import {
    useCachedDataQuery,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import {
    DIMENSION_ID_REGISTRATION_OU,
    DIMENSION_ID_REGISTRATION_DATE,
} from '../../../modules/dimensionConstants.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { useDebounce } from '../../../modules/utils.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { sGetUiEntityTypeId, sGetUiProgramId } from '../../../reducers/ui.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { useProgramDataDimensions } from '../ProgramDimensionsPanel/useProgramDataDimensions.js'
import { useTrackedEntityDimensions } from './useTrackedEntityDimensions.js'

const TrackedEntityDimensionsPanel = ({
    visible,
    searchTerm: externalSearchTerm,
    onEmptyStateChange,
}) => {
    // Get selected program from global state
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedProgram = useSelector((state) =>
        sGetMetadataById(state, selectedProgramId)
    )

    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)
    const entityType = useSelector((state) =>
        sGetMetadataById(state, selectedEntityTypeId)
    )
    const debouncedSearchTerm = useDebounce(externalSearchTerm || '')
    const { currentUser } = useCachedDataQuery()

    // Use useTrackedEntityDimensions for tracked entity type attributes (no program selected)
    const {
        loading: tetLoading,
        fetching: tetFetching,
        error: tetError,
        dimensions: tetDimensions,
        hasMore: tetHasMore,
        loadMore: tetLoadMore,
    } = useTrackedEntityDimensions({
        visible: visible && !selectedProgramId,
        searchTerm: debouncedSearchTerm,
        nameProp:
            currentUser.settings[DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY],
        id: selectedEntityTypeId,
        programId: null, // Always null - we use useProgramDataDimensions when program is selected
    })

    // Use useProgramDataDimensions for program attributes (when program is selected)
    // This is the same query used by the Enrollment card
    const {
        loading: programLoading,
        fetching: programFetching,
        error: programError,
        dimensions: programDimensions,
        hasMore: programHasMore,
        loadMore: programLoadMore,
    } = useProgramDataDimensions({
        inputType: OUTPUT_TYPE_ENROLLMENT,
        program: selectedProgram,
        searchTerm: debouncedSearchTerm,
        dimensionType: DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    })

    // Determine which data source to use based on program selection
    const hasProgram = !!selectedProgramId
    const loading = hasProgram ? programLoading : tetLoading
    const fetching = hasProgram ? programFetching : tetFetching
    const error = hasProgram ? programError : tetError
    const dimensions = hasProgram ? programDimensions : tetDimensions
    const hasMore = hasProgram ? programHasMore : tetHasMore
    const loadMore = hasProgram ? programLoadMore : tetLoadMore

    // Check if empty and notify parent
    const isEmpty = !loading && !fetching && dimensions.length === 0
    React.useEffect(() => {
        if (onEmptyStateChange) {
            onEmptyStateChange(isEmpty)
        }
    }, [isEmpty, onEmptyStateChange])

    if (!visible) {
        return null
    }

    // Create fixed registration dimensions to show first
    // Using mock IDs to distinguish from program enrollment dimensions
    const registrationDimensions = [
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

    // Filter out these mock registration dimensions from fetched dimensions
    // (in case they somehow come from the API)
    const filteredDimensions = dimensions.filter(
        (d) =>
            d.id !== DIMENSION_ID_REGISTRATION_OU &&
            d.id !== DIMENSION_ID_REGISTRATION_DATE
    )

    // Combine registration dimensions with the rest
    const allDimensions = [...registrationDimensions, ...filteredDimensions]

    const draggableDimensions = allDimensions.map((dimension) => ({
        draggableId: `tracked-entity-${dimension.id}`,
        ...dimension,
    }))

    return (
        <DimensionsList
            onLoadMore={loadMore}
            hasMore={hasMore}
            dimensions={draggableDimensions}
            error={error}
            fetching={fetching}
            loading={loading}
            searchTerm={debouncedSearchTerm}
            dataTest="tracked-entity-dimensions"
            trackedEntityType={entityType?.name}
        />
    )
}

TrackedEntityDimensionsPanel.propTypes = {
    onEmptyStateChange: PropTypes.func,
    searchTerm: PropTypes.string,
    visible: PropTypes.bool,
}

export { TrackedEntityDimensionsPanel }
