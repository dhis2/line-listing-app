import {
    DIMENSION_ID_ORGUNIT,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
} from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React, { createContext, useMemo, useContext } from 'react'
import { useSelector, useStore } from 'react-redux'
import {
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_REGISTRATION_OU,
    DIMENSION_ID_REGISTRATION_DATE,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_TYPES_PROGRAM,
    DIMENSION_TYPES_YOURS,
} from '../../modules/dimensionConstants.js'
import { extractDimensionIdParts } from '../../modules/dimensionId.js'
import { getTimeDimensions } from '../../modules/timeDimensions.js'
import { OUTPUT_TYPE_TRACKED_ENTITY } from '../../modules/visualization.js'
import { sGetUiInputType, sGetUiLayout } from '../../reducers/ui.js'

const SelectedDimensionsContext = createContext({
    counts: {
        your: 0,
        program: 0,
        trackedEntity: 0,
        enrollment: 0,
        event: 0,
        person: 0,
        programIndicators: 0,
        metadata: 0,
        stages: {},
    },
    getIsDimensionSelected: () => {
        throw new Error('Context not initialized correctly')
    },
})

// Enrollment-specific dimension IDs (without stage)
const ENROLLMENT_DIMENSION_IDS = new Set([
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_PROGRAM_STATUS,
])

// Event/stage-specific dimension IDs
const EVENT_DIMENSION_IDS = new Set([
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_EVENT_STATUS,
])

// Person registration dimension IDs (full IDs including prefix)
const PERSON_DIMENSION_FULL_IDS = new Set([
    DIMENSION_ID_REGISTRATION_OU,
    DIMENSION_ID_REGISTRATION_DATE,
])

// Metadata dimension IDs
const METADATA_DIMENSION_IDS = new Set([
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
])

export const SelectedDimensionsProvider = ({ children }) => {
    const layout = useSelector(sGetUiLayout)
    const selectedInputType = useSelector(sGetUiInputType)
    const store = useStore()

    const providerValue = useMemo(() => {
        const allSelectedIds = [
            ...layout.columns,
            ...layout.filters,
            // Rows not used now, but will be later
            //   ...layout.rows,
        ]

        /*
         * Access metadata this way to prevent this component
         * and its hook consumers to re-render every time
         * something changes in the metadata store
         */
        const { metadata } = store.getState()

        const allSelectedIdsSet = new Set(allSelectedIds)
        const counts = allSelectedIds.reduce(
            (acc, id) => {
                const dimensionMetadata = metadata[id] ?? {}
                const { dimensionType } = dimensionMetadata

                const { dimensionId, programStageId } = extractDimensionIdParts(
                    id,
                    selectedInputType
                )

                // Tracked entity attributes (for tracked entity output type only)
                if (
                    dimensionType === DIMENSION_TYPE_PROGRAM_ATTRIBUTE &&
                    selectedInputType === OUTPUT_TYPE_TRACKED_ENTITY
                ) {
                    acc.trackedEntity += 1
                }
                // Program indicators
                else if (dimensionType === DIMENSION_TYPE_PROGRAM_INDICATOR) {
                    acc.programIndicators += 1
                    acc.program += 1
                }
                // Metadata dimensions (created by, last updated by)
                else if (METADATA_DIMENSION_IDS.has(dimensionId)) {
                    acc.metadata += 1
                }
                // Person registration dimensions (check full ID, not just dimensionId)
                else if (PERSON_DIMENSION_FULL_IDS.has(id)) {
                    acc.person += 1
                    acc.program += 1
                }
                // Event/stage-specific dimensions (with programStageId)
                else if (programStageId && (
                    EVENT_DIMENSION_IDS.has(dimensionId) ||
                    dimensionType === DIMENSION_TYPE_DATA_ELEMENT ||
                    dimensionType === DIMENSION_TYPE_CATEGORY ||
                    dimensionType === DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET ||
                    dimensionId === DIMENSION_ID_ORGUNIT
                )) {
                    acc.event += 1
                    acc.program += 1
                    // Track per-stage counts
                    if (!acc.stages[programStageId]) {
                        acc.stages[programStageId] = 0
                    }
                    acc.stages[programStageId] += 1
                }
                // Tracked entity attributes (program attributes without stage) - count under person
                else if (
                    dimensionType === DIMENSION_TYPE_PROGRAM_ATTRIBUTE && !programStageId
                ) {
                    acc.person += 1
                    acc.program += 1
                }
                // Enrollment-specific dimensions (enrollment dates/status)
                else if (ENROLLMENT_DIMENSION_IDS.has(dimensionId)) {
                    acc.enrollment += 1
                    acc.program += 1
                }
                // Enrollment org unit (without stage ID)
                else if (dimensionId === DIMENSION_ID_ORGUNIT && !programStageId) {
                    if (
                        selectedInputType !== OUTPUT_TYPE_TRACKED_ENTITY ||
                        id !== DIMENSION_ID_ORGUNIT
                    ) {
                        acc.enrollment += 1
                        acc.program += 1
                    }
                }
                // Other program dimensions
                else if (
                    DIMENSION_TYPES_PROGRAM.has(dimensionType) ||
                    [
                        DIMENSION_ID_EVENT_STATUS,
                        DIMENSION_ID_PROGRAM_STATUS,
                        ...Object.keys(getTimeDimensions()),
                    ].includes(dimensionId)
                ) {
                    acc.program += 1
                }
                // Your dimensions
                else if (DIMENSION_TYPES_YOURS.has(dimensionType)) {
                    acc.your += 1
                }
                return acc
            },
            {
                program: 0,
                your: 0,
                trackedEntity: 0,
                enrollment: 0,
                event: 0,
                person: 0,
                programIndicators: 0,
                metadata: 0,
                stages: {},
            }
        )

        return {
            counts,
            getIsDimensionSelected: (id) => allSelectedIdsSet.has(id),
        }
    }, [layout])

    return (
        <SelectedDimensionsContext.Provider value={providerValue}>
            {children}
        </SelectedDimensionsContext.Provider>
    )
}

SelectedDimensionsProvider.propTypes = {
    children: PropTypes.node,
}

export const useSelectedDimensions = () => useContext(SelectedDimensionsContext)
