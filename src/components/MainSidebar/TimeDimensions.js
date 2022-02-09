import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useSelector } from 'react-redux'
import {
    DIMENSION_TYPE_EVENT_DATE,
    DIMENSION_TYPE_ENROLLMENT_DATE,
    DIMENSION_TYPE_INCIDENT_DATE,
    DIMENSION_TYPE_SCHEDULED_DATE,
    DIMENSION_TYPE_LAST_UPDATED,
} from '../../modules/dimensionTypes.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import { DimensionItem } from './DimensionItem/index.js'
import { MainSidebarSection } from './MainSidebarSection.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.js'

export const TimeDimensions = () => {
    const { getIsDimensionSelected } = useSelectedDimensions()
    const eventDateDim = useSelector((state) =>
        sGetMetadataById(state, DIMENSION_TYPE_EVENT_DATE)
    )
    const enrollmentDateDim = useSelector((state) =>
        sGetMetadataById(state, DIMENSION_TYPE_ENROLLMENT_DATE)
    )
    const incidentDateDim = useSelector((state) =>
        sGetMetadataById(state, DIMENSION_TYPE_INCIDENT_DATE)
    )
    const scheduledDateDim = useSelector((state) =>
        sGetMetadataById(state, DIMENSION_TYPE_SCHEDULED_DATE)
    )
    const lastUpdatedDim = useSelector((state) =>
        sGetMetadataById(state, DIMENSION_TYPE_LAST_UPDATED)
    )

    if (!eventDateDim) {
        return null
    }

    const dimensions = [
        eventDateDim,
        enrollmentDateDim,
        incidentDateDim,
        scheduledDateDim,
        lastUpdatedDim,
    ].map(({ id, name, dimensionType, disabled }) => ({
        id,
        dimensionType,
        name,
        selected: getIsDimensionSelected(id),
        disabled,
        //optionSet
        //valueType
    }))

    return (
        <MainSidebarSection header={i18n.t('Time dimensions')}>
            {dimensions.map((dimension) => (
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
