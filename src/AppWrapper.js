import {
    apiFetchOrganisationUnitLevels,
    CachedDataQueryProvider,
} from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import thunk from 'redux-thunk'
import App from './components/App.js'
import configureStore from './configureStore.js'
import metadataMiddleware from './middleware/metadata.js'
import history from './modules/history.js'
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
            key: ['keyUiLocale', 'keyAnalysisDisplayProperty'],
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
            uiLocale: keyUiLocale,
        },
    }
}

const AppWrapperInner = ({ engine }) => {
    const [ouLevels, setOuLevels] = useState(null)
    const doFetchOuLevelsData = useCallback(async () => {
        const ouLevels = await apiFetchOrganisationUnitLevels(engine)
        return ouLevels
    }, [engine])

    useEffect(() => {
        const doFetch = async () => {
            const ouLevelsData = await doFetchOuLevelsData()
            setOuLevels(ouLevelsData)
        }
        doFetch()
    }, [])

    return (
        <CachedDataQueryProvider
            query={query}
            dataTransformation={providerDataTransformation}
        >
            <App
                initialLocation={history.location}
                ouLevels={ouLevels} // TODO: Unused by App.js?
            />
        </CachedDataQueryProvider>
    )
}

AppWrapperInner.propTypes = {
    engine: PropTypes.object,
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
            <AppWrapperInner engine={engine} />
        </ReduxProvider>
    )
}

export default AppWrapper
