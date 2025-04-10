import {
    VIS_TYPE_LINE_LIST,
    getDisplayNameByVisType,
    useCachedDataQuery,
    FileMenu,
    preparePayloadForSaveAs,
    HoverMenuBar,
} from '@dhis2/analytics'
import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { tSetCurrent } from '../../actions/current.js'
import { acSetVisualization } from '../../actions/visualization.js'
import { getAlertTypeByStatusCode } from '../../modules/error.js'
import history from '../../modules/history.js'
import {
    isLayoutValidForSave,
    isLayoutValidForSaveAs,
} from '../../modules/layoutValidation.js'
import {
    STATE_DIRTY,
    STATE_UNSAVED,
    getVisualizationFromCurrent,
    getVisualizationState,
} from '../../modules/visualization.js'
import { sGetCurrent } from '../../reducers/current.js'
import { sGetVisualization } from '../../reducers/visualization.js'
import { ToolbarDownloadDropdown } from '../DownloadMenu/index.js'
import VisualizationOptionsManager from '../VisualizationOptions/VisualizationOptionsManager.js'
import ViewDropDown from './ViewDropDown.js'

const visualizationSaveMutation = {
    type: 'create',
    resource: 'eventVisualizations',
    data: ({ visualization }) => visualization,
    params: {
        skipTranslations: true,
        skipSharing: true,
    },
}

const visualizationSaveAsMutation = {
    type: 'update',
    resource: 'eventVisualizations',
    id: ({ visualization }) => visualization.id,
    data: ({ visualization }) => visualization,
    params: {
        skipTranslations: true,
        skipSharing: true,
    },
}

export const MenuBar = ({ onFileMenuAction }) => {
    const dispatch = useDispatch()
    const current = useSelector(sGetCurrent)
    const visualization = useSelector(sGetVisualization)
    const { currentUser } = useCachedDataQuery()

    const { show: showAlert } = useAlert(
        ({ message }) => message,
        ({ options }) => options
    )

    const setCurrent = useCallback(
        (visualization) => {
            dispatch(tSetCurrent(visualization))
        },
        [dispatch]
    )

    const setVisualization = useCallback(
        (visualization) => {
            dispatch(acSetVisualization(visualization))
        },
        [dispatch]
    )

    const onOpen = (id) => {
        const path = `/${id}`
        if (history.location.pathname === path) {
            history.replace({ pathname: path }, { isOpening: true })
        } else {
            history.push(path)
        }
    }

    const onNew = () => {
        if (history.location.pathname === '/') {
            history.replace({ pathname: '/' }, { isResetting: true })
        } else {
            history.push('/')
        }
    }

    const onDelete = () => {
        const deletedVisualization = visualization?.name

        history.push('/')

        showAlert({
            message: i18n.t('"{{- deletedObject}}" successfully deleted.', {
                deletedObject: deletedVisualization,
            }),
            options: {
                success: true,
                duration: 2000,
            },
        })
    }

    const onRename = ({ name, description }) => {
        const updatedVisualization = { ...visualization }
        const updatedCurrent = { ...current }

        if (name) {
            updatedVisualization.name = updatedCurrent.name = name
        }

        if (description) {
            updatedVisualization.description = updatedCurrent.description =
                description
        } else {
            delete updatedVisualization.description
            delete updatedCurrent.description
        }

        setVisualization(updatedVisualization)

        if (visualization === current) {
            setCurrent(updatedVisualization)
        } else {
            setCurrent(updatedCurrent)
        }

        showAlert({
            message: i18n.t('Rename successful'),
            options: {
                success: true,
                duration: 2000,
            },
        })
    }

    const onSave = (details = {}, copy = false) => {
        const visualization = getVisualizationFromCurrent(current)

        visualization.name =
            // name provided in Save dialog
            details.name ||
            // existing name when saving the same modified visualization
            visualization.name ||
            // new visualization with no name provided in Save dialog
            i18n.t('Untitled {{visualizationType}} visualization, {{date}}', {
                visualizationType: getDisplayNameByVisType(VIS_TYPE_LINE_LIST),
                date: new Date().toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                }),
            })

        if (details.description) {
            visualization.description = details.description
        }

        if (copy) {
            postVisualization({
                visualization: preparePayloadForSaveAs(visualization),
            })
        } else {
            putVisualization({ visualization })
        }
    }

    const onSaveComplete = (res, copy = false) => {
        if (res.response.uid) {
            const locationObject = {
                pathname: `/${res.response.uid}`,
            }

            const locationState = {
                isSaving: true,
            }

            // Save As
            if (copy) {
                history.push(locationObject, locationState)
            }
            // Save
            else {
                history.replace(locationObject, locationState)
            }
        }
    }

    const onError = (error) => {
        console.error('Error:', error)

        const message =
            error.errorCode === 'E4030'
                ? i18n.t(
                      "This visualization can't be deleted because it is used on one or more dashboards"
                  )
                : error.message

        showAlert({
            message,
            options: {
                [getAlertTypeByStatusCode(error.httpStatusCode)]: true,
            },
        })
    }

    const [postVisualization] = useDataMutation(visualizationSaveMutation, {
        onComplete: onSaveComplete,
        onError,
    })
    const [putVisualization] = useDataMutation(visualizationSaveAsMutation, {
        onComplete: (res) => onSaveComplete(res, true),
        onError,
    })

    return (
        <HoverMenuBar>
            <FileMenu
                currentUser={currentUser}
                fileType={'eventVisualization'}
                fileObject={{
                    ...visualization,
                    ...current,
                }}
                defaultFilterVisType={VIS_TYPE_LINE_LIST}
                onOpen={onOpen}
                onNew={onNew}
                onRename={onRename}
                onSave={
                    [STATE_UNSAVED, STATE_DIRTY].includes(
                        getVisualizationState(current, visualization)
                    ) &&
                    isLayoutValidForSave({
                        ...current,
                        legacy: visualization?.legacy,
                    })
                        ? onSave
                        : undefined
                }
                onSaveAs={
                    isLayoutValidForSaveAs(current)
                        ? (details) => onSave(details, true)
                        : undefined
                }
                onShare={onFileMenuAction}
                onTranslate={onFileMenuAction}
                onDelete={onDelete}
                onError={onError}
            />
            <ViewDropDown />
            <VisualizationOptionsManager />
            <ToolbarDownloadDropdown />
        </HoverMenuBar>
    )
}

MenuBar.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
