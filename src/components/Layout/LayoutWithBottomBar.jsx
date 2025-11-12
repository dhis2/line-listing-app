import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Layout from './Layout.jsx'
import classes from './styles/LayoutWithBottomBar.module.css'
import {
    sGetUiLayout,
    sGetUiOutputType,
    sGetUiDataSource,
    sGetUiProgramId,
} from '../../reducers/ui.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import { tSetUiOutput, acUpdateUiEntityTypeId } from '../../actions/ui.js'
import { tSetCurrentFromUi } from '../../actions/current.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../modules/visualization.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../modules/programTypes.js'

const LayoutWithBottomBar = () => {
    const dispatch = useDispatch()
    const layout = useSelector(sGetUiLayout)
    const outputType = useSelector(sGetUiOutputType)
    const dataSource = useSelector(sGetUiDataSource)
    const programId = useSelector(sGetUiProgramId)
    const program = useSelector((state) => sGetMetadataById(state, programId))

    // Check if there are any dimensions in the layout
    const hasDimensions =
        (layout?.columns && layout.columns.length > 0) ||
        (layout?.filters && layout.filters.length > 0)

    // Check if tracked entity output is supported
    const supportsTrackedEntity =
        dataSource?.type === 'TRACKED_ENTITY_TYPE' ||
        dataSource?.programType === PROGRAM_TYPE_WITH_REGISTRATION ||
        program?.programType === PROGRAM_TYPE_WITH_REGISTRATION

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

    return (
        <div className={classes.wrapper}>
            <div className={classes.layoutContainer}>
                <Layout />
            </div>
            <div className={classes.bottomBar}>
                <button
                    onClick={handleEventClick}
                    className={classes.button}
                    disabled={!hasDimensions}
                >
                    {outputType === OUTPUT_TYPE_EVENT
                        ? 'Update Event list'
                        : 'Create Event list'}
                </button>
                <button
                    onClick={handleEnrollmentClick}
                    className={classes.button}
                    disabled={!hasDimensions}
                >
                    {outputType === OUTPUT_TYPE_ENROLLMENT
                        ? 'Update Enrollment list'
                        : 'Create Enrollment list'}
                </button>
                <button
                    onClick={handleTrackedEntityClick}
                    className={classes.button}
                    disabled={!hasDimensions || !supportsTrackedEntity}
                >
                    {outputType === OUTPUT_TYPE_TRACKED_ENTITY
                        ? 'Update Person list'
                        : 'Create Person list'}
                </button>
            </div>
        </div>
    )
}

export default LayoutWithBottomBar
