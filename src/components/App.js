import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { acClearCurrent, acSetCurrent } from '../actions/current'
import {
    acClearVisualization,
    acSetVisualization,
} from '../actions/visualization'
import history from '../modules/history'
import { sGetCurrent } from '../reducers/current'
import { sGetVisualization } from '../reducers/visualization'
import classes from './App.module.css'
import { Toolbar } from './Toolbar/Toolbar'

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

const App = ({
    location,
    visualization,
    clearCurrent,
    clearVisualization,
    setCurrent,
    setVisualization,
}) => {
    const [previousLocation, setPreviousLocation] = useState(null)
    const [initialLoadIsComplete, setInitialLoadIsComplete] = useState(false)
    const { data, refetch } = useDataQuery(visualizationQuery, {
        lazy: true,
    })

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
        }

        setInitialLoadIsComplete(true)
        setPreviousLocation(location.pathname)
    }

    useEffect(() => {
        loadVisualization(location)

        const unlisten = history.listen(({ location }) => {
            const isSaving = location.state?.isSaving
            const isOpening = location.state?.isOpening

            if (
                isSaving ||
                isOpening ||
                previousLocation !== location.pathname
            ) {
                loadVisualization(location)
            }
        })

        return () => unlisten && unlisten()
    }, [])

    useEffect(() => {
        if (data?.eventReport) {
            setVisualization(data.eventReport)
            setCurrent(data.eventReport)
        }
    }, [data])

    return (
        <div className={`${classes.eventReportsApp} flex-ct flex-dir-col`}>
            <Toolbar />
            <div
                className={`${classes.sectionMain} ${classes.flexGrow1} ${classes.flexCt}`}
            >
                <div className={classes.mainLeft}>{'dimension panel'}</div>
                <div
                    className={`${classes.mainCenter} ${classes.flexGrow1} ${classes.flexBasis0} ${classes.flexCt} ${classes.flexDirCol}`}
                >
                    <div className={classes.mainCenterLayout}>{'layout'}</div>
                    <div className={classes.mainCenterTitlebar}>
                        {'titlebar'}
                    </div>
                    <div
                        className={`${classes.mainCenterCanvas} ${classes.flexGrow1}`}
                    >
                        {initialLoadIsComplete
                            ? visualization
                                ? visualization.name
                                : 'start screen'
                            : 'loading...'}
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    current: sGetCurrent(state),
    visualization: sGetVisualization(state),
})

const mapDispatchToProps = {
    clearVisualization: acClearVisualization,
    clearCurrent: acClearCurrent,
    setCurrent: acSetCurrent,
    setVisualization: acSetVisualization,
}

App.propTypes = {
    clearCurrent: PropTypes.func,
    clearVisualization: PropTypes.func,
    location: PropTypes.object,
    setCurrent: PropTypes.func,
    setVisualization: PropTypes.func,
    visualization: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
