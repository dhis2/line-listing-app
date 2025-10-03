import { useCachedDataQuery } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { useDebounce } from '../../../modules/utils.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { sGetUiEntityTypeId } from '../../../reducers/ui.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { ProgramFilter } from './ProgramFilter.jsx'
import { useTrackedEntityDimensions } from './useTrackedEntityDimensions.js'

const TrackedEntityDimensionsPanel = ({ visible, searchTerm: externalSearchTerm, onEmptyStateChange }) => {
    const [selectedProgramId, setSelectedProgramId] = useState(null)
    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)
    const entityType = useSelector((state) =>
        sGetMetadataById(state, selectedEntityTypeId)
    )
    const debouncedSearchTerm = useDebounce(externalSearchTerm || '')
    const { currentUser } = useCachedDataQuery()
    const { loading, fetching, error, dimensions, setIsListEndVisible } =
        useTrackedEntityDimensions({
            visible,
            searchTerm: debouncedSearchTerm,
            nameProp:
                currentUser.settings[
                    DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                ],
            id: selectedEntityTypeId,
            programId: selectedProgramId,
        })

    if (!visible) {
        return null
    }

    // Check if empty and notify parent
    const isEmpty = !loading && !fetching && dimensions.length === 0
    React.useEffect(() => {
        if (onEmptyStateChange) {
            onEmptyStateChange(isEmpty)
        }
    }, [isEmpty, onEmptyStateChange])

    const draggableDimensions = dimensions.map((dimension) => ({
        draggableId: `tracked-entity-${dimension.id}`,
        ...dimension,
    }))

    return (
        <>
            <div>
                <div>
                    <ProgramFilter
                        setSelectedProgramId={setSelectedProgramId}
                        selectedProgramId={selectedProgramId}
                    />
                </div>
            </div>
            <DimensionsList
                setIsListEndVisible={setIsListEndVisible}
                dimensions={draggableDimensions}
                error={error}
                fetching={fetching}
                loading={loading}
                searchTerm={debouncedSearchTerm}
                dataTest="tracked-entity-dimensions"
                trackedEntityType={entityType?.name}
            />
        </>
    )
}

TrackedEntityDimensionsPanel.propTypes = {
    visible: PropTypes.bool,
    searchTerm: PropTypes.string,
    onEmptyStateChange: PropTypes.func,
}

export { TrackedEntityDimensionsPanel }
