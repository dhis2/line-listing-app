import { useCachedDataQuery } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import LoadingMask from '../../LoadingMask/LoadingMask.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { useProgramDimensions } from './useProgramDimensions.js'

const ProgramDimensionsList = ({
    inputType,
    program,
    stageId,
    searchTerm,
    dimensionType,
}) => {
    const { userSettings } = useCachedDataQuery()
    const { dimensions, loading, fetching, error, setIsListEndVisible } =
        useProgramDimensions({
            inputType,
            program,
            stageId,
            searchTerm,
            dimensionType,
            nameProp: userSettings[DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY],
        })

    if (loading) {
        return <LoadingMask />
    }

    const draggableDimensions = dimensions.map((dimension) => ({
        draggableId: `program-${dimension.id}`,
        ...dimension,
    }))

    return (
        <DimensionsList
            setIsListEndVisible={setIsListEndVisible}
            dimensions={draggableDimensions}
            error={error}
            fetching={fetching}
            loading={loading}
            programName={program.name}
            searchTerm={searchTerm}
        />
    )
}

ProgramDimensionsList.propTypes = {
    inputType: PropTypes.string.isRequired,
    program: PropTypes.object.isRequired,
    dimensionType: PropTypes.string,
    searchTerm: PropTypes.string,
    stageId: PropTypes.string,
}

export { ProgramDimensionsList }
