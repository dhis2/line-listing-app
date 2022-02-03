import i18n from '@dhis2/d2-i18n'
import React from 'react'
// import { useSelector } from 'react-redux'
// import {
//     DIMENSION_TYPE_EVENT_DATE,
//     DIMENSION_TYPE_ENROLLMENT_DATE,
//     DIMENSION_TYPE_INCIDENT_DATE,
//     DIMENSION_TYPE_SCHEDULED_DATE,
//     DIMENSION_TYPE_LAST_UPDATED,
// } from '../../modules/dimensionTypes.js'
// import { OUTPUT_TYPE_EVENT } from '../../modules/visualization.js'
// import {
//     sGetUiInputType,
//     sGetUiProgramId,
//     sGetUiProgramStageId,
// } from '../../reducers/ui.js'
// import { DimensionItem } from './DimensionItem/index.js'
// import { PROGRAM_TYPE_WITH_REGISTRATION } from './ProgramDimensionsPanel/ProgramDimensionsPanel.js'
// import { DimensionItem } from './DimensionItem/index.js'
import { DimensionItem } from './DimensionItem/index.js'
import { MainSidebarSection } from './MainSidebarSection.js'
// import { useSelectedDimensions } from './SelectedDimensionsContext.js'

export const MainDimensions = () => {
    // const { getIsDimensionSelected } = useSelectedDimensions()
    // const selectedInputType = useSelector(sGetUiInputType)
    // const programId = useSelector(sGetUiProgramId)
    // const stageId = useSelector(sGetUiProgramStageId)

    return (
        <MainSidebarSection header={i18n.t('Main dimensions')}>
            <DimensionItem
                dimensionType={'test'}
                name={'test'}
                id={1}
                selected={true}
                disabled={false}
                optionSet={undefined}
                valueType={'what'}
            />
        </MainSidebarSection>
    )
    // return (
    //     <MainSidebarSection header={i18n.t('Main dimensions')}>
    //         <h1>Henkie</h1>
    //     </MainSidebarSection>
    // )
}
