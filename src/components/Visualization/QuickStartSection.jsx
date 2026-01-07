import { DIMENSION_ID_ORGUNIT, USER_ORG_UNIT } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { IconCalendar16, IconLocation16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current.js'
import {
    acAddUiLayoutDimensions,
    acSetUiExpandedCards,
    acSetUiItems,
    tSetUiOutput,
} from '../../actions/ui.js'
import {
    ACCESSORY_PANEL_TAB_PROGRAM_DATA,
    getStageCardId,
} from '../../modules/accessoryPanelConstants.js'
import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
} from '../../modules/dimensionConstants.js'
import { formatDimensionId } from '../../modules/dimensionId.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
} from '../../modules/visualization.js'
import { sGetMetadataById, sGetMetadata } from '../../reducers/metadata.js'
import { sGetUiDataSource, sGetUiExpandedCards } from '../../reducers/ui.js'
import styles from './styles/QuickStartSection.module.css'

// Relative period ID for "Last 12 months"
const LAST_12_MONTHS = 'LAST_12_MONTHS'

const QuickStartSection = () => {
    const dispatch = useDispatch()
    const dataSource = useSelector(sGetUiDataSource)
    const program = useSelector((state) =>
        sGetMetadataById(state, dataSource?.id)
    )
    const metadata = useSelector(sGetMetadata)
    const expandedCards = useSelector(sGetUiExpandedCards) || []

    // Only show for programs with registration that have stages
    if (
        !program ||
        !program.programStages ||
        program.programStages.length === 0
    ) {
        return null
    }

    const handleEnrollmentQuickStart = () => {
        const programId = program.id

        // Build dimension IDs for enrollment
        const orgUnitId = formatDimensionId({
            dimensionId: DIMENSION_ID_ORGUNIT,
            programId,
            outputType: OUTPUT_TYPE_ENROLLMENT,
        })

        const enrollmentDateId = formatDimensionId({
            dimensionId: DIMENSION_ID_ENROLLMENT_DATE,
            programId,
            outputType: OUTPUT_TYPE_ENROLLMENT,
        })

        // Build period item ID (formatted with programId)
        const periodItemId = formatDimensionId({
            dimensionId: LAST_12_MONTHS,
            programId,
            outputType: OUTPUT_TYPE_ENROLLMENT,
        })

        // Get dimension metadata
        const orgUnitMetadata = metadata[orgUnitId] || {
            id: orgUnitId,
            name: i18n.t('Enrollment org. unit'),
        }

        const enrollmentDateMetadata = metadata[enrollmentDateId] || {
            id: enrollmentDateId,
            name:
                program.displayEnrollmentDateLabel || i18n.t('Enrollment date'),
        }

        // Add dimensions to columns
        dispatch(
            acAddUiLayoutDimensions(
                {
                    [orgUnitId]: { axisId: 'columns' },
                    [enrollmentDateId]: { axisId: 'columns' },
                },
                {
                    [orgUnitId]: orgUnitMetadata,
                    [enrollmentDateId]: enrollmentDateMetadata,
                }
            )
        )

        // Set period items (LAST_12_MONTHS)
        dispatch(
            acSetUiItems(
                { dimensionId: enrollmentDateId, itemIds: [periodItemId] },
                {
                    [LAST_12_MONTHS]: {
                        id: LAST_12_MONTHS,
                        name: i18n.t('Last 12 months'),
                    },
                }
            )
        )

        // Set output type to enrollment and trigger visualization
        dispatch(tSetUiOutput(OUTPUT_TYPE_ENROLLMENT))
        dispatch(tSetCurrentFromUi())
    }

    const handleStageQuickStart = (stage) => {
        const programId = program.id
        const stageId = stage.id

        // Build dimension IDs for event (with stage)
        const orgUnitId = formatDimensionId({
            dimensionId: DIMENSION_ID_ORGUNIT,
            programId,
            programStageId: stageId,
            outputType: OUTPUT_TYPE_EVENT,
        })

        const eventDateId = formatDimensionId({
            dimensionId: DIMENSION_ID_EVENT_DATE,
            programId,
            programStageId: stageId,
            outputType: OUTPUT_TYPE_EVENT,
        })

        // Build period item ID (formatted with programId)
        const periodItemId = formatDimensionId({
            dimensionId: LAST_12_MONTHS,
            programId,
            outputType: OUTPUT_TYPE_EVENT,
        })

        // Get dimension metadata
        const orgUnitMetadata = metadata[orgUnitId] || {
            id: orgUnitId,
            name: i18n.t('Organisation unit'),
        }

        const eventDateMetadata = metadata[eventDateId] || {
            id: eventDateId,
            name: stage.displayExecutionDateLabel || i18n.t('Event date'),
        }

        // Add dimensions to columns
        dispatch(
            acAddUiLayoutDimensions(
                {
                    [orgUnitId]: { axisId: 'columns' },
                    [eventDateId]: { axisId: 'columns' },
                },
                {
                    [orgUnitId]: orgUnitMetadata,
                    [eventDateId]: eventDateMetadata,
                }
            )
        )

        // Set period items (LAST_12_MONTHS)
        dispatch(
            acSetUiItems(
                { dimensionId: eventDateId, itemIds: [periodItemId] },
                {
                    [LAST_12_MONTHS]: {
                        id: LAST_12_MONTHS,
                        name: i18n.t('Last 12 months'),
                    },
                }
            )
        )

        // Set User org unit for the stage org unit dimension
        dispatch(
            acSetUiItems(
                { dimensionId: orgUnitId, itemIds: [USER_ORG_UNIT] },
                {
                    [USER_ORG_UNIT]: {
                        id: USER_ORG_UNIT,
                        name: i18n.t('User organisation unit'),
                    },
                }
            )
        )

        // Expand the relevant stage card in the sidebar (collapse other stages)
        const stageCardId = getStageCardId(stageId)
        const nonStageCards = expandedCards.filter(
            (id) => !id.startsWith('STAGE_')
        )
        dispatch(
            acSetUiExpandedCards([
                ...nonStageCards,
                ACCESSORY_PANEL_TAB_PROGRAM_DATA, // Parent card
                stageCardId, // Only this stage card
            ])
        )

        // Set output type to event and trigger visualization
        dispatch(tSetUiOutput(OUTPUT_TYPE_EVENT))
        dispatch(tSetCurrentFromUi())
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>{i18n.t('Quick start')}</h3>
            <div className={styles.buttonsWrapper}>
                {/* Enrollment quick start */}
                <button
                    type="button"
                    className={styles.quickStartButton}
                    onClick={handleEnrollmentQuickStart}
                    data-test="quick-start-enrollment"
                >
                    <span className={styles.buttonContent}>
                        <span className={styles.buttonText}>
                            {i18n.t('Enrollments from last 12 months')}
                        </span>
                    </span>
                </button>

                {/* Stage quick starts */}
                {program.programStages.map((stage) => (
                    <button
                        key={stage.id}
                        type="button"
                        className={styles.quickStartButton}
                        onClick={() => handleStageQuickStart(stage)}
                        data-test={`quick-start-stage-${stage.id}`}
                    >
                        <span className={styles.buttonContent}>
                            <span className={styles.buttonText}>
                                {i18n.t(
                                    '{{stageName}} events from last 12 months',
                                    {
                                        stageName: stage.name,
                                    }
                                )}
                            </span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}

QuickStartSection.propTypes = {}

export default QuickStartSection
