import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { CssVariables } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { acClearCurrent, acSetCurrent } from '../actions/current'
import { tSetDimensions } from '../actions/dimensions'
import { acSetVisualizationLoading } from '../actions/loader'
import { acAddMetadata, tSetInitMetadata } from '../actions/metadata'
import { tAddSettings } from '../actions/settings'
import { tClearUi, acSetUiFromVisualization } from '../actions/ui'
import { acSetUser } from '../actions/user'
import {
    acClearVisualization,
    acSetVisualization,
} from '../actions/visualization'
import { EVENT_TYPE } from '../modules/dataStatistics'
import history from '../modules/history'
import { sGetCurrent } from '../reducers/current'
import { sGetIsVisualizationLoading } from '../reducers/loader'
import { sGetVisualization } from '../reducers/visualization'
import { default as AlertBar } from './AlertBar/AlertBar'
import classes from './App.module.css'
import DndContext from './DndContext'
import Layout from './Layout/Layout'
import LoadingMask from './LoadingMask/LoadingMask'
import { default as TitleBar } from './TitleBar/TitleBar'
import { Toolbar } from './Toolbar/Toolbar'
import StartScreen from './Visualization/StartScreen'
import { Visualization } from './Visualization/Visualization'

const visualizationQuery = {
    eventReport: {
        resource: 'eventReports',
        id: ({ id }) => id,
        // TODO check if this list is what we need/want (copied from old ER)
        params: {
            fields: '*,interpretations[*,user[id,displayName,userCredentials[username]],likedBy[id,displayName],comments[id,lastUpdated,text,user[id,displayName,userCredentials[username]]]],columns[dimension,filter,programStage[id],legendSet[id],items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],rows[dimension,filter,programStage[id],legendSet[id],items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],filters[dimension,filter,programStage[id],legendSet[id],items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],program[id,displayName~rename(name),enrollmentDateLabel,incidentDateLabel],programStage[id,displayName~rename(name),executionDateLabel],access,userGroupAccesses,publicAccess,displayDescription,user[displayName,userCredentials[username]],href,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!organisationUnitGroups,!itemOrganisationUnitGroups,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,dataElementDimensions[legendSet[id,name],dataElement[id,name]]',
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
    visualization,
    addMetadata,
    addSettings,
    clearCurrent,
    clearVisualization,
    clearUi,
    isLoading,
    setCurrent,
    setDimensions,
    setInitMetadata,
    setVisualization,
    setVisualizationLoading,
    setUiFromVisualization,
    setUser,
    userSettings,
}) => {
    const [previousLocation, setPreviousLocation] = useState(null)
    const [initialLoadIsComplete, setInitialLoadIsComplete] = useState(false)
    const { data, refetch } = useDataQuery(visualizationQuery, {
        lazy: true,
    })
    const [postDataStatistics] = useDataMutation(dataStatisticsMutation)
    const { d2 } = useD2()

    const needsRefetch = location => {
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

    const parseLocation = location => {
        const pathParts = location.pathname.slice(1).split('/')
        const id = pathParts[0]
        const interpretationId = pathParts[2]
        return { id, interpretationId }
    }

    const loadVisualization = location => {
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

    const onResponseReceived = response => {
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
                                (!visualization && !isLoading ? (
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
                                        {visualization && (
                                            <Visualization
                                                visualization={visualization}
                                                onResponseReceived={
                                                    onResponseReceived
                                                }
                                                setVisualizationLoading={
                                                    setVisualizationLoading
                                                }
                                            />
                                        )}
                                    </>
                                ))}
                        </div>
                    </div>
                </DndContext>
            </div>
            <AlertBar />
            <CssVariables colors spacers />
        </div>
    )
}

const mapStateToProps = state => ({
    current: sGetCurrent(state),
    visualization: sGetVisualization(state),
    isLoading: sGetIsVisualizationLoading(state),
})

const mapDispatchToProps = {
    addMetadata: acAddMetadata,
    addSettings: tAddSettings,
    clearVisualization: acClearVisualization,
    clearCurrent: acClearCurrent,
    clearUi: tClearUi,
    setCurrent: acSetCurrent,
    setDimensions: tSetDimensions,
    setInitMetadata: tSetInitMetadata,
    setVisualization: acSetVisualization,
    setUser: acSetUser,
    setUiFromVisualization: acSetUiFromVisualization,
    setVisualizationLoading: acSetVisualizationLoading,
}

App.propTypes = {
    addMetadata: PropTypes.func,
    addSettings: PropTypes.func,
    clearCurrent: PropTypes.func,
    clearUi: PropTypes.func,
    clearVisualization: PropTypes.func,
    isLoading: PropTypes.bool,
    location: PropTypes.object,
    setCurrent: PropTypes.func,
    setDimensions: PropTypes.func,
    setInitMetadata: PropTypes.func,
    setUiFromVisualization: PropTypes.func,
    setUser: PropTypes.func,
    setVisualization: PropTypes.func,
    setVisualizationLoading: PropTypes.func,
    userSettings: PropTypes.object,
    visualization: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
