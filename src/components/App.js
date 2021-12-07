import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { CssVariables } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { acClearCurrent, acSetCurrent } from '../actions/current.js'
import { tSetDimensions } from '../actions/dimensions.js'
import { tSetLegendSets } from '../actions/legendSets.js'
import { acSetVisualizationLoading } from '../actions/loader.js'
import { acAddMetadata, tSetInitMetadata } from '../actions/metadata.js'
import { tAddSettings } from '../actions/settings.js'
import {
    tClearUi,
    acSetUiFromVisualization,
    acAddParentGraphMap,
} from '../actions/ui.js'
import { acSetUser } from '../actions/user.js'
import {
    acClearVisualization,
    acSetVisualization,
} from '../actions/visualization.js'
import { EVENT_TYPE } from '../modules/dataStatistics.js'
import history from '../modules/history.js'
import { getParentGraphMapFromVisualization } from '../modules/ui.js'
import { sGetCurrent } from '../reducers/current.js'
import { sGetIsVisualizationLoading } from '../reducers/loader.js'
import { sGetUiShowRightSidebar } from '../reducers/ui.js'
import classes from './App.module.css'
import { default as DetailsPanel } from './DetailsPanel/DetailsPanel.js'
import { default as DialogManager } from './Dialogs/DialogManager.js'
import DndContext from './DndContext.js'
import { InterpretationModal } from './InterpretationModal/index.js'
import Layout from './Layout/Layout.js'
import LoadingMask from './LoadingMask/LoadingMask.js'
import { default as TitleBar } from './TitleBar/TitleBar.js'
import { Toolbar } from './Toolbar/Toolbar.js'
import StartScreen from './Visualization/StartScreen.js'
import { Visualization } from './Visualization/Visualization.js'

const visualizationQuery = {
    eventReport: {
        resource: 'eventReports',
        id: ({ id }) => id,
        // TODO check if this list is what we need/want (copied from old ER)
        params: {
            fields: '*,columns[dimension,filter,programStage[id],legendSet[id],items[dimensionItem~rename(id)]],rows[dimension,filter,programStage[id],legendSet[id],items[dimensionItem~rename(id)]],filters[dimension,filter,programStage[id],legendSet[id],items[dimensionItem~rename(id)]],program[id,displayName~rename(name),enrollmentDateLabel,incidentDateLabel],programStage[id,displayName~rename(name),executionDateLabel],access,user[displayName,userCredentials[username]],href,!interpretations,!userGroupAccesses,!publicAccess,!displayDescription,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!organisationUnitGroups,!itemOrganisationUnitGroups,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,dataElementDimensions[legendSet[id,name],dataElement[id,name]]',
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
    location,
    current,
    addMetadata,
    addParentGraphMap,
    addSettings,
    clearCurrent,
    clearVisualization,
    clearUi,
    isLoading,
    setCurrent,
    setDimensions,
    setInitMetadata,
    setLegendSets,
    setVisualization,
    setVisualizationLoading,
    setUiFromVisualization,
    setUser,
    showRightSidebar,
    userSettings,
}) => {
    const [previousLocation, setPreviousLocation] = useState(null)
    const [initialLoadIsComplete, setInitialLoadIsComplete] = useState(false)
    const { data, refetch } = useDataQuery(visualizationQuery, {
        lazy: true,
    })
    const [postDataStatistics] = useDataMutation(dataStatisticsMutation)
    const { d2 } = useD2()
    const interpretationsUnitRef = useRef()
    const onInterpretationUpdate = () => {
        interpretationsUnitRef.current.refresh()
    }

    const needsRefetch = (location) => {
        if (!previousLocation) {
            return true
        }

        const id = location.pathname.slice(1).split('/')[0]
        const prevId = previousLocation.slice(1).split('/')[0]

        if (id !== prevId || previousLocation === location.pathname) {
            return true
        }

        return false
    }

    const parseLocation = (location) => {
        const pathParts = location.pathname.slice(1).split('/')
        const id = pathParts[0]
        const interpretationId = pathParts[2]
        return { id, interpretationId }
    }

    const loadVisualization = (location) => {
        setVisualizationLoading(true)
        if (location.pathname.length > 1) {
            // /currentAnalyticalObject
            // /${id}/
            // /${id}/interpretation/${interpretationId}
            const { id } = parseLocation(location)

            if (needsRefetch(location)) {
                refetch({ id })
            }
        } else {
            clearCurrent()
            clearVisualization()
            //const digitGroupSeparator = sGetSettingsDigitGroupSeparator(getState())
            clearUi()
            setVisualizationLoading(false)
        }

        setInitialLoadIsComplete(true)
        setPreviousLocation(location.pathname)
    }

    const onResponseReceived = (response) => {
        setVisualizationLoading(false)
        const metadata = Object.entries(response.metaData.items).reduce(
            (obj, [id, item]) => {
                obj[id] = {
                    id,
                    name: item.name || item.displayName,
                    displayName: item.displayName,
                    dimensionItemType: item.dimensionItemType, // TODO needed?
                }

                return obj
            },
            {}
        )

        addMetadata(metadata)
    }

    useEffect(() => {
        const onMount = async () => {
            await addSettings(userSettings)
            setUser(d2.currentUser)
            await setLegendSets()
            await setDimensions()

            setInitMetadata()

            loadVisualization(location)
        }

        onMount()

        const unlisten = history.listen(({ location }) => {
            const isSaving = location.state?.isSaving
            const isOpening = location.state?.isOpening
            const isResetting = location.state?.isResetting

            // TODO navigation confirm dialog

            if (
                isSaving ||
                isOpening ||
                isResetting ||
                previousLocation !== location.pathname
            ) {
                loadVisualization(location)
            }
        })

        return () => unlisten && unlisten()
    }, [])

    useEffect(() => {
        const visualization = data?.eventReport

        if (visualization) {
            addParentGraphMap(getParentGraphMapFromVisualization(visualization))
            setVisualization(visualization)
            setCurrent(visualization)
            setUiFromVisualization(visualization)
            postDataStatistics({ id: visualization.id })
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
                    <div className={classes.mainLeft}>
                        <span style={{ color: 'red' }}>
                            {'dimension panel'}
                        </span>
                        <DialogManager />
                    </div>
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
                            {initialLoadIsComplete &&
                                (!current && !isLoading ? (
                                    <StartScreen />
                                ) : (
                                    <>
                                        {isLoading && (
                                            <div
                                                className={classes.loadingCover}
                                            >
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
                                ))}
                        </div>
                    </div>
                </DndContext>
                {showRightSidebar && current && (
                    <div className={classes.mainRight}>
                        <DetailsPanel
                            interpretationsUnitRef={interpretationsUnitRef}
                        />
                    </div>
                )}
            </div>
            <CssVariables colors spacers />
        </div>
    )
}

const mapStateToProps = (state) => ({
    current: sGetCurrent(state),
    isLoading: sGetIsVisualizationLoading(state),
    showRightSidebar: sGetUiShowRightSidebar(state),
})

const mapDispatchToProps = {
    addMetadata: acAddMetadata,
    addParentGraphMap: acAddParentGraphMap,
    addSettings: tAddSettings,
    clearVisualization: acClearVisualization,
    clearCurrent: acClearCurrent,
    clearUi: tClearUi,
    setCurrent: acSetCurrent,
    setDimensions: tSetDimensions,
    setInitMetadata: tSetInitMetadata,
    setLegendSets: tSetLegendSets,
    setVisualization: acSetVisualization,
    setUser: acSetUser,
    setUiFromVisualization: acSetUiFromVisualization,
    setVisualizationLoading: acSetVisualizationLoading,
}

App.propTypes = {
    addMetadata: PropTypes.func,
    addParentGraphMap: PropTypes.func,
    addSettings: PropTypes.func,
    clearCurrent: PropTypes.func,
    clearUi: PropTypes.func,
    clearVisualization: PropTypes.func,
    current: PropTypes.object,
    isLoading: PropTypes.bool,
    location: PropTypes.object,
    setCurrent: PropTypes.func,
    setDimensions: PropTypes.func,
    setInitMetadata: PropTypes.func,
    setLegendSets: PropTypes.func,
    setUiFromVisualization: PropTypes.func,
    setUser: PropTypes.func,
    setVisualization: PropTypes.func,
    setVisualizationLoading: PropTypes.func,
    showRightSidebar: PropTypes.bool,
    userSettings: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
