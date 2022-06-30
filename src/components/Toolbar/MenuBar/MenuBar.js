import {
    FileMenu,
    useCachedDataQuery,
    VIS_TYPE_LINE_LIST,
    visTypeDisplayNames,
} from '@dhis2/analytics'
import { useDataMutation, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { tSetCurrent } from '../../../actions/current.js'
import { acSetVisualization } from '../../../actions/visualization.js'
import { getAlertTypeByStatusCode } from '../../../modules/error.js'
import history from '../../../modules/history.js'
import {
    aoCreatedInEventReportsApp,
    layoutHasProgramId,
} from '../../../modules/layoutValidation.js'
import { getVisualizationFromCurrent } from '../../../modules/visualization.js'
import { sGetCurrent } from '../../../reducers/current.js'
import { sGetVisualization } from '../../../reducers/visualization.js'
import { ToolbarDownloadDropdown } from '../../DownloadMenu/index.js'
import UpdateButton from '../../UpdateButton/UpdateButton.js'
import UpdateVisualizationContainer from '../../UpdateButton/UpdateVisualizationContainer.js'
import VisualizationOptionsManager from '../../VisualizationOptions/VisualizationOptionsManager.js'
import { InterpretationsButton } from './InterpretationsButton.js'
import classes from './styles/MenuBar.module.css'

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

const MenuBar = ({
    current,
    visualization,
    apiObjectName,
    setCurrent,
    setVisualization,
}) => {
    const { currentUser } = useCachedDataQuery()
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        ({ options }) => options
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
        const deletedVisualization = current.name

        history.push('/')

        showAlert({
            message: i18n.t('"{{deletedObject}}" successfully deleted.', {
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
                visualizationType: visTypeDisplayNames(VIS_TYPE_LINE_LIST),
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
            delete visualization.id

            postVisualization({ visualization })
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
        // TODO remove once tested
        console.log('Error:', error)

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
        <div className={classes.menuBar} data-test="menubar">
            <UpdateVisualizationContainer
                renderComponent={(handler) => (
                    <UpdateButton
                        className={classes.updateButton}
                        onClick={handler}
                        small
                    />
                )}
            />
            <FileMenu
                currentUser={currentUser}
                fileType={apiObjectName}
                fileObject={current}
                defaultFilterVisType={VIS_TYPE_LINE_LIST}
                onOpen={onOpen}
                onNew={onNew}
                onRename={onRename}
                onSave={
                    layoutHasProgramId(current) &&
                    !aoCreatedInEventReportsApp(current)
                        ? onSave
                        : undefined
                }
                onSaveAs={(details) => onSave(details, true)}
                onDelete={onDelete}
                onError={onError}
            />
            <VisualizationOptionsManager />
            <ToolbarDownloadDropdown />
            <div className={classes.flexGrow} />
            <InterpretationsButton />
        </div>
    )
}

MenuBar.propTypes = {
    apiObjectName: PropTypes.string,
    current: PropTypes.object,
    setCurrent: PropTypes.func,
    setVisualization: PropTypes.func,
    visualization: PropTypes.object,
}

const mapStateToProps = (state) => ({
    current: sGetCurrent(state),
    visualization: sGetVisualization(state),
})

const mapDispatchToProps = {
    setCurrent: tSetCurrent,
    setVisualization: acSetVisualization,
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)
