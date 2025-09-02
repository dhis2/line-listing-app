import { CachedDataQueryProvider, useCachedDataQuery } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import thunk from 'redux-thunk'
import App from './components/App.jsx'
import { InterpretationsProvider as AnalyticsInterpretationsProvider } from './components/Interpretations/InterpretationsProvider/InterpretationsProvider.jsx'
import configureStore from './configureStore.js'
import metadataMiddleware from './middleware/metadata.js'
import { systemSettingsKeys } from './modules/systemSettings.js'
import {
    USER_SETTINGS_DISPLAY_PROPERTY,
    DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY,
} from './modules/userSettings.js'
import './locales/index.js'

const query = {
    currentUser: {
        resource: 'me',
        params: {
            fields: 'id,username,displayName~rename(name),settings,authorities',
        },
    },
    systemSettings: {
        resource: 'systemSettings',
        params: {
            key: systemSettingsKeys,
        },
    },
    rootOrgUnits: {
        resource: 'organisationUnits',
        params: {
            fields: 'id,displayName,name',
            userDataViewFallback: true,
            paging: false,
        },
    },
    orgUnitLevels: {
        resource: 'organisationUnitLevels',
        params: {
            fields: 'id,level',
            paging: false,
        },
    },
}

const providerDataTransformation = ({
    currentUser,
    systemSettings,
    rootOrgUnits,
    orgUnitLevels,
}) => {
    return {
        currentUser: {
            ...currentUser,
            settings: {
                ...currentUser.settings,
                [DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY]:
                    currentUser.settings[USER_SETTINGS_DISPLAY_PROPERTY] ===
                    'name'
                        ? 'displayName'
                        : 'displayShortName',
            },
        },
        systemSettings,
        rootOrgUnits: rootOrgUnits.organisationUnits,
        orgUnitLevels: orgUnitLevels.organisationUnitLevels,
    }
}

/*
 * The redux store is being created here and this should only happen once,
 * because having multiple store instances leads to very unpredictable behaviour.
 * To avoid having multiple stores, ensure this component only renders once,
 * so it should remain stateless and be the app's most outer container.
 */

const InterpretationsProvider = ({ children }) => {
    const { currentUser } = useCachedDataQuery()
    return (
        <AnalyticsInterpretationsProvider currentUser={currentUser}>
            {children}
        </AnalyticsInterpretationsProvider>
    )
}

InterpretationsProvider.propTypes = {
    children: PropTypes.node,
}

const AppWrapper = () => {
    const engine = useDataEngine()
    const store = configureStore([
        thunk.withExtraArgument(engine), // FIXME: Not needed for ER? Pointed out by @edoardo
        metadataMiddleware,
    ])

    if (window.Cypress) {
        window.store = store
    }

    return (
        <ReduxProvider store={store}>
            <CachedDataQueryProvider
                query={query}
                dataTransformation={providerDataTransformation}
            >
                <InterpretationsProvider>
                    <App />
                </InterpretationsProvider>
            </CachedDataQueryProvider>
        </ReduxProvider>
    )
}

export default AppWrapper
