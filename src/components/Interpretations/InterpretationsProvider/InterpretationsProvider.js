import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { createContext, useState } from 'react'
import { InterpretationsManager } from './InterpretationsManager.js'

export const IntepretationsContext = createContext(null)

export const InterpretationsProvider = ({ currentUser, children }) => {
    const dataEngine = useDataEngine()
    const [interpretationsManager] = useState(
        () => new InterpretationsManager(dataEngine, currentUser)
    )
    return (
        <IntepretationsContext.Provider value={interpretationsManager}>
            {children}
        </IntepretationsContext.Provider>
    )
}

InterpretationsProvider.propTypes = {
    children: PropTypes.node,
    currentUser: PropTypes.object,
}
