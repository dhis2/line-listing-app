import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useMainDimensions } from '../../reducers/ui.js'
import { DimensionItem } from './DimensionItem/index.js'
import { MainSidebarSection } from './MainSidebarSection.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.js'

export const MainDimensions = () => {
    const mainDimensions = useMainDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    return (
        <MainSidebarSection header={i18n.t('Main dimensions')}>
            {Object.values(mainDimensions).map(
                ({ id, name, dimensionType, disabled }) => (
                    <DimensionItem
                        key={id}
                        dimensionType={dimensionType}
                        name={name}
                        id={id}
                        selected={getIsDimensionSelected(id)}
                        disabled={disabled}
                    />
                )
            )}
        </MainSidebarSection>
    )
}
