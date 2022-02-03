import PropTypes from 'prop-types'
import React, { createContext, useMemo, useContext } from 'react'
import { useSelector, useStore } from 'react-redux'
import {
    DIMENSION_TYPES_PROGRAM,
    DIMENSION_TYPES_YOURS,
} from '../../modules/dimensionTypes.js'
import { sGetCurrent } from '../../reducers/current.js'

const SelectedDimensionsContext = createContext({
    counts: {
        your: 0,
        program: 0,
    },
    getIsDimensionSelected: () => {
        throw new Error('Context not initialized correctly')
    },
})

export const SelectedDimensionsProvider = ({ children }) => {
    const current = useSelector(sGetCurrent)
    const store = useStore()

    const providerValue = useMemo(() => {
        const allSelectedIds = current
            ? [
                  ...current.columns,
                  ...current.filters,
                  // Rows not used now, but will be later
                  ...current.rows,
              ].map(({ dimension }) => dimension)
            : []
        const allSelectedIdsSet = new Set(allSelectedIds)
        const counts = allSelectedIds.reduce(
            (acc, id) => {
                /*
                 * Access metadata this way to prevent this component
                 * and its hook consumers to re-render every time
                 * something changes in the metadata store
                 */
                const { metadata } = store.getState()
                const { dimensionType } = metadata[id]

                if (DIMENSION_TYPES_PROGRAM.has(dimensionType)) {
                    acc.program += 1
                }

                if (DIMENSION_TYPES_YOURS.has(dimensionType)) {
                    acc.your += 1
                }
                return acc
            },
            { program: 0, your: 0 }
        )

        return {
            counts,
            getIsDimensionSelected: (id) => allSelectedIdsSet.has(id),
        }
    }, [current])

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
