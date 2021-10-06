import { apiFetchOrganisationUnitLevels } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { D2Shim } from '@dhis2/app-runtime-adapter-d2'
import React, { useState, useEffect, useCallback } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import thunk from 'redux-thunk'
import App from './components/App'
import UserSettingsProvider, {
    UserSettingsCtx,
} from './components/UserSettingsProvider'
import configureStore from './configureStore'
import metadataMiddleware from './middleware/metadata'
import history from './modules/history'
import './locales'

const AppWrapper = () => {
    const engine = useDataEngine()
    const store = configureStore([
        thunk.withExtraArgument(engine), // FIXME: Not needed for ER? Pointed out by @edoardo
        metadataMiddleware,
    ])

    if (window.Cypress) {
        window.store = store
    }

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

    const d2Config = {
        schemas: [],
    }

    return (
        <ReduxProvider store={store}>
            <UserSettingsProvider>
                <UserSettingsCtx.Consumer>
                    {({ userSettings }) => {
                        return userSettings?.keyUiLocale ? (
                            <D2Shim
                                d2Config={d2Config}
                                i18nRoot="./i18n_old"
                                locale={userSettings.keyUiLocale}
                            >
                                {({ d2 }) => {
                                    if (!d2) {
                                        // TODO: Handle errors in d2 initialization
                                        return null
                                    } else {
                                        return (
                                            <App
                                                location={history.location}
                                                ouLevels={ouLevels}
                                                userSettings={userSettings}
                                            />
                                        )
                                    }
                                }}
                            </D2Shim>
                        ) : null
                    }}
                </UserSettingsCtx.Consumer>
            </UserSettingsProvider>
        </ReduxProvider>
    )
}

export default AppWrapper
