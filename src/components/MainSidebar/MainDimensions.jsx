import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useMainDimensions } from '../../reducers/ui.js'
import styles from './common.module.css'
import { DimensionItem } from './DimensionItem/index.js'
import { MainSidebarSection } from './MainSidebarSection.jsx'
import { useSelectedDimensions } from './SelectedDimensionsContext.jsx'

export const MainDimensions = () => {
    const mainDimensions = useMainDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    const draggableDimensions = mainDimensions.map((dimension) => ({
        draggableId: `main-${dimension.id}`,
        ...dimension,
    }))

    return (
        <MainSidebarSection
            header={i18n.t('Global dimensions')}
            dataTest="main-dimensions-sidebar"
        >
            {draggableDimensions.map((dimension) => (
                <span className={styles.span} key={dimension.id}>
                    <DimensionItem
                        {...dimension}
                        selected={getIsDimensionSelected(dimension.id)}
                    />
                </span>
            ))}
        </MainSidebarSection>
    )
}
