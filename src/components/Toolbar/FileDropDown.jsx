import {
    VIS_TYPE_LINE_LIST,
    useCachedDataQuery,
    preparePayloadForSaveAs,
    preparePayloadForSave,
    FileMenu,
} from '@dhis2/analytics'
import { useAlert, useDataMutation, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { FlyoutMenu, MenuItem, Divider, Popper, Layer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetCurrent } from '../../actions/current.js'
import { acSetVisualization } from '../../actions/visualization.js'
import {
    apiFetchVisualization,
    apiFetchVisualizationNameDesc,
    apiFetchVisualizationSubscribers,
} from '../../api/visualization.js'
import { getAlertTypeByStatusCode } from '../../modules/error.js'
import history from '../../modules/history.js'
import {
    isLayoutValidForSave,
    isLayoutValidForSaveAs,
} from '../../modules/layoutValidation.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../modules/userSettings.js'
import {
    STATE_DIRTY,
    STATE_UNSAVED,
    getSaveableVisualization,
    getVisualizationState,
} from '../../modules/visualization.js'
import { sGetCurrent, sGetCurrentId } from '../../reducers/current.js'
import { sGetVisualization } from '../../reducers/visualization.js'
import { sGetUi } from '../../reducers/ui.js'
import OpenVisualizationDialog from '../Visualization/OpenVisualizationDialog.jsx'
import { ToolbarMenuDropdownTrigger } from './ToolbarMenuDropdownTrigger.jsx'
import styles from './ToolbarMenuDropdownTrigger.module.css'

const visualizationSaveAsMutation = {
    type: 'create',
    resource: 'eventVisualizations',
    data: ({ visualization }) => visualization,
    params: {
        skipTranslations: true,
        skipSharing: true,
    },
}

const visualizationSaveMutation = {
    type: 'update',
    resource: 'eventVisualizations',
    id: ({ visualization }) => visualization.id,
    data: ({ visualization }) => visualization,
    params: {
        skipTranslations: true,
        skipSharing: true,
    },
}

export const FileDropDown = ({ onFileMenuAction }) => {
    const dispatch = useDispatch()
    const engine = useDataEngine()
    const current = useSelector(sGetCurrent)
    const visualization = useSelector(sGetVisualization)
    const ui = useSelector(sGetUi)
    const { currentUser } = useCachedDataQuery()
    const id = useSelector(sGetCurrentId)
    const [menuOpen, setMenuOpen] = useState(false)
    const [isOpenDialogVisible, setIsOpenDialogVisible] = useState(false)
    const anchorRef = useRef(null)

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

    const onOpen = () => {
        setIsOpenDialogVisible(true)
        setMenuOpen(false)
    }

    const onSaveAs = () => {
        // This would typically open a save as dialog
        setMenuOpen(false)
    }

    const onRename = () => {
        // This would typically open a rename dialog
        setMenuOpen(false)
    }

    const onTranslate = () => {
        onFileMenuAction()
        setMenuOpen(false)
    }

    const onShare = () => {
        onFileMenuAction()
        setMenuOpen(false)
    }

    const onGetLink = () => {
        setMenuOpen(false)
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
        setMenuOpen(false)
    }

    const onError = (error) => {
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

    const canSaveAs = isLayoutValidForSaveAs(current)

    return (
        <>
            <div ref={anchorRef} className={styles.wrapper}>
                <ToolbarMenuDropdownTrigger
                    onClick={() => setMenuOpen(!menuOpen)}
                    dataTest="file-menu"
                    open={menuOpen}
                    label={i18n.t('File')}
                />
            </div>
            {menuOpen && (
                <Layer onBackdropClick={() => setMenuOpen(false)}>
                    <Popper reference={anchorRef} placement="bottom-start">
                        <FlyoutMenu dense>
                            <MenuItem
                                label={i18n.t('Open...')}
                                onClick={onOpen}
                            />
                            <MenuItem
                                label={i18n.t('Save as...')}
                                onClick={onSaveAs}
                                disabled={!canSaveAs}
                            />
                            <Divider />
                            <MenuItem
                                label={i18n.t('Rename...')}
                                onClick={onRename}
                                disabled={!id}
                            />
                            <MenuItem
                                label={i18n.t('Translate...')}
                                onClick={onTranslate}
                                disabled={!id}
                            />
                            <Divider />
                            <MenuItem
                                label={i18n.t('Share...')}
                                onClick={onShare}
                                disabled={!id}
                            />
                            <MenuItem
                                label={i18n.t('Get link...')}
                                onClick={onGetLink}
                                disabled={!id}
                            />
                            <Divider />
                            <MenuItem
                                label={i18n.t('Delete')}
                                onClick={onDelete}
                                disabled={!id}
                            />
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
            <OpenVisualizationDialog
                open={isOpenDialogVisible}
                onClose={() => setIsOpenDialogVisible(false)}
                currentUser={currentUser}
            />
        </>
    )
}

FileDropDown.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
