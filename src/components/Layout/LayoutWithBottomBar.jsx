import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    Tooltip,
    IconTable16,
    IconVisualizationColumnStacked16,
    IconLegend16,
} from '@dhis2/ui'
import { VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'
import Layout from './Layout.jsx'
import { VisualizationTypeSelect } from '../Toolbar/VisualizationTypeSelect.jsx'
import { VisualizationTypeGrid } from '../Toolbar/VisualizationTypeGrid.jsx'
import OptionsButtons from '../VisualizationOptions/OptionsButtons.jsx'
import classes from './styles/LayoutWithBottomBar.module.css'
import {
    sGetUiLayout,
    sGetUiOutputType,
    sGetUiDataSource,
    sGetUiProgramId,
    sGetUiType,
} from '../../reducers/ui.js'
import { sGetMetadataById, sGetMetadata } from '../../reducers/metadata.js'
import { sGetVisualization } from '../../reducers/visualization.js'
import { sGetCurrent } from '../../reducers/current.js'
import { tSetUiOutput, acUpdateUiEntityTypeId } from '../../actions/ui.js'
import { tSetCurrentFromUi } from '../../actions/current.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
    OUTPUT_TYPE_CUSTOM_VALUE,
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
    const current = useSelector(sGetCurrent)
    const visualizationType = useSelector(sGetUiType)

    // Get full program/entity metadata from dataSource ID
    const dataSourceId = dataSource?.id
    const dataSourceMetadata = useSelector((state) =>
        sGetMetadataById(state, dataSourceId)
    )

    // Check if we have a current visualization (created but maybe not saved)
    const hasCurrentVisualization = Boolean(current)

    // Determine button terminology based on visualization type
    const terminology =
        visualizationType === VIS_TYPE_PIVOT_TABLE ? 'table' : 'list'

    // PROTOTYPE: Check if using Child Programme to customize enrollment label
    const isChildProgramme = dataSourceMetadata?.name === 'Child Programme'
    const enrollmentLabel = isChildProgramme ? 'Pregnancy' : 'Enrollment'

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

    const handleCustomValueClick = () => {
        handleOutputButtonClick(OUTPUT_TYPE_CUSTOM_VALUE)
    }

    const renderButton = (
        buttonKey,
        onClick,
        isCurrentType,
        updateText,
        createText,
        switchText
    ) => {
        const validation = buttonValidation[buttonKey]

        // If button should be hidden, return null
        if (validation.hidden) {
            return null
        }

        // Determine the button label based on visualization state
        let buttonLabel
        let isAltMode = false
        if (!hasCurrentVisualization) {
            // No visualization exists: use "Create" pattern
            buttonLabel = createText
        } else if (isCurrentType) {
            // Visualization exists and this is the current type: use "Update" pattern
            buttonLabel = updateText
        } else {
            // Visualization exists but this is NOT the current type: use "Switch" pattern
            buttonLabel = switchText
            isAltMode = true
        }

        // Build className - only apply buttonAlt for "Switch to" mode
        const buttonClassName = `${classes.button} ${
            isAltMode && !validation.disabled ? classes.buttonAlt || '' : ''
        }`

        const button = (
            <button
                onClick={onClick}
                className={buttonClassName}
                disabled={validation.disabled}
            >
                {buttonLabel}
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

    // Check if a visualization type has been selected
    const hasVisualizationType = Boolean(visualizationType)

    // Track layout visibility
    const [showLayout, setShowLayout] = useState(hasVisualizationType)

    useEffect(() => {
        // Sync showLayout with hasVisualizationType immediately
        setShowLayout(hasVisualizationType)
    }, [hasVisualizationType])

    return (
        <div className={classes.wrapper}>
            <div className={classes.topBar}>
                <VisualizationTypeSelect
                    className={classes.visualizationTypeSelect}
                />
                {(hasVisualizationType || showLayout) && (
                    <OptionsButtons className={classes.optionsButtons} />
                )}
            </div>
            <div className={classes.contentArea}>
                {showLayout ? (
                    <>
                        <div
                            className={`${classes.layoutContainer} ${classes.slideIn}`}
                        >
                            <Layout />
                        </div>
                        <div
                            className={`${classes.bottomBar} ${classes.slideInBottom}`}
                        >
                            {renderButton(
                                'event',
                                handleEventClick,
                                hasCurrentVisualization &&
                                    outputType === OUTPUT_TYPE_EVENT,
                                `Update Event ${terminology}`,
                                `Create Event ${terminology}`,
                                `Switch to Event ${terminology}`
                            )}
                            {renderButton(
                                'enrollment',
                                handleEnrollmentClick,
                                hasCurrentVisualization &&
                                    outputType === OUTPUT_TYPE_ENROLLMENT,
                                `Update ${enrollmentLabel} ${terminology}`,
                                `Create ${enrollmentLabel} ${terminology}`,
                                `Switch to ${enrollmentLabel} ${terminology}`
                            )}
                            {/* Show Person button for Line List, Custom value button for Pivot Table */}
                            {visualizationType === VIS_TYPE_PIVOT_TABLE
                                ? renderButton(
                                      'customValue',
                                      handleCustomValueClick,
                                      hasCurrentVisualization &&
                                          outputType ===
                                              OUTPUT_TYPE_CUSTOM_VALUE,
                                      `Update custom value ${terminology}`,
                                      `Create custom value ${terminology}`,
                                      `Switch to custom value ${terminology}`
                                  )
                                : renderButton(
                                      'trackedEntity',
                                      handleTrackedEntityClick,
                                      hasCurrentVisualization &&
                                          outputType ===
                                              OUTPUT_TYPE_TRACKED_ENTITY,
                                      `Update Person ${terminology}`,
                                      `Create Person ${terminology}`,
                                      `Switch to Person ${terminology}`
                                  )}
                        </div>
                    </>
                ) : (
                    <div
                        className={classes.emptyLayoutArea}
                        // className={`${classes.emptyLayoutArea} ${
                        //     isTransitioning ? classes.fadeOut : ''
                        // }`}
                    >
                        <VisualizationTypeGrid />
                    </div>
                )}
            </div>
        </div>
    )
}

export default LayoutWithBottomBar
