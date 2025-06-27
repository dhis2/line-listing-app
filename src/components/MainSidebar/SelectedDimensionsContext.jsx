import {
    DIMENSION_ID_ORGUNIT,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
} from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React, { createContext, useMemo, useContext } from 'react'
import { useSelector, useStore } from 'react-redux'
import {
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
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
    },
    getIsDimensionSelected: () => {
        throw new Error('Context not initialized correctly')
    },
})

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
                const { dimensionType } = metadata[id] ?? {}

                const { dimensionId } = extractDimensionIdParts(
                    id,
                    selectedInputType
                )

                if (
                    dimensionType === DIMENSION_TYPE_PROGRAM_ATTRIBUTE &&
                    selectedInputType === OUTPUT_TYPE_TRACKED_ENTITY
                ) {
                    acc.trackedEntity += 1
                } else if (
                    DIMENSION_TYPES_PROGRAM.has(dimensionType) ||
                    [
                        DIMENSION_ID_EVENT_STATUS,
                        DIMENSION_ID_PROGRAM_STATUS,
                        ...Object.keys(getTimeDimensions()),
                    ].includes(dimensionId)
                ) {
                    acc.program += 1
                } else if (dimensionId === DIMENSION_ID_ORGUNIT) {
                    if (
                        selectedInputType !== OUTPUT_TYPE_TRACKED_ENTITY ||
                        id !== DIMENSION_ID_ORGUNIT
                    ) {
                        // exclude "ou" which is a global dimension, but add count for program org units
                        acc.program += 1
                    }
                } else if (DIMENSION_TYPES_YOURS.has(dimensionType)) {
                    acc.your += 1
                }
                return acc
            },
            { program: 0, your: 0, trackedEntity: 0 }
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
