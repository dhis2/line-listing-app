import { CachedDataQueryProvider } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import thunk from 'redux-thunk'
import App from './components/App.js'
import configureStore from './configureStore.js'
import metadataMiddleware from './middleware/metadata.js'
import { systemSettingsKeys } from './modules/systemSettings.js'
import { userSettingsKeys } from './modules/userSettings.js'
import './locales/index.js'

const query = {
    currentUser: {
        resource: 'me',
        params: {
            fields: 'id,username,displayName~rename(name)',
        },
    },
    userSettings: {
        resource: 'userSettings',
        params: {
            key: userSettingsKeys,
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
}

const providerDataTransformation = (rawData) => {
    const { keyAnalysisDisplayProperty, keyUiLocale, ...rest } =
        rawData.userSettings
    return {
        currentUser: rawData.currentUser,
        userSettings: {
            ...rest,
            displayProperty: keyAnalysisDisplayProperty,
            displayNameProperty:
                keyAnalysisDisplayProperty === 'name'
                    ? 'displayName'
                    : 'displayShortName',
        },
        systemSettings: rawData.systemSettings,
        rootOrgUnits: rawData.rootOrgUnits.organisationUnits,
    }
}

/*
 * The redux store is being created here and this should only happen once,
 * because having multiple store instances leads to very unpredictable behaviour.
 * To avoid having multiple stores, ensure this component only renders once,
 * so it should remain stateless and be the app's most outer container.
 */

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
                <App />
            </CachedDataQueryProvider>
        </ReduxProvider>
    )
}

export default AppWrapper
