import {
    useCachedDataQuery,
    convertOuLevelsToUids,
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import { useDataEngine, useDataMutation } from '@dhis2/app-runtime'
import { CssVariables } from '@dhis2/ui'
import cx from 'classnames'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { tSetCurrent, tSetCurrentFromUi } from '../actions/current.js'
import {
    acClearAll,
    acClearLoadError,
    acSetLoadError,
    acSetVisualizationLoading,
} from '../actions/loader.js'
import { acAddMetadata, tSetInitMetadata } from '../actions/metadata.js'
import {
    acSetUiFromVisualization,
    acSetUiDataSorting,
    acClearUiDataSorting,
    acSetUiOpenDimensionModal,
    acAddParentGraphMap,
    acSetShowExpandedLayoutPanel,
    acSetUiAccessoryPanelActiveTab,
} from '../actions/ui.js'
import { acSetVisualization } from '../actions/visualization.js'
import { parseCondition, OPERATOR_IN } from '../modules/conditions.js'
import { EVENT_TYPE } from '../modules/dataStatistics.js'
import {
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
} from '../modules/dimensionConstants.js'
import { formatDimensionId } from '../modules/dimensionId.js'
import {
    analyticsGenerationError,
    analyticsRequestError,
    dataAccessError,
    emptyResponseError,
    eventAccessError,
    genericServerError,
    indicatorError,
    orgUnitAccessError,
    visualizationNotFoundError,
} from '../modules/error.js'
import history from '../modules/history.js'
import {
    getDefaultOuMetadata,
    getDynamicTimeDimensionsMetadata,
} from '../modules/metadata.js'
import { getParentGraphMapFromVisualization } from '../modules/parentGraphMap.js'
import { getProgramDimensions } from '../modules/programDimensions.js'
import { SYSTEM_SETTINGS_DIGIT_GROUP_SEPARATOR } from '../modules/systemSettings.js'
import {
    DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY,
    USER_SETTINGS_DISPLAY_PROPERTY,
} from '../modules/userSettings.js'
import {
    OUTPUT_TYPE_TRACKED_ENTITY,
    getDimensionMetadataFields,
    transformVisualization,
} from '../modules/visualization.js'
import { sGetCurrent } from '../reducers/current.js'
import {
    sGetIsVisualizationLoading,
    sGetLoadError,
} from '../reducers/loader.js'
import { sGetMetadata } from '../reducers/metadata.js'
import { sGetUiShowDetailsPanel } from '../reducers/ui.js'
import classes from './App.module.css'
import { default as DetailsPanel } from './DetailsPanel/DetailsPanel.jsx'
import { default as DialogManager } from './Dialogs/DialogManager.jsx'
import DndContext from './DndContext.jsx'
import { InterpretationModal } from './InterpretationModal/index.js'
import Layout from './Layout/Layout.jsx'
import LoadingMask from './LoadingMask/LoadingMask.jsx'
import { MainSidebar } from './MainSidebar/index.js'
import { default as TitleBar } from './TitleBar/TitleBar.jsx'
import { Toolbar } from './Toolbar/Toolbar.jsx'
import StartScreen from './Visualization/StartScreen.jsx'
import { Visualization } from './Visualization/Visualization.jsx'

const dimensionFields = () =>
    'dimension,dimensionType,filter,program[id],programStage[id],optionSet[id],valueType,legendSet[id],repetition,items[dimensionItem~rename(id)]'

const visualizationQuery = {
    eventVisualization: {
        resource: 'eventVisualizations',
        id: ({ id }) => id,
        // TODO: check if this list is what we need/want (copied from old ER)
        params: ({ nameProp }) => ({
            fields: [
                '*',
                `columns[${dimensionFields}]`,
                `rows[${dimensionFields}]`,
                `filters[${dimensionFields}]`,
                `program[id,programType,${nameProp}~rename(name),displayEnrollmentDateLabel,displayIncidentDateLabel,displayIncidentDate,programStages[id,displayName~rename(name),repeatable]]`,
                'programStage[id,displayName~rename(name),displayExecutionDateLabel,displayDueDateLabel,hideDueDate,repeatable]',
                `programDimensions[id,${nameProp}~rename(name),enrollmentDateLabel,incidentDateLabel,programType,displayIncidentDate,displayEnrollmentDateLabel,displayIncidentDateLabel,programStages[id,${nameProp}~rename(name),repeatable,hideDueDate,displayExecutionDateLabel,displayDueDateLabel]]`,
                'access',
                'href',
                ...getDimensionMetadataFields(),
                'dataElementDimensions[legendSet[id,name],dataElement[id,name]]',
                'legend[set[id,displayName],strategy,style,showKey]',
                'trackedEntityType[id,displayName~rename(name)]',
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
                '!user',
            ],
        }),
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

const optionsQuery = {
    options: {
        resource: 'options',
        params: ({ optionSetId, codes }) => ({
            fields: 'id,code,displayName~rename(name)',
            filter: [
                `optionSet.id:eq:${optionSetId}`,
                `code:in:[${codes.join(',')}]`,
            ],
            paging: false,
        }),
    },
}
const App = () => {
    const dataEngine = useDataEngine()
    const [aboutAOUnitRenderId, setAboutAOUnitRenderId] = useState(1)
    const [interpretationsUnitRenderId, setInterpretationsUnitRenderId] =
        useState(1)
    const [data, setData] = useState()
    const [previousLocation, setPreviousLocation] = useState()
    const [initialLoadIsComplete, setInitialLoadIsComplete] = useState(false)
    const [postDataStatistics] = useDataMutation(dataStatisticsMutation)
    const dispatch = useDispatch()
    const metadata = useSelector(sGetMetadata)
    const current = useSelector(sGetCurrent)
    const isLoading = useSelector(sGetIsVisualizationLoading)
    const error = useSelector(sGetLoadError)
    const showDetailsPanel = useSelector(sGetUiShowDetailsPanel)
    const { systemSettings, rootOrgUnits, orgUnitLevels, currentUser } =
        useCachedDataQuery()
    const digitGroupSeparator =
        systemSettings[SYSTEM_SETTINGS_DIGIT_GROUP_SEPARATOR]

    const onFileMenuAction = () => {
        showDetailsPanel && setAboutAOUnitRenderId(aboutAOUnitRenderId + 1)
    }

    const onInterpretationUpdate = () => {
        showDetailsPanel &&
            setInterpretationsUnitRenderId(interpretationsUnitRenderId + 1)
    }

    const parseLocation = (location) => {
        const pathParts = location.pathname.slice(1).split('/')
        const id = pathParts[0]
        const interpretationId = pathParts[2]
        return { id, interpretationId }
    }

    const loadVisualization = async (location) => {
        dispatch(acSetVisualizationLoading(true))
        const isExisting = location.pathname.length > 1
        if (isExisting) {
            // /currentAnalyticalObject
            // /${id}/
            // /${id}/interpretation/${interpretationId}
            const { id } = parseLocation(location)

            try {
                const data = await dataEngine.query(visualizationQuery, {
                    variables: {
                        id,
                        nameProp:
                            currentUser.settings[
                                DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                            ],
                    },
                })

                setData(data)
            } catch (fetchError) {
                if (!error && fetchError) {
                    if (fetchError.details?.httpStatusCode === 404) {
                        dispatch(
                            acClearAll({
                                error: visualizationNotFoundError(),
                                digitGroupSeparator,
                                rootOrgUnits,
                            })
                        )
                    } else {
                        dispatch(
                            acClearAll({
                                error:
                                    fetchError.details.message ||
                                    genericServerError(),
                                digitGroupSeparator,
                                rootOrgUnits,
                            })
                        )
                    }
                }
            }
        } else {
            dispatch(
                acClearAll({
                    error: null,
                    digitGroupSeparator,
                    rootOrgUnits,
                })
            )
            dispatch(acSetVisualizationLoading(false))
        }
        /* When creating a new visualisation it's convenient to have
         * a lot of space for adding/viewing dimensions */
        dispatch(acSetShowExpandedLayoutPanel(!isExisting))
        setInitialLoadIsComplete(true)
        setPreviousLocation(location.pathname)
    }

    const onError = (error) => {
        let output

        if (error.details?.errorCode) {
            switch (error.details.errorCode) {
                case 'E7132':
                    output = indicatorError()
                    break
                case 'E7121':
                case 'E7123':
                    output = dataAccessError()
                    break
                case 'E7120':
                    output = orgUnitAccessError()
                    break
                case 'E7217':
                    output = eventAccessError()
                    break
                case 'E7144':
                    output = analyticsGenerationError()
                    break
                case 'E7145':
                    output = analyticsRequestError()
                    break
                default:
                    output = genericServerError()
            }
        } else {
            output = genericServerError()
        }
        dispatch(acSetLoadError(output))
    }

    const onColumnHeaderClick = (dimensionId) =>
        dispatch(acSetUiOpenDimensionModal(dimensionId))

    const onDataSorted = (sorting) => {
        if (sorting.direction === 'default') {
            dispatch(acClearUiDataSorting())
        } else {
            dispatch(acSetUiDataSorting(sorting))
        }

        dispatch(tSetCurrentFromUi())
    }

    const onResponsesReceived = (response) => {
        const itemsMetadata = Object.entries(response.metaData.items)
            .filter(
                ([item]) =>
                    ![
                        USER_ORG_UNIT,
                        USER_ORG_UNIT_CHILDREN,
                        USER_ORG_UNIT_GRANDCHILDREN,
                        DIMENSION_ID_ORGUNIT,
                    ].includes(item)
            )
            .reduce((obj, [id, item]) => {
                obj[id] = {
                    id,
                    name: item.name || item.displayName,
                    displayName: item.displayName,
                    dimensionType: item.dimensionType || item.dimensionItemType,
                    code: item.code,
                }

                return obj
            }, {})

        dispatch(acAddMetadata(itemsMetadata))
        dispatch(acSetVisualizationLoading(false))

        if (!response.rows?.length) {
            dispatch(acSetLoadError(emptyResponseError()))
        }
    }

    useEffect(() => {
        dispatch(tSetInitMetadata(rootOrgUnits))
        loadVisualization(history.location)

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

    const addOptionSetsMetadata = async (visualization) => {
        const optionSetsMetadata = {}

        const dimensions = [
            ...(visualization.columns || []),
            ...(visualization.rows || []),
            ...(visualization.filters || []),
        ]

        for (const dimension of dimensions) {
            if (
                dimension?.optionSet?.id &&
                dimension.filter?.startsWith(OPERATOR_IN)
            ) {
                const optionSetId = dimension.optionSet.id

                const data = await dataEngine.query(optionsQuery, {
                    variables: {
                        optionSetId,
                        codes: parseCondition(dimension.filter),
                    },
                })

                if (data?.options) {
                    // update options in the optionSet metadata used for the lookup of the correct
                    // name from code (options for different option sets have the same code)
                    optionSetsMetadata[optionSetId] = {
                        ...metadata[optionSetId],
                        options: data.options.options,
                    }
                }
            }
        }
        if (Object.keys(optionSetsMetadata).length) {
            dispatch(acAddMetadata(optionSetsMetadata))
        }
    }

    const addTrackedEntityTypeMetadata = (visualization) => {
        const { id, name } = visualization.trackedEntityType || {}

        if (id && name) {
            dispatch(acAddMetadata({ [id]: { id, name } }))
        }
    }
    const addFixedDimensionsMetadata = (visualization) => {
        const fixedDimensionsMetadata = {}

        const dimensions = [
            ...(visualization.columns || []),
            ...(visualization.rows || []),
            ...(visualization.filters || []),
        ]

        for (const dimension of dimensions.filter(
            (d) =>
                [
                    DIMENSION_ID_ORGUNIT,
                    DIMENSION_ID_EVENT_STATUS,
                    DIMENSION_ID_PROGRAM_STATUS,
                ].includes(d.dimension) && d.program?.id
        )) {
            const dimensionId = formatDimensionId({
                dimensionId: dimension.dimension,
                programId: dimension.program.id,
                outputType: visualization.outputType,
            })
            const metadata = getProgramDimensions(dimension.program.id)[
                dimensionId
            ]

            if (metadata) {
                fixedDimensionsMetadata[dimensionId] = metadata
            }
        }
        if (
            visualization.outputType === OUTPUT_TYPE_TRACKED_ENTITY &&
            dimensions.some((d) => d.dimension === DIMENSION_ID_ORGUNIT)
        ) {
            fixedDimensionsMetadata[DIMENSION_ID_ORGUNIT] =
                getDefaultOuMetadata(visualization.outputType)[
                    DIMENSION_ID_ORGUNIT
                ]
        }
        if (Object.keys(fixedDimensionsMetadata).length) {
            dispatch(acAddMetadata(fixedDimensionsMetadata))
        }
    }

    const addProgramDimensionsMetadata = (visualization) => {
        const programDimensionsMetadata = {}

        visualization.programDimensions.forEach((program) => {
            programDimensionsMetadata[program.id] = program

            const timeDimensions = getDynamicTimeDimensionsMetadata(program)
            Object.keys(timeDimensions).forEach((timeDimensionId) => {
                const formattedId = formatDimensionId({
                    dimensionId: timeDimensionId,
                    programId: program.id,
                    outputType: visualization.outputType,
                })
                programDimensionsMetadata[formattedId] = {
                    ...timeDimensions[timeDimensionId],
                    id: formattedId,
                }
            })

            if (program.programStages) {
                program.programStages.forEach((stage) => {
                    programDimensionsMetadata[stage.id] = stage
                })
            }
        })
        if (Object.keys(programDimensionsMetadata).length) {
            dispatch(acAddMetadata(programDimensionsMetadata))
        }
    }

    useEffect(() => {
        if (data?.eventVisualization) {
            dispatch(acClearLoadError())
            dispatch(tSetInitMetadata(rootOrgUnits))

            const visualization = transformVisualization(
                convertOuLevelsToUids(orgUnitLevels, data.eventVisualization)
            )

            addOptionSetsMetadata(visualization)
            addTrackedEntityTypeMetadata(visualization)
            addFixedDimensionsMetadata(visualization)
            if (visualization.outputType === OUTPUT_TYPE_TRACKED_ENTITY) {
                addProgramDimensionsMetadata(visualization)
                dispatch(acSetUiAccessoryPanelActiveTab())
            }

            dispatch(
                acAddParentGraphMap(
                    getParentGraphMapFromVisualization(visualization)
                )
            )
            dispatch(acSetVisualization(visualization))
            dispatch(tSetCurrent(visualization))
            dispatch(acSetUiFromVisualization(visualization))
            dispatch(tSetCurrentFromUi({ validateOnly: true }))
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
            <Toolbar onFileMenuAction={onFileMenuAction} />
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
                            classes.flexGrow1,
                            classes.minWidth0,
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
                        <div className={cx(classes.mainCenterCanvas)}>
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
                                            isVisualizationLoading={isLoading}
                                            visualization={current}
                                            displayProperty={
                                                currentUser.settings[
                                                    USER_SETTINGS_DISPLAY_PROPERTY
                                                ]
                                            }
                                            onResponsesReceived={
                                                onResponsesReceived
                                            }
                                            onColumnHeaderClick={
                                                onColumnHeaderClick
                                            }
                                            onDataSorted={onDataSorted}
                                            onError={onError}
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
                            aboutAOUnitRenderId={aboutAOUnitRenderId}
                            interpretationsUnitRenderId={
                                interpretationsUnitRenderId
                            }
                        />
                    )}
                </div>
            </div>
            <CssVariables colors spacers theme />
        </div>
    )
}

export default App
