import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { sGetUiLayout, sGetUiInputType } from '../../reducers/ui.js'
import { extractDimensionIdParts } from '../../modules/dimensionId.js'

/**
 * Hook to count dimensions for a specific data source from the layout
 * @param {Object} dataSource - The data source (program or tracked entity type)
 * @returns {Object} counts - { enrollment, event, person, programIndicators, trackedEntity, stages }
 */
export const useDataSourceDimensionCounts = (dataSource) => {
    const layout = useSelector(sGetUiLayout)
    const inputType = useSelector(sGetUiInputType)

    return useMemo(() => {
        const counts = {
            enrollment: 0,
            event: 0,
            person: 0,
            programIndicators: 0,
            trackedEntity: 0,
            stages: {},
        }

        if (!dataSource?.id) {
            return counts
        }

        // Get all dimension IDs from layout (columns + filters)
        const allDimensionIds = [
            ...(layout.columns || []),
            ...(layout.filters || []),
        ]

        const { id: dataSourceId, dataSourceType, programStages } = dataSource

        // Initialize stage counts
        if (programStages) {
            programStages.forEach((stage) => {
                counts.stages[stage.id] = 0
            })
        }

        allDimensionIds.forEach((dimensionId) => {
            const { programId, programStageId } = extractDimensionIdParts(
                dimensionId,
                inputType
            )

            if (dataSourceType === 'PROGRAM') {
                // Check if this dimension belongs to this program
                if (programId === dataSourceId) {
                    // This is a program-level dimension (enrollment, person, etc.)
                    // For simplicity, count it as enrollment
                    counts.enrollment += 1
                }

                // Check if this dimension belongs to one of the program's stages
                if (programStageId && programStages) {
                    const stage = programStages.find(
                        (s) => s.id === programStageId
                    )
                    if (stage) {
                        counts.event += 1
                        counts.stages[programStageId] =
                            (counts.stages[programStageId] || 0) + 1
                    }
                }
            } else if (dataSourceType === 'TRACKED_ENTITY_TYPE') {
                // For TET, count dimensions that don't have program/stage prefixes
                // and belong to this tracked entity type
                if (!programId && !programStageId) {
                    counts.trackedEntity += 1
                }
            }
        })

        return counts
    }, [layout, inputType, dataSource])
}
