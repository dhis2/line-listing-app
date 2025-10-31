import PropTypes from 'prop-types'
import React, { createContext, useState, useContext, useCallback } from 'react'

const MultiSelectionContext = createContext({
    selectedIds: new Set(),
    toggleSelection: () => {
        throw new Error('Context not initialized correctly')
    },
    clearSelection: () => {
        throw new Error('Context not initialized correctly')
    },
    isMultiSelected: () => {
        throw new Error('Context not initialized correctly')
    },
    getSelectedIds: () => {
        throw new Error('Context not initialized correctly')
    },
    getSelectedDimensionsMetadata: () => {
        throw new Error('Context not initialized correctly')
    },
})

export const MultiSelectionProvider = ({ children }) => {
    const [selectedIds, setSelectedIds] = useState(new Set())
    const [dimensionsMetadata, setDimensionsMetadata] = useState({})

    const toggleSelection = useCallback((id, metadata) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
                // Also remove from metadata
                setDimensionsMetadata((prevMeta) => {
                    const nextMeta = { ...prevMeta }
                    delete nextMeta[id]
                    return nextMeta
                })
            } else {
                next.add(id)
                // Store metadata for this dimension
                if (metadata) {
                    setDimensionsMetadata((prevMeta) => ({
                        ...prevMeta,
                        [id]: metadata,
                    }))
                }
            }
            return next
        })
    }, [])

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set())
        setDimensionsMetadata({})
    }, [])

    const isMultiSelected = useCallback(
        (id) => {
            return selectedIds.has(id)
        },
        [selectedIds]
    )

    const getSelectedIds = useCallback(() => {
        return Array.from(selectedIds)
    }, [selectedIds])

    const getSelectedDimensionsMetadata = useCallback(() => {
        return dimensionsMetadata
    }, [dimensionsMetadata])

    const contextValue = {
        selectedIds,
        toggleSelection,
        clearSelection,
        isMultiSelected,
        getSelectedIds,
        getSelectedDimensionsMetadata,
    }

    return (
        <MultiSelectionContext.Provider value={contextValue}>
            {children}
        </MultiSelectionContext.Provider>
    )
}

MultiSelectionProvider.propTypes = {
    children: PropTypes.node,
}

export const useMultiSelection = () => useContext(MultiSelectionContext)
