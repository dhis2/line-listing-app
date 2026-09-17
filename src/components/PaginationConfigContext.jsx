import PropTypes from 'prop-types'
import React, { createContext, useContext, useState, useCallback } from 'react'
import {
    getPaginationConfigFromStorage,
    setPaginationConfigToStorage,
    getPageSizeForCard,
} from '../modules/paginationConfig.js'

const PaginationConfigContext = createContext(null)

/**
 * Provider component for pagination configuration
 * Loads from localStorage on mount and persists changes automatically
 */
export const PaginationConfigProvider = ({ children }) => {
    const [config, setConfig] = useState(() => getPaginationConfigFromStorage())

    const updateConfig = useCallback((newConfig) => {
        setConfig(newConfig)
        setPaginationConfigToStorage(newConfig)
    }, [])

    const updateCardPageSize = useCallback((cardType, pageSize) => {
        setConfig((prevConfig) => {
            const newConfig = { ...prevConfig, [cardType]: pageSize }
            setPaginationConfigToStorage(newConfig)
            return newConfig
        })
    }, [])

    const resetToDefaults = useCallback(() => {
        const defaults = getPaginationConfigFromStorage()
        // Clear localStorage and reload defaults
        window.localStorage.removeItem('dhis2.line-listing.paginationConfig')
        const freshDefaults = getPaginationConfigFromStorage()
        setConfig(freshDefaults)
    }, [])

    const value = {
        config,
        updateConfig,
        updateCardPageSize,
        resetToDefaults,
        getPageSize: (cardType) => getPageSizeForCard(config, cardType),
    }

    return (
        <PaginationConfigContext.Provider value={value}>
            {children}
        </PaginationConfigContext.Provider>
    )
}

PaginationConfigProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

/**
 * Hook to access pagination configuration
 * @returns {{
 *   config: Object,
 *   updateConfig: (newConfig: Object) => void,
 *   updateCardPageSize: (cardType: string, pageSize: number) => void,
 *   resetToDefaults: () => void,
 *   getPageSize: (cardType: string) => number
 * }}
 */
export const usePaginationConfig = () => {
    const context = useContext(PaginationConfigContext)
    if (!context) {
        throw new Error(
            'usePaginationConfig must be used within a PaginationConfigProvider'
        )
    }
    return context
}

