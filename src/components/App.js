import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataEngine, useDataMutation } from '@dhis2/app-runtime'
import { CssVariables } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import { connect, useDispatch } from 'react-redux'
import { acSetCurrent } from '../actions/current.js'
import {
    acClearAll,
    acClearLoadError,
    acSetLoadError,
    acSetVisualizationLoading,
} from '../actions/loader.js'
import { acAddMetadata, tSetInitMetadata } from '../actions/metadata.js'
import { tAddSettings } from '../actions/settings.js'
import {
    acSetUiFromVisualization,
    acAddParentGraphMap,
    acSetShowExpandedLayoutPanel,
} from '../actions/ui.js'
import { acSetUser } from '../actions/user.js'
import { acSetVisualization } from '../actions/visualization.js'
import { EVENT_TYPE } from '../modules/dataStatistics.js'
import {
    emptyResponseError,
    genericServerError,
    visualizationNotFoundError,
} from '../modules/error.js'
import history from '../modules/history.js'
import { getParentGraphMapFromVisualization } from '../modules/ui.js'
import { transformVisualization } from '../modules/visualization.js'
import { sGetCurrent } from '../reducers/current.js'
import {
    sGetIsVisualizationLoading,
    sGetLoadError,
} from '../reducers/loader.js'
import { sGetUiShowDetailsPanel } from '../reducers/ui.js'
import classes from './App.module.css'
import { default as DetailsPanel } from './DetailsPanel/DetailsPanel.js'
import { default as DialogManager } from './Dialogs/DialogManager.js'
import DndContext from './DndContext.js'
import { InterpretationModal } from './InterpretationModal/index.js'
import Layout from './Layout/Layout.js'
import LoadingMask from './LoadingMask/LoadingMask.js'
import { MainSidebar } from './MainSidebar/index.js'
import { default as TitleBar } from './TitleBar/TitleBar.js'
import { Toolbar } from './Toolbar/Toolbar.js'
import StartScreen from './Visualization/StartScreen.js'
import { Visualization } from './Visualization/Visualization.js'

const visualizationQuery = {
    eventVisualization: {
        resource: 'eventVisualizations',
        id: ({ id }) => id,
        // TODO: check if this list is what we need/want (copied from old ER)
        params: {
            fields: [
                '*',
                'columns[dimension,dimensionType,filter,programStage[id],optionSet[id],valueType,legendSet[id],items[dimensionItem~rename(id)]]',
                'rows[dimension,dimensionType,filter,programStage[id],optionSet[id],valueType,legendSet[id],items[dimensionItem~rename(id)]]',
                'filters[dimension,dimensionType,filter,programStage[id],optionSet[id],valueType,legendSet[id],items[dimensionItem~rename(id)]]',
                'program[id,programType,displayName~rename(name),displayEnrollmentDateLabel,displayIncidentDateLabel,displayIncidentDate,programStages[id,displayName~rename(name),repeatable]]',
                'programStage[id,displayName~rename(name),displayExecutionDateLabel,displayDueDateLabel,hideDueDate,repeatable]',
                'access,user[displayName,userCredentials[username]]',
                'href',
                'dataElementDimensions[legendSet[id,name]',
                'dataElement[id,name]]',
                '!interpretations',
                '!userGroupAccesses',
                '!publicAccess',
                '!displayDescription',
                '!rewindRelativePeriods',
                '!userOrganisationUnit',
                '!userOrganisationUnitChildren',
                '!userOrganisationUnitGrandChildren',
                '!externalAccess',
                '!relativePeriods',
                '!columnDimensions',
                '!rowDimensions',
                '!filterDimensions',
                '!organisationUnitGroups',
                '!itemOrganisationUnitGroups',
                '!indicators',
                '!dataElements',
                '!dataElementOperands',
                '!dataElementGroups',
                '!dataSets',
                '!periods',
                '!organisationUnitLevels',
                '!organisationUnits',
            ],
        },
    },
}

const dataStatisticsMutation = {
    resource: 'dataStatistics',
    params: ({ id }) => ({
        favorite: id,
        eventType: EVENT_TYPE,
    }),
    type: 'create',
}

const App = ({
    initialLocation,
    current,
    addMetadata,
    addParentGraphMap,
    addSettings,
    clearAll,
    clearLoadError,
    error,
    isLoading,
    setCurrent,
    setInitMetadata,
    setLoadError,
    setVisualization,
    setVisualizationLoading,
    setUiFromVisualization,
    setUser,
    showDetailsPanel,
}) => {
    const dataEngine = useDataEngine()
    const [data, setData] = useState()
    const [fetchError, setFetchError] = useState()
    const { currentUser, userSettings } = useCachedDataQuery()
    const [previousLocation, setPreviousLocation] = useState(
        initialLocation.pathname
    )
    const [initialLoadIsComplete, setInitialLoadIsComplete] = useState(false)
    const [postDataStatistics] = useDataMutation(dataStatisticsMutation)
    const dispatch = useDispatch()

    const interpretationsUnitRef = useRef()
    const onInterpretationUpdate = () => {
        interpretationsUnitRef.current.refresh()
    }

    useEffect(() => {
        if (!error && fetchError) {
            if (fetchError.details?.httpStatusCode === 404) {
                clearAll(visualizationNotFoundError())
            } else {
                clearAll(fetchError.details.message || genericServerError())
            }
        }
    }, [error, fetchError])

    const parseLocation = (location) => {
        const pathParts = location.pathname.slice(1).split('/')
        const id = pathParts[0]
        const interpretationId = pathParts[2]
        return { id, interpretationId }
    }

    const loadVisualization = async (location) => {
        setVisualizationLoading(true)
        const isExisting = location.pathname.length > 1
        if (isExisting) {
            // /currentAnalyticalObject
            // /${id}/
            // /${id}/interpretation/${interpretationId}
            const { id } = parseLocation(location)

            try {
                const data = await dataEngine.query(visualizationQuery, {
                    variables: { id },
                })

                setData(data)
            } catch (error) {
                setFetchError(error)
            }
        } else {
            clearAll()
            //const digitGroupSeparator = sGetSettingsDigitGroupSeparator(getState())
            setVisualizationLoading(false)
        }

        dispatch(acSetShowExpandedLayoutPanel(!isExisting))
        setInitialLoadIsComplete(true)
        setPreviousLocation(location.pathname)
    }

    const onResponseReceived = (response) => {
        const itemsMetadata = Object.entries(response.metaData.items).reduce(
            (obj, [id, item]) => {
                obj[id] = {
                    id,
                    name: item.name || item.displayName,
                    displayName: item.displayName,
                    dimensionItemType: item.dimensionItemType, // TODO needed?
                    code: item.code,
                }

                return obj
            },
            {}
        )

        addMetadata(itemsMetadata)
        setVisualizationLoading(false)

        if (!response.rows?.length) {
            setLoadError(emptyResponseError())
        }
    }

    useEffect(() => {
        const onMount = async () => {
            await addSettings(userSettings)

            setUser({
                ...currentUser,
                uiLocale: userSettings.uiLocale,
            })

            setInitMetadata()

            loadVisualization(initialLocation)
        }

        onMount()

        const unlisten = history.listen(({ location }) => {
            const isSaving = location.state?.isSaving
            const isOpening = location.state?.isOpening
            const isResetting = location.state?.isResetting
            const isModalOpening = location.state?.isModalOpening
            const isModalClosing = location.state?.isModalClosing
            const isValidLocationChange =
                previousLocation !== location.pathname &&
                !isModalOpening &&
                !isModalClosing

            // TODO navigation confirm dialog

            if (isSaving || isOpening || isResetting || isValidLocationChange) {
                loadVisualization(location)
            }
        })

        return () => unlisten && unlisten()
    }, [])

    useEffect(() => {
        if (data?.eventVisualization) {
            const { program, programStage } = data.eventVisualization
            const visualization = transformVisualization(
                data.eventVisualization
            )
            const metadata = {
                [program.id]: program,
                [programStage.id]: programStage,
            }

            addParentGraphMap(getParentGraphMapFromVisualization(visualization))
            setVisualization(visualization)
            setCurrent(visualization)
            setUiFromVisualization(visualization, metadata)
            postDataStatistics({ id: visualization.id })
            clearLoadError()
        }
    }, [data])

    return (
        <div
            className={cx(
                classes.eventReportsApp,
                classes.flexCt,
                classes.flexDirCol
            )}
        >
            <Toolbar />
            <div
                className={cx(
                    classes.sectionMain,
                    classes.flexGrow1,
                    classes.flexCt
                )}
            >
                <DndContext>
                    <MainSidebar />
                    <DialogManager />
                    <div
                        className={cx(
                            classes.mainCenter,
                            classes.flexGrow1,
                            classes.flexBasis0,
                            classes.flexCt,
                            classes.flexDirCol
                        )}
                    >
                        <div className={classes.mainCenterLayout}>
                            <Layout />
                        </div>
                        <div className={classes.mainCenterTitlebar}>
                            <TitleBar />
                        </div>
                        <div
                            className={cx(
                                classes.mainCenterCanvas,
                                classes.flexGrow1
                            )}
                        >
                            {(initialLoadIsComplete &&
                                !current &&
                                !isLoading) ||
                            error ? (
                                <StartScreen />
                            ) : (
                                <>
                                    {isLoading && (
                                        <div className={classes.loadingCover}>
                                            <LoadingMask />
                                        </div>
                                    )}
                                    {current && (
                                        <Visualization
                                            visualization={current}
                                            onResponseReceived={
                                                onResponseReceived
                                            }
                                        />
                                    )}
                                    {current && (
                                        <InterpretationModal
                                            onInterpretationUpdate={
                                                onInterpretationUpdate
                                            }
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </DndContext>
                <div
                    className={cx(classes.mainRight, {
                        [classes.hidden]: !showDetailsPanel,
                    })}
                >
                    {showDetailsPanel && current && (
                        <DetailsPanel
                            interpretationsUnitRef={interpretationsUnitRef}
                        />
                    )}
                </div>
            </div>
            <CssVariables colors spacers theme />
        </div>
    )
}

const mapStateToProps = (state) => ({
    current: sGetCurrent(state),
    isLoading: sGetIsVisualizationLoading(state),
    showDetailsPanel: sGetUiShowDetailsPanel(state),
    error: sGetLoadError(state),
})

const mapDispatchToProps = {
    addMetadata: acAddMetadata,
    addParentGraphMap: acAddParentGraphMap,
    addSettings: tAddSettings,
    clearAll: acClearAll,
    clearLoadError: acClearLoadError,
    setCurrent: acSetCurrent,
    setInitMetadata: tSetInitMetadata,
    setVisualization: acSetVisualization,
    setUser: acSetUser,
    setUiFromVisualization: acSetUiFromVisualization,
    setVisualizationLoading: acSetVisualizationLoading,
    setLoadError: acSetLoadError,
}

App.propTypes = {
    addMetadata: PropTypes.func,
    addParentGraphMap: PropTypes.func,
    addSettings: PropTypes.func,
    clearAll: PropTypes.func,
    clearLoadError: PropTypes.func,
    current: PropTypes.object,
    error: PropTypes.object,
    initialLocation: PropTypes.object,
    isLoading: PropTypes.bool,
    setCurrent: PropTypes.func,
    setInitMetadata: PropTypes.func,
    setLoadError: PropTypes.func,
    setUiFromVisualization: PropTypes.func,
    setUser: PropTypes.func,
    setVisualization: PropTypes.func,
    setVisualizationLoading: PropTypes.func,
    showDetailsPanel: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
