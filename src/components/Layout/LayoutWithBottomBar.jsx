import React from 'react'
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

    return (
        <div className={classes.wrapper}>
            <div className={classes.topBar}>
                <VisualizationTypeSelect
                    className={classes.visualizationTypeSelect}
                />
                <OptionsButtons
                    className={classes.optionsButtons}
                    icons={{
                        'data-tab': (
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M10.5 8.00006C11.0763 8.00018 11.635 7.80117 12.0815 7.43672C12.5279 7.07226 12.8347 6.56475 12.95 6.00006H15V5.00006H12.95C12.8352 4.43492 12.5286 3.92683 12.0821 3.56188C11.6356 3.19692 11.0767 2.99756 10.5 2.99756C9.92332 2.99756 9.36438 3.19692 8.91787 3.56188C8.47136 3.92683 8.16476 4.43492 8.05 5.00006H1V6.00006H8.05C8.16527 6.56475 8.47209 7.07226 8.91855 7.43672C9.36501 7.80117 9.92367 8.00018 10.5 8.00006ZM10.5 7.00006C10.697 7.00006 10.892 6.96127 11.074 6.88588C11.256 6.8105 11.4214 6.70001 11.5607 6.56073C11.6999 6.42144 11.8104 6.25608 11.8858 6.07409C11.9612 5.8921 12 5.69705 12 5.50006C12 5.30308 11.9612 5.10803 11.8858 4.92604C11.8104 4.74405 11.6999 4.57869 11.5607 4.4394C11.4214 4.30012 11.256 4.18963 11.074 4.11425C10.892 4.03886 10.697 4.00006 10.5 4.00006C10.1022 4.00006 9.72064 4.1581 9.43934 4.4394C9.15804 4.72071 9 5.10224 9 5.50006C9 5.89789 9.15804 6.27942 9.43934 6.56073C9.72064 6.84203 10.1022 7.00006 10.5 7.00006ZM7.95 11.0001H15V10.0001H7.95C7.83524 9.43492 7.52864 8.92683 7.08213 8.56188C6.63562 8.19692 6.07668 7.99756 5.5 7.99756C4.92332 7.99756 4.36438 8.19692 3.91787 8.56188C3.47136 8.92683 3.16476 9.43492 3.05 10.0001H1V11.0001H3.05C3.16476 11.5652 3.47136 12.0733 3.91787 12.4383C4.36438 12.8032 4.92332 13.0026 5.5 13.0026C6.07668 13.0026 6.63562 12.8032 7.08213 12.4383C7.52864 12.0733 7.83524 11.5652 7.95 11.0001ZM7 10.5001C7 10.697 6.9612 10.8921 6.88582 11.0741C6.81044 11.2561 6.69995 11.4214 6.56066 11.5607C6.42137 11.7 6.25601 11.8105 6.07403 11.8859C5.89204 11.9613 5.69698 12.0001 5.5 12.0001C5.30302 12.0001 5.10796 11.9613 4.92597 11.8859C4.74399 11.8105 4.57863 11.7 4.43934 11.5607C4.30005 11.4214 4.18956 11.2561 4.11418 11.0741C4.0388 10.8921 4 10.697 4 10.5001C4 10.1022 4.15804 9.72071 4.43934 9.4394C4.72064 9.1581 5.10218 9.00006 5.5 9.00006C5.89782 9.00006 6.27936 9.1581 6.56066 9.4394C6.84196 9.72071 7 10.1022 7 10.5001Z"
                                    fill="#6C7787"
                                />
                            </svg>
                        ),
                        'style-tab': (
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M8 1C8.53043 1 9.03914 1.21071 9.41421 1.58579C9.78929 1.96086 10 2.46957 10 3V5H12C12.2652 5 12.5196 5.10536 12.7071 5.29289C12.8946 5.48043 13 5.73478 13 6V12.5C13 13.163 12.674 13.783 12.229 14.229C11.783 14.674 11.163 15 10.5 15H1V14H1.5C1.837 14 2.217 13.826 2.521 13.521C2.826 13.217 3 12.837 3 12.5V6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H6V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1ZM4 12.5C4 13.056 3.769 13.582 3.432 14H4.5C4.837 14 5.217 13.826 5.521 13.521C5.826 13.217 6 12.837 6 12.5V11H7V12.5C7 13.056 6.769 13.582 6.432 14H7.5C7.837 14 8.217 13.826 8.521 13.521C8.826 13.217 9 12.837 9 12.5V11H10V12.5C10 13.056 9.769 13.582 9.432 14H10.5C10.837 14 11.217 13.826 11.521 13.521C11.826 13.217 12 12.837 12 12.5V10H4V12.5ZM4 9H12V8H4V9ZM8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V6H4V7H12V6H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2Z"
                                    fill="#6C7787"
                                />
                            </svg>
                        ),
                        'legend-tab': (
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 12H4V11H5V12ZM7 12H6V11H7V12ZM6 11H5V10H6V11ZM8 11H7V10H8V11ZM5 10H4V9H5V10ZM7 10H6V9H7V10ZM6 9H5V8H6V9ZM8 9H7V8H8V9ZM5 8H4V7H5V8ZM7 8H6V7H7V8ZM6 7H5V6H6V7ZM8 7H7V6H8V7ZM5 6H4V5H5V6ZM7 6H6V5H7V6ZM6 5H5V4H6V5ZM8 5H7V4H8V5Z"
                                    fill="#6C7787"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M13 2C13.2652 2 13.5196 2.10536 13.7071 2.29289C13.8946 2.48043 14 2.73478 14 3V13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14H3C2.75241 14.0001 2.5136 13.9083 2.32979 13.7424C2.14598 13.5765 2.03025 13.3483 2.005 13.102L2 13V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H13ZM3 4H4V5H3V6H4V7H3V8H4V9H3V10H4V11H3V12H4V13H5V12H6V13H7V12H8V13H13V3H7V4H6V3H5V4H4V3H3V4Z"
                                    fill="#6C7787"
                                />
                            </svg>
                        ),
                    }}
                />
            </div>
            <div className={classes.layoutContainer}>
                <Layout />
            </div>
            <div className={classes.bottomBar}>
                {renderButton(
                    'event',
                    handleEventClick,
                    hasCurrentVisualization && outputType === OUTPUT_TYPE_EVENT,
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
                              outputType === OUTPUT_TYPE_CUSTOM_VALUE,
                          `Update custom value ${terminology}`,
                          `Create custom value ${terminology}`,
                          `Switch to custom value ${terminology}`
                      )
                    : renderButton(
                          'trackedEntity',
                          handleTrackedEntityClick,
                          hasCurrentVisualization &&
                              outputType === OUTPUT_TYPE_TRACKED_ENTITY,
                          `Update Person ${terminology}`,
                          `Create Person ${terminology}`,
                          `Switch to Person ${terminology}`
                      )}
            </div>
        </div>
    )
}

export default LayoutWithBottomBar
