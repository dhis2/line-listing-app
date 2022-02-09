import i18n from '@dhis2/d2-i18n'
import React, { useMemo } from 'react'
import { useSelector, useStore } from 'react-redux'
import {
    DIMENSION_TYPE_PROGRAM_STATUS,
    DIMENSION_TYPE_EVENT_STATUS,
} from '../../modules/dimensionTypes.js'
import { MAIN_DIMENSIONS } from '../../modules/mainDimensions.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../modules/visualization.js'
import { sGetUiProgramId, sGetUiInputType } from '../../reducers/ui.js'
import { DimensionItem } from './DimensionItem/index.js'
import { MainSidebarSection } from './MainSidebarSection.js'
import { PROGRAM_TYPE_WITHOUT_REGISTRATION } from './ProgramDimensionsPanel/ProgramDimensionsPanel.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.js'

const useProgramType = () => {
    const store = useStore()
    const programId = useSelector(sGetUiProgramId)

    return useMemo(() => {
        if (!programId) {
            return null
        }

        const { metadata } = store.getState()
        return metadata[programId].programType
    }, [programId])
}

const getIsDimensionDisabled = (dimensionType, inputType, programType) => {
    if (dimensionType === DIMENSION_TYPE_PROGRAM_STATUS) {
        return !programType || programType === PROGRAM_TYPE_WITHOUT_REGISTRATION
    } else if (dimensionType === DIMENSION_TYPE_EVENT_STATUS) {
        return !programType || inputType === OUTPUT_TYPE_ENROLLMENT
    } else {
        return false
    }
}

export const MainDimensions = () => {
    const inputType = useSelector(sGetUiInputType)
    const programType = useProgramType()
    const { getIsDimensionSelected } = useSelectedDimensions()

    return (
        <MainSidebarSection header={i18n.t('Main dimensions')}>
            {Object.values(MAIN_DIMENSIONS).map(
                ({ id, name, dimensionType }) => (
                    <DimensionItem
                        key={id}
                        dimensionType={dimensionType}
                        name={name}
                        id={id}
                        selected={getIsDimensionSelected(id)}
                        disabled={getIsDimensionDisabled(
                            dimensionType,
                            inputType,
                            programType
                        )}
                    />
                )
            )}
        </MainSidebarSection>
    )
}
