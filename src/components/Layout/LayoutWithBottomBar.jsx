import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tooltip } from '@dhis2/ui'
import Layout from './Layout.jsx'
import classes from './styles/LayoutWithBottomBar.module.css'
import {
    sGetUiLayout,
    sGetUiOutputType,
    sGetUiDataSource,
    sGetUiProgramId,
} from '../../reducers/ui.js'
import { sGetMetadataById, sGetMetadata } from '../../reducers/metadata.js'
import { tSetUiOutput, acUpdateUiEntityTypeId } from '../../actions/ui.js'
import { tSetCurrentFromUi } from '../../actions/current.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../modules/visualization.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../modules/programTypes.js'
import { validateButtons } from '../../modules/buttonValidation.js'

const LayoutWithBottomBar = () => {
    const dispatch = useDispatch()
    const layout = useSelector(sGetUiLayout)
    const outputType = useSelector(sGetUiOutputType)
    const dataSource = useSelector(sGetUiDataSource)
    const programId = useSelector(sGetUiProgramId)
    const program = useSelector((state) => sGetMetadataById(state, programId))
    const metadata = useSelector(sGetMetadata)

    // Check if tracked entity output is supported
    const supportsTrackedEntity =
        dataSource?.type === 'TRACKED_ENTITY_TYPE' ||
        dataSource?.programType === PROGRAM_TYPE_WITH_REGISTRATION ||
        program?.programType === PROGRAM_TYPE_WITH_REGISTRATION

    // Get program type from dataSource or program
    const programType = dataSource?.programType || program?.programType

    // Validate button states based on layout dimensions
    const buttonValidation = validateButtons(
        layout,
        metadata,
        supportsTrackedEntity,
        programType
    )

    const handleOutputButtonClick = (outputTypeValue) => {
        // For tracked entity output, ensure the entity type is set from the program if available
        if (
            outputTypeValue === OUTPUT_TYPE_TRACKED_ENTITY &&
            program?.trackedEntityType
        ) {
            dispatch(
                acUpdateUiEntityTypeId(program.trackedEntityType.id, {
                    [program.trackedEntityType.id]: program.trackedEntityType,
                })
            )
        }

        dispatch(tSetUiOutput(outputTypeValue))
        dispatch(tSetCurrentFromUi())
    }

    const handleEventClick = () => {
        handleOutputButtonClick(OUTPUT_TYPE_EVENT)
    }

    const handleEnrollmentClick = () => {
        handleOutputButtonClick(OUTPUT_TYPE_ENROLLMENT)
    }

    const handleTrackedEntityClick = () => {
        handleOutputButtonClick(OUTPUT_TYPE_TRACKED_ENTITY)
    }

    const renderButton = (
        buttonKey,
        onClick,
        isCurrentType,
        updateText,
        createText
    ) => {
        const validation = buttonValidation[buttonKey]

        // If button should be hidden, return null
        if (validation.hidden) {
            return null
        }

        const button = (
            <button
                onClick={onClick}
                className={classes.button}
                disabled={validation.disabled}
            >
                {isCurrentType ? updateText : createText}
            </button>
        )

        // Wrap with tooltip only if disabled and has a reason
        if (validation.disabled && validation.reason) {
            return (
                <Tooltip
                    key={buttonKey}
                    content={validation.reason}
                    placement="top"
                >
                    {button}
                </Tooltip>
            )
        }

        return <React.Fragment key={buttonKey}>{button}</React.Fragment>
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.layoutContainer}>
                <Layout />
            </div>
            <div className={classes.bottomBar}>
                {renderButton(
                    'event',
                    handleEventClick,
                    outputType === OUTPUT_TYPE_EVENT,
                    'Update Event list',
                    'Create Event list'
                )}
                {renderButton(
                    'enrollment',
                    handleEnrollmentClick,
                    outputType === OUTPUT_TYPE_ENROLLMENT,
                    'Update Enrollment list',
                    'Create Enrollment list'
                )}
                {renderButton(
                    'trackedEntity',
                    handleTrackedEntityClick,
                    outputType === OUTPUT_TYPE_TRACKED_ENTITY,
                    'Update Person list',
                    'Create Person list'
                )}
            </div>
        </div>
    )
}

export default LayoutWithBottomBar
