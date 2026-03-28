import { DIMENSION_ID_ORGUNIT, USER_ORG_UNIT } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { IconLaunch16 } from '@dhis2/ui'
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
            <h3 className={styles.title}>
                <span className={styles.titleIcon}>
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clip-path="url(#clip0_3616_76)">
                            <path
                                d="M10.5479 0H10.6874C11.4119 0 11.9999 0.588 11.9999 1.3125V1.452C11.9993 3.19227 11.3076 4.86106 10.0769 6.0915L9.73343 6.43575C9.49793 6.67125 9.25268 6.89775 8.99918 7.11375V9.519C8.99918 9.975 8.76293 10.398 8.37443 10.6365L6.29393 11.9167C6.22084 11.9619 6.13837 11.9897 6.05285 11.998C5.96733 12.0063 5.88104 11.9949 5.80063 11.9646C5.72022 11.9343 5.64783 11.886 5.58903 11.8234C5.53022 11.7607 5.48657 11.6854 5.46143 11.6032L4.74593 9.27675C4.70727 9.24841 4.67091 9.21706 4.63718 9.183L2.81543 7.362C2.78164 7.32824 2.75054 7.29188 2.72243 7.25325L0.395933 6.53775C0.313771 6.51261 0.23847 6.46896 0.175824 6.41016C0.113178 6.35135 0.0648556 6.27896 0.0345753 6.19855C0.00429507 6.11814 -0.00713643 6.03186 0.00116028 5.94634C0.009457 5.86082 0.0372608 5.77834 0.0824327 5.70525L1.36493 3.62475C1.48226 3.43377 1.64659 3.27606 1.84223 3.16669C2.03788 3.05731 2.25829 2.99992 2.48243 3H4.88543C5.10143 2.7465 5.32793 2.50125 5.56343 2.26575L5.90768 1.92225C6.51701 1.31282 7.24043 0.829396 8.03661 0.499574C8.83279 0.169752 9.68614 -4.48957e-06 10.5479 0ZM6.70343 2.71725H6.70193L6.35843 3.06075C5.78843 3.63075 5.28068 4.25925 4.84343 4.93575L3.71843 6.6735L5.32568 8.28075L7.06343 7.15575C7.73993 6.7185 8.36843 6.21075 8.93768 5.64075L9.28193 5.29725C9.78683 4.79226 10.1873 4.19276 10.4605 3.53299C10.7337 2.87322 10.8743 2.1661 10.8742 1.452V1.3125C10.8742 1.26277 10.8544 1.21508 10.8193 1.17992C10.7841 1.14475 10.7364 1.125 10.6867 1.125H10.5472C9.1055 1.12513 7.72289 1.69786 6.70343 2.71725ZM2.66993 10.92C2.12093 11.469 0.919433 11.7038 0.416183 11.781C0.389052 11.7854 0.361276 11.7833 0.335092 11.775C0.308908 11.7666 0.285048 11.7522 0.265433 11.733C0.246189 11.7134 0.231819 11.6895 0.223482 11.6633C0.215145 11.6372 0.213073 11.6094 0.217433 11.5822C0.294683 11.079 0.529433 9.8775 1.07993 9.33C1.18172 9.21462 1.30606 9.12131 1.4453 9.05584C1.58453 8.99036 1.7357 8.9541 1.88949 8.94929C2.04328 8.94448 2.19642 8.97123 2.33947 9.02788C2.48252 9.08453 2.61245 9.16989 2.72125 9.27868C2.83005 9.38748 2.9154 9.51741 2.97205 9.66046C3.0287 9.80352 3.05545 9.95666 3.05064 10.1104C3.04584 10.2642 3.00957 10.4154 2.9441 10.5546C2.87862 10.6939 2.78531 10.8182 2.66993 10.92ZM7.87493 7.96875C7.80893 8.01375 7.74218 8.05725 7.67543 8.1L5.91293 9.24075L6.32393 10.578L7.78568 9.678C7.81297 9.66121 7.8355 9.63772 7.85112 9.60975C7.86674 9.58179 7.87494 9.55028 7.87493 9.51825V7.96875ZM2.75843 6.087L3.89993 4.3245C3.94343 4.257 3.98768 4.191 4.03193 4.125H2.48168C2.44965 4.12499 2.41815 4.13319 2.39018 4.14881C2.36221 4.16444 2.33872 4.18697 2.32193 4.21425L1.42193 5.67675L2.75843 6.087ZM8.99993 3.75C8.99993 3.94891 8.92091 4.13968 8.78026 4.28033C8.63961 4.42098 8.44885 4.5 8.24993 4.5C8.05102 4.5 7.86026 4.42098 7.7196 4.28033C7.57895 4.13968 7.49993 3.94891 7.49993 3.75C7.49993 3.55109 7.57895 3.36032 7.7196 3.21967C7.86026 3.07902 8.05102 3 8.24993 3C8.44885 3 8.63961 3.07902 8.78026 3.21967C8.92091 3.36032 8.99993 3.55109 8.99993 3.75Z"
                                fill="#7C5095"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_3616_76">
                                <rect width="12" height="12" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </span>
                {i18n.t('Quick start templates')}
            </h3>
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
