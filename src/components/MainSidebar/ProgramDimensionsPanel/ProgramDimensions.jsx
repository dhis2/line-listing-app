import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useProgramDimensions } from '../../../reducers/ui.js'
import styles from '../common.module.css'
import { DimensionItem } from '../DimensionItem/index.js'
import { MainSidebarSection } from '../MainSidebarSection.jsx'
import { useSelectedDimensions } from '../SelectedDimensionsContext.jsx'

export const ProgramDimensions = () => {
    const programDimensions = useProgramDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    if (!programDimensions) {
        return null
    }

    const draggableDimensions = programDimensions.map((dimension) => ({
        draggableId: `program-${dimension.id}`,
        ...dimension,
    }))

    return (
        <MainSidebarSection
            header={i18n.t('Program dimensions')}
            dataTest="program-dimensions"
        >
            {draggableDimensions.map((dimension) => (
                <span key={dimension.id} className={styles.span}>
                    <DimensionItem
                        {...dimension}
                        selected={getIsDimensionSelected(dimension.id)}
                    />
                </span>
            ))}
        </MainSidebarSection>
    )
}
