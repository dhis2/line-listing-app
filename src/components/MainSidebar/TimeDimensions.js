import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import {
    DIMENSION_TYPE_EVENT_DATE,
    DIMENSION_TYPE_ENROLLMENT_DATE,
    DIMENSION_TYPE_INCIDENT_DATE,
    DIMENSION_TYPE_SCHEDULED_DATE,
    DIMENSION_TYPE_LAST_UPDATED,
} from '../../modules/dimensionTypes.js'
import {
    getTimeDimensions,
    NAME_PARENT_PROPERTY_PROGRAM,
} from '../../modules/timeDimensions.js'
import { OUTPUT_TYPE_EVENT } from '../../modules/visualization.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import {
    sGetUiInputType,
    sGetUiProgramId,
    sGetUiProgramStageId,
} from '../../reducers/ui.js'
import { DimensionItem } from './DimensionItem/index.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from './ProgramDimensionsPanel/ProgramDimensionsPanel.js'
import styles from './TimeDimensions.module.css'

const getName = (dimension, program, stage) => {
    if (!dimension.nameParentProperty) {
        return dimension.defaultName
    }
    const name =
        dimension.nameParentProperty === NAME_PARENT_PROPERTY_PROGRAM
            ? program[dimension.nameProperty]
            : stage[dimension.nameProperty]
    return name || dimension.defaultName
}

const TimeDimensions = ({ isSelected }) => {
    const selectedInputType = useSelector(sGetUiInputType)
    const programId = useSelector(sGetUiProgramId)
    const stageId = useSelector(sGetUiProgramStageId)
    const program =
        useSelector((state) => sGetMetadataById(state, programId)) || {}
    const stage = useSelector((state) => sGetMetadataById(state, stageId)) || {}

    const timeDimensions = getTimeDimensions()
    const dimensionIds = Object.keys(timeDimensions)
    const enabledDimensionIds = []

    if (selectedInputType && program.programType && stage.id) {
        const isEvent = selectedInputType === OUTPUT_TYPE_EVENT
        const withRegistration =
            program.programType === PROGRAM_TYPE_WITH_REGISTRATION

        if (isEvent) {
            enabledDimensionIds.push(DIMENSION_TYPE_EVENT_DATE)
        }

        if (withRegistration) {
            enabledDimensionIds.push(DIMENSION_TYPE_ENROLLMENT_DATE)

            isEvent &&
                !stage.hideDueDate &&
                enabledDimensionIds.push(DIMENSION_TYPE_SCHEDULED_DATE)

            program.displayIncidentDate &&
                enabledDimensionIds.push(DIMENSION_TYPE_INCIDENT_DATE)
        }

        if (isEvent || withRegistration) {
            enabledDimensionIds.push(DIMENSION_TYPE_LAST_UPDATED)
        }
    }

    const dimensions = dimensionIds.map((dimensionId) => ({
        id: dimensionId,
        dimensionType: DIMENSION_ID_PERIOD,
        name: getName(timeDimensions[dimensionId], program, stage),
        isDisabled: !enabledDimensionIds.includes(dimensionId),
    }))

    return (
        <div className={styles.list}>
            {dimensions.map((dimension) => (
                <DimensionItem
                    key={dimension.id}
                    dimensionType={dimension.dimensionType}
                    name={dimension.name}
                    id={dimension.id}
                    selected={isSelected(dimension.id)}
                    disabled={dimension.isDisabled}
                    optionSet={dimension.optionSet}
                    valueType={dimension.valueType}
                />
            ))}
        </div>
    )
}

TimeDimensions.propTypes = {
    isSelected: PropTypes.func,
}

export default TimeDimensions
