import i18n from '@dhis2/d2-i18n'
import { SortableContext } from '@dnd-kit/sortable'
import React from 'react'
import { useMainDimensions } from '../../reducers/ui.js'
import { MAIN_DIMENSIONS } from '../DndContext.js'
import { DimensionItem } from './DimensionItem/index.js'
import { MainSidebarSection } from './MainSidebarSection.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.js'

export const MainDimensions = () => {
    const mainDimensions = useMainDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    const draggableDimensions = mainDimensions.map((dimension) => ({
        draggableId: `${MAIN_DIMENSIONS}-${dimension.id}`,
        ...dimension,
    }))

    return (
        <MainSidebarSection header={i18n.t('Main dimensions')}>
            <SortableContext
                id={MAIN_DIMENSIONS}
                items={draggableDimensions.map((dim) => dim.draggableId)}
            >
                {draggableDimensions.map((dimension) => (
                    <DimensionItem
                        key={dimension.id}
                        {...dimension}
                        selected={getIsDimensionSelected(dimension.id)}
                    />
                ))}
            </SortableContext>
        </MainSidebarSection>
    )
}
