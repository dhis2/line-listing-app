import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useTimeDimensions } from '../../reducers/ui.js'
import { DimensionItem } from './DimensionItem/index.js'
import { MainSidebarSection } from './MainSidebarSection.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.js'

export const TimeDimensions = () => {
    const timeDimensions = useTimeDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    if (!timeDimensions) {
        return null
    }

    return (
        <MainSidebarSection header={i18n.t('Time dimensions')}>
            {timeDimensions.map((dimension) => (
                <DimensionItem
                    key={dimension.id}
                    dimensionType={dimension.dimensionType}
                    name={dimension.name}
                    id={dimension.id}
                    selected={getIsDimensionSelected(dimension.id)}
                    disabled={dimension.disabled}
                />
            ))}
        </MainSidebarSection>
    )
}
