import { FileMenu } from '@dhis2/analytics'
import { useDataMutation, useAlert } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetCurrent, tSetCurrentFromUi } from '../../../actions/current.js'
import { acSetVisualization } from '../../../actions/visualization.js'
import { getAlertTypeByStatusCode } from '../../../modules/error.js'
import history from '../../../modules/history.js'
import { sGetCurrent } from '../../../reducers/current.js'
import { sGetVisualization } from '../../../reducers/visualization.js'
import { ToolbarDownloadDropdown } from '../../DownloadMenu/index.js'
import VisualizationOptionsManager from '../../VisualizationOptions/VisualizationOptionsManager.js'
import { default as InterpretationsButton } from './InterpretationsButton.js'
import classes from './styles/MenuBar.module.css'

const visualizationSaveMutation = {
    type: 'create',
    resource: 'eventReports',
    data: ({ visualization }) => visualization,
    params: {
        skipTranslations: true,
        skipSharing: true,
    },
}

const visualizationSaveAsMutation = {
    type: 'update',
    resource: 'eventReports',
    id: ({ visualization }) => visualization.id,
    data: ({ visualization }) => visualization,
    params: {
        skipTranslations: true,
        skipSharing: true,
    },
}

export const MenuBar = ({
    dataTest,
    current,
    visualization,
    apiObjectName,
    setCurrent,
    setVisualization,
    onUpdate,
}) => {
    const { d2 } = useD2()
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        ({ options }) => options
    )

    const onOpen = (id) => {
        const path = `/${id}`
        if (history.location.pathname === path) {
            history.replace({ pathname: path, state: { isOpening: true } })
        } else {
            history.push(path)
        }
    }

    const onNew = () => {
        if (history.location.pathname === '/') {
            history.replace({ pathname: '/', state: { isResetting: true } })
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
        const visualization = current // TODO getVisualizationFromCurrent

        visualization.name =
            // name provided in Save dialog
            details.name ||
            // existing name when saving the same modified visualization
            visualization.name ||
            // new visualization with no name provided in Save dialog
            i18n.t('Untitled {{visualizationType}} visualization, {{date}}', {
                visualizationType: 'TEXT', // TODO Line list/PT?
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
            const historyEntry = {
                pathname: `/${res.response.uid}`,
                state: { isSaving: true },
            }

            // Save As
            if (copy) {
                history.push(historyEntry)
            }
            // Save
            else {
                history.replace(historyEntry)
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
        onComplete: () => (res) => onSaveComplete(res, true),
        onError,
    })

    const onUpdateClick = () => {
        // TODO: More things to be added here later (validation, error handling etc). Should be in line with the onClick in VisualizationsOptionsManager
        onUpdate()
    }

    return (
        <div className={classes.menuBar} data-test={dataTest}>
            <Button
                className={classes.updateButton}
                onClick={onUpdateClick}
                type="button"
                primary
                small
            >
                {i18n.t('Update')}
            </Button>
            <FileMenu
                d2={d2}
                fileType={apiObjectName}
                fileObject={current}
                onOpen={onOpen}
                onNew={onNew}
                onRename={onRename}
                onSave={onSave}
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
    dataTest: PropTypes.string,
    setCurrent: PropTypes.func,
    setVisualization: PropTypes.func,
    visualization: PropTypes.object,
    onUpdate: PropTypes.func,
}

const mapStateToProps = (state) => ({
    current: sGetCurrent(state),
    visualization: sGetVisualization(state),
})

const mapDispatchToProps = {
    setCurrent: acSetCurrent,
    setVisualization: acSetVisualization,
    onUpdate: tSetCurrentFromUi,
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)
