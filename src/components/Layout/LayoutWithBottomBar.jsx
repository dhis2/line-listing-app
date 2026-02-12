import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tooltip, IconSync16, IconMore16, IconSettings16 } from '@dhis2/ui'
import { VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'
import CustomValueModal from '../Dialogs/CustomValueModal.jsx'
import Layout from './Layout.jsx'
import LayoutUtilitiesMenu from './LayoutUtilitiesMenu.jsx'
import { VisualizationTypeSelect } from '../Toolbar/VisualizationTypeSelect.jsx'
import OptionsButtons from '../VisualizationOptions/OptionsButtons.jsx'
import IconButton from '../IconButton/IconButton.jsx'
import { IconExpand, IconCollapse } from '../../assets/LayoutIcons.jsx'
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
import { sGetIsVisualizationLoading } from '../../reducers/loader.js'
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
    const isVisualizationLoading = useSelector(sGetIsVisualizationLoading)

    // Track collapsed state for layout content area
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Track custom value modal state and selected data element
    const [showCustomValueModal, setShowCustomValueModal] = useState(false)
    const [customValueDataElement, setCustomValueDataElement] = useState(null)

    // Clear custom value selection when "New" is clicked (current visualization becomes null)
    useEffect(() => {
        if (!current) {
            setCustomValueDataElement(null)
        }
    }, [current])

    // Get full program/entity metadata from dataSource ID
    const dataSourceId = dataSource?.id
    const dataSourceMetadata = useSelector((state) =>
        sGetMetadataById(state, dataSourceId)
    )

    // Check if we have a current visualization (created but maybe not saved)
    const hasCurrentVisualization = Boolean(current)

    // Check if layout has any dimensions
    const layoutHasDimensions =
        (layout.columns?.length || 0) +
            (layout.rows?.length || 0) +
            (layout.filters?.length || 0) >
        0

    // Completely blank empty state: no visualization, no layout items, no data source
    // This is the initial state when the app first launches
    const isCompletelyBlankState =
        !hasCurrentVisualization && !layoutHasDimensions && !dataSource?.id

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
        // Skip loading state for output type switches - the layout doesn't change,
        // only the data refreshes. This avoids showing skeleton UI for quick transitions.
        dispatch(tSetCurrentFromUi({ skipLoadingState: true }))
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

    // Check if we already have a custom value selected
    const hasCustomValueSelected = customValueDataElement !== null
    const isCustomValueActive =
        hasCurrentVisualization && outputType === OUTPUT_TYPE_CUSTOM_VALUE

    const handleCustomValueClick = () => {
        // If we already have a selection, just proceed (no need to reselect)
        if (hasCustomValueSelected) {
            handleOutputButtonClick(OUTPUT_TYPE_CUSTOM_VALUE)
        } else {
            // No selection yet - open modal to select a data element
            setShowCustomValueModal(true)
        }
    }

    const handleCustomValueAdjustClick = () => {
        // Open modal to adjust the selected data element
        setShowCustomValueModal(true)
    }

    const handleCustomValueModalClose = () => {
        setShowCustomValueModal(false)
    }

    const handleCustomValueModalConfirm = (selectedDataElement) => {
        // Store the selected data element and proceed with output type switch
        console.log('Custom value data element selected:', selectedDataElement)
        setCustomValueDataElement(selectedDataElement)
        setShowCustomValueModal(false)
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
        if (!hasCurrentVisualization) {
            // No visualization exists: use "Create" pattern
            buttonLabel = createText
        } else if (isCurrentType) {
            // Visualization exists and this is the current type: use "Update" pattern
            buttonLabel = updateText
        } else {
            // Visualization exists but this is NOT the current type: use "Switch" pattern
            buttonLabel = switchText
        }

        // Show icon only for the "Update" button (active button)
        const isActiveButton = hasCurrentVisualization && isCurrentType
        const isCreateButton = !hasCurrentVisualization
        const isSwitchButton = hasCurrentVisualization && !isCurrentType

        // Build className - apply buttonCreate for Create buttons, buttonAlt for Switch buttons, buttonUpdate for Update buttons
        let buttonClassName = classes.button
        if (!validation.disabled) {
            if (isActiveButton) {
                buttonClassName += ` ${classes.buttonUpdate}`
            } else if (isCreateButton) {
                buttonClassName += ` ${classes.buttonCreate}`
            } else if (isSwitchButton) {
                buttonClassName += ` ${classes.buttonAlt}`
            }
        }

        const button = (
            <button
                onClick={onClick}
                className={buttonClassName}
                disabled={validation.disabled}
            >
                {isActiveButton && <IconSync16 />}
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

    // Render custom value button with split button when a selection exists
    const renderCustomValueButton = () => {
        const validation = buttonValidation.customValue

        // If button should be hidden, return null
        if (validation.hidden) {
            return null
        }

        // Determine the button label
        let buttonLabel
        if (!hasCurrentVisualization) {
            buttonLabel = `Create custom value ${terminology}`
        } else if (isCustomValueActive) {
            buttonLabel = `Update custom value ${terminology}`
        } else {
            buttonLabel = `Switch to custom value ${terminology}`
        }

        // Build className based on current state
        let buttonClassName = classes.button
        if (!validation.disabled) {
            if (isCustomValueActive) {
                buttonClassName += ` ${classes.buttonUpdate}`
            } else if (!hasCurrentVisualization) {
                buttonClassName += ` ${classes.buttonCreate}`
            } else {
                buttonClassName += ` ${classes.buttonAlt}`
            }
        }

        // If we have a selection, show split button (for Update or Switch modes)
        if (hasCustomValueSelected) {
            const splitButton = (
                <div className={classes.splitButtonGroup}>
                    <button
                        onClick={handleCustomValueClick}
                        className={`${buttonClassName} ${classes.splitButtonMain}`}
                        disabled={validation.disabled}
                    >
                        {isCustomValueActive && <IconSync16 />}
                        {buttonLabel}
                    </button>
                    <button
                        onClick={handleCustomValueAdjustClick}
                        className={`${buttonClassName} ${classes.splitButtonDropdown}`}
                        disabled={validation.disabled}
                        title={`Change: ${
                            customValueDataElement?.name ||
                            'Select data element'
                        }`}
                    >
                        <IconSettings16 />
                    </button>
                </div>
            )

            if (validation.disabled && validation.reason) {
                return (
                    <Tooltip
                        key="customValue"
                        content={validation.reason}
                        placement="top"
                    >
                        {splitButton}
                    </Tooltip>
                )
            }

            return (
                <React.Fragment key="customValue">{splitButton}</React.Fragment>
            )
        }

        // For Create/Switch mode, show regular button that opens modal
        const button = (
            <button
                onClick={handleCustomValueClick}
                className={buttonClassName}
                disabled={validation.disabled}
            >
                {buttonLabel}
            </button>
        )

        if (validation.disabled && validation.reason) {
            return (
                <Tooltip
                    key="customValue"
                    content={validation.reason}
                    placement="top"
                >
                    {button}
                </Tooltip>
            )
        }

        return <React.Fragment key="customValue">{button}</React.Fragment>
    }

    const toggleCollapsed = () => {
        setIsCollapsed((prev) => !prev)
    }

    const handleExpandClick = () => {
        setIsCollapsed(false)
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.topBar}>
                {isVisualizationLoading ? (
                    <div className={classes.topBarPlaceholder} />
                ) : (
                    <>
                        <VisualizationTypeSelect
                            className={classes.visualizationTypeSelect}
                        />
                        <OptionsButtons className={classes.optionsButtons} />
                        <div className={classes.topBarSpacer} />
                        <div
                            className={`${classes.collapseToggle} ${
                                isCompletelyBlankState
                                    ? classes.hiddenKeepSpace
                                    : ''
                            }`}
                        >
                            <IconButton
                                onClick={toggleCollapsed}
                                dataTest="layout-collapse-toggle"
                            >
                                {isCollapsed ? (
                                    <IconExpand />
                                ) : (
                                    <IconCollapse />
                                )}
                            </IconButton>
                        </div>
                        <div
                            className={`${classes.utilitiesWrapper} ${
                                isCompletelyBlankState
                                    ? classes.hiddenKeepSpace
                                    : ''
                            }`}
                        >
                            <LayoutUtilitiesMenu />
                        </div>
                    </>
                )}
            </div>
            <div className={classes.contentArea}>
                {isVisualizationLoading ? (
                    <div className={classes.skeletonLayout}>
                        <div className={classes.skeletonAxis}>
                            <div
                                className={classes.skeletonChip}
                                style={{ width: '120px' }}
                            />
                            <div
                                className={classes.skeletonChip}
                                style={{ width: '90px' }}
                            />
                            <div
                                className={classes.skeletonChip}
                                style={{ width: '140px' }}
                            />
                            <div
                                className={classes.skeletonChip}
                                style={{ width: '100px' }}
                            />
                        </div>
                    </div>
                ) : isCollapsed ? (
                    <div
                        className={classes.collapsedContent}
                        onClick={handleExpandClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleExpandClick()
                            }
                        }}
                    >
                        <IconMore16 color="var(--colors-grey800)" />
                    </div>
                ) : (
                    <div
                        className={`${classes.layoutContainer} ${classes.slideIn}`}
                    >
                        <Layout
                            isCompletelyBlankState={isCompletelyBlankState}
                        />
                    </div>
                )}
                {/* Bottom bar - always rendered to maintain height, buttons hidden during loading or blank state */}
                {!isCollapsed && (
                    <div className={classes.bottomBar}>
                        <div
                            className={`${classes.bottomBarButtons} ${
                                isCompletelyBlankState || isVisualizationLoading
                                    ? classes.hiddenKeepSpace
                                    : classes.slideInBottom
                            }`}
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
                                ? renderCustomValueButton()
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
                    </div>
                )}
            </div>

            {/* Custom Value Table Modal */}
            {showCustomValueModal && (
                <CustomValueModal
                    onClose={handleCustomValueModalClose}
                    onConfirm={handleCustomValueModalConfirm}
                    initialSelection={customValueDataElement}
                />
            )}
        </div>
    )
}

export default LayoutWithBottomBar
