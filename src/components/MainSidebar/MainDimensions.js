import i18n from '@dhis2/d2-i18n'
import React, { useMemo } from 'react'
import { useSelector, useStore } from 'react-redux'
import {
    DIMENSION_TYPE_OU,
    DIMENSION_TYPE_CREATED_BY,
    DIMENSION_TYPE_PROGRAM_STATUS,
    DIMENSION_TYPE_EVENT_STATUS,
    DIMENSION_TYPE_LAST_UPDATED_BY,
} from '../../modules/dimensionTypes.js'
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

export const MainDimensions = () => {
    const inputType = useSelector(sGetUiInputType)
    const programType = useProgramType()
    const { getIsDimensionSelected } = useSelectedDimensions()

    return (
        <MainSidebarSection header={i18n.t('Main dimensions')}>
            <DimensionItem
                dimensionType={DIMENSION_TYPE_OU}
                name={i18n.t('Organisation unit')}
                id={DIMENSION_TYPE_OU}
                selected={getIsDimensionSelected(DIMENSION_TYPE_OU)}
            />
            <DimensionItem
                dimensionType={DIMENSION_TYPE_PROGRAM_STATUS}
                name={i18n.t('Program status')}
                id={DIMENSION_TYPE_PROGRAM_STATUS}
                selected={getIsDimensionSelected(DIMENSION_TYPE_PROGRAM_STATUS)}
                disabled={
                    !programType ||
                    programType === PROGRAM_TYPE_WITHOUT_REGISTRATION
                }
            />
            <DimensionItem
                dimensionType={DIMENSION_TYPE_EVENT_STATUS}
                name={i18n.t('Event status')}
                id={DIMENSION_TYPE_EVENT_STATUS}
                selected={getIsDimensionSelected(DIMENSION_TYPE_EVENT_STATUS)}
                disabled={!programType || inputType === OUTPUT_TYPE_ENROLLMENT}
            />
            <DimensionItem
                dimensionType={DIMENSION_TYPE_CREATED_BY}
                name={i18n.t('Created by')}
                id={DIMENSION_TYPE_CREATED_BY}
                selected={getIsDimensionSelected(DIMENSION_TYPE_CREATED_BY)}
            />
            <DimensionItem
                dimensionType={DIMENSION_TYPE_LAST_UPDATED_BY}
                name={i18n.t('Last updated by')}
                id={DIMENSION_TYPE_LAST_UPDATED_BY}
                selected={getIsDimensionSelected(
                    DIMENSION_TYPE_LAST_UPDATED_BY
                )}
            />
        </MainSidebarSection>
    )
}
