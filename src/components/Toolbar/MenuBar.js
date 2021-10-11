import { FileMenu } from '@dhis2/analytics'
import { useDataMutation } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetCurrent } from '../../actions/current'
import { acSetVisualization } from '../../actions/visualization'
import history from '../../modules/history'
import { sGetCurrent } from '../../reducers/current'
import { sGetVisualization } from '../../reducers/visualization'
import VisualizationOptionsManager from '../VisualizationOptions/VisualizationOptionsManager'
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
}) => {
    const { d2 } = useD2()

    const onOpen = id => {
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

        // TODO snackbar message
        console.log('Deleted:', deletedVisualization)
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

        // TODO snackbar
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
        if (res.status === 'OK' && res.response.uid) {
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

    const onError = error => {
        console.log('Error:', error)

        // TODO handle errors

        // TODO snackbar message
    }

    const [postVisualization] = useDataMutation(visualizationSaveMutation, {
        onComplete: onSaveComplete,
        onError,
    })
    const [putVisualization] = useDataMutation(visualizationSaveAsMutation, {
        onComplete: () => res => onSaveComplete(res, true),
        onError,
    })

    return (
        <div className={classes.menuBar} data-test={dataTest}>
            <FileMenu
                d2={d2}
                fileType={apiObjectName}
                fileObject={current}
                onOpen={onOpen}
                onNew={onNew}
                onRename={onRename}
                onSave={onSave}
                onSaveAs={details => onSave(details, true)}
                onDelete={onDelete}
                onError={onError}
            />
            <VisualizationOptionsManager />
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
}

const mapStateToProps = state => ({
    current: sGetCurrent(state),
    visualization: sGetVisualization(state),
})

const mapDispatchToProps = {
    setCurrent: acSetCurrent,
    setVisualization: acSetVisualization,
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)
