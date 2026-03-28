import {
    preparePayloadForSaveAs,
    preparePayloadForSave,
    useCachedDataQuery,
} from '@dhis2/analytics'
import { useAlert, useDataMutation, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { FlyoutMenu, MenuItem, Divider, Popper, Layer } from '@dhis2/ui'
import React, { useCallback, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { ToolbarMenuDropdownTrigger } from './ToolbarMenuDropdownTrigger.jsx'
import styles from './ToolbarMenuDropdownTrigger.module.css'
import { tSetCurrent } from '../../actions/current.js'
import { acSetVisualization } from '../../actions/visualization.js'
import {
    acToggleUiSidebarHidden,
    acToggleUiLayoutPanelHidden,
    acSetUiDetailsPanelOpen,
} from '../../actions/ui.js'
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
import {
    sGetUi,
    sGetUiLayoutPanelHidden,
    sGetUiSidebarHidden,
    sGetUiShowDetailsPanel,
} from '../../reducers/ui.js'

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

export const MegaMenu = ({ onFileMenuAction }) => {
    const dispatch = useDispatch()
    const engine = useDataEngine()
    const current = useSelector(sGetCurrent)
    const visualization = useSelector(sGetVisualization)
    const ui = useSelector(sGetUi)
    const { currentUser } = useCachedDataQuery()
    const isSidebarHidden = useSelector(sGetUiSidebarHidden)
    const isLayoutPanelHidden = useSelector(sGetUiLayoutPanelHidden)
    const isDetailsPanelOpen = useSelector(sGetUiShowDetailsPanel)
    const id = useSelector(sGetCurrentId)
    const [menuOpen, setMenuOpen] = useState(false)
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

    const onNew = () => {
        if (history.location.pathname === '/') {
            history.replace({ pathname: '/' }, { isResetting: true })
        } else {
            history.push('/')
        }
    }

    const onOpen = () => {
        // This would typically open a dialog to select a visualization
        console.log('Open clicked')
    }

    const onSave = async () => {
        const canSave =
            [STATE_UNSAVED, STATE_DIRTY].includes(
                getVisualizationState(visualization, current, ui)
            ) &&
            isLayoutValidForSave({
                ...current,
                legacy: visualization?.legacy,
            })

        if (!canSave) {
            return
        }

        const { subscribers } = await apiFetchVisualizationSubscribers({
            engine,
            id: visualization.id,
        })

        putVisualization({
            visualization: await preparePayloadForSave({
                visualization: {
                    ...getSaveableVisualization(current),
                    subscribers,
                },
                engine,
            }),
        })
    }

    const onSaveAs = () => {
        // This would typically open a save as dialog
        console.log('Save As clicked')
    }

    const onRename = () => {
        // This would typically open a rename dialog
        console.log('Rename clicked')
    }

    const onTranslate = () => {
        onFileMenuAction()
        console.log('Translate clicked')
    }

    const onShare = () => {
        onFileMenuAction()
        console.log('Share clicked')
    }

    const onGetLink = () => {
        console.log('Get link clicked')
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

    const [postVisualization] = useDataMutation(visualizationSaveAsMutation, {
        onComplete: () => {},
        onError,
    })

    const [putVisualization] = useDataMutation(visualizationSaveMutation, {
        onComplete: () => {},
        onError,
    })

    const toggleLayoutPanelHidden = useCallback(() => {
        dispatch(acToggleUiLayoutPanelHidden())
    }, [dispatch])

    const toggleSidebarHidden = useCallback(() => {
        dispatch(acToggleUiSidebarHidden())
    }, [dispatch])

    const toggleDetailsPanelOpen = useCallback(() => {
        dispatch(acSetUiDetailsPanelOpen(!isDetailsPanelOpen))
    }, [dispatch, isDetailsPanelOpen])

    const toggleLayoutPanelText = isLayoutPanelHidden
        ? i18n.t('Show layout')
        : i18n.t('Hide layout')
    const toggleSidebarText = isSidebarHidden
        ? i18n.t('Show dimensions sidebar')
        : i18n.t('Hide dimensions sidebar')
    const toggleDetailsPanelText = isDetailsPanelOpen
        ? i18n.t('Hide interpretations and details')
        : i18n.t('Show interpretations and details')

    const canSave =
        [STATE_UNSAVED, STATE_DIRTY].includes(
            getVisualizationState(visualization, current, ui)
        ) &&
        isLayoutValidForSave({
            ...current,
            legacy: visualization?.legacy,
        })

    const canSaveAs = isLayoutValidForSaveAs(current)

    return (
        <>
            <div ref={anchorRef} className={styles.wrapper}>
                <ToolbarMenuDropdownTrigger
                    onClick={() => setMenuOpen(!menuOpen)}
                    dataTest="mega-menu"
                    open={menuOpen}
                    icon={
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2.66797 4H13.334M2.66797 8H13.334M2.66797 12H13.334"
                                stroke="#6C7787"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    }
                />
            </div>
            {menuOpen && (
                <Layer onBackdropClick={() => setMenuOpen(false)}>
                    <Popper reference={anchorRef} placement="bottom-start">
                        <FlyoutMenu dense>
                            <MenuItem
                                label={i18n.t('New')}
                                onClick={() => {
                                    onNew()
                                    setMenuOpen(false)
                                }}
                            />
                            <MenuItem
                                label={i18n.t('Open...')}
                                onClick={() => {
                                    onOpen()
                                    setMenuOpen(false)
                                }}
                            />
                            <MenuItem
                                label={i18n.t('Save')}
                                onClick={() => {
                                    onSave()
                                    setMenuOpen(false)
                                }}
                                disabled={!canSave}
                            />
                            <MenuItem
                                label={i18n.t('Save as...')}
                                onClick={() => {
                                    onSaveAs()
                                    setMenuOpen(false)
                                }}
                                disabled={!canSaveAs}
                            />
                            <MenuItem
                                label={i18n.t('Rename...')}
                                onClick={() => {
                                    onRename()
                                    setMenuOpen(false)
                                }}
                                disabled={!id}
                            />
                            <MenuItem
                                label={i18n.t('Translate')}
                                onClick={() => {
                                    onTranslate()
                                    setMenuOpen(false)
                                }}
                                disabled={!id}
                            />
                            <MenuItem
                                label={i18n.t('Download')}
                                onClick={() => {
                                    console.log('Download clicked')
                                    setMenuOpen(false)
                                }}
                            />
                            <MenuItem
                                label={i18n.t('Share...')}
                                onClick={() => {
                                    onShare()
                                    setMenuOpen(false)
                                }}
                                disabled={!id}
                            />
                            <MenuItem
                                label={i18n.t('Get link...')}
                                onClick={() => {
                                    onGetLink()
                                    setMenuOpen(false)
                                }}
                                disabled={!id}
                            />
                            <MenuItem
                                label={i18n.t('Delete')}
                                onClick={() => {
                                    onDelete()
                                    setMenuOpen(false)
                                }}
                                disabled={!id}
                            />
                            <Divider />
                            <MenuItem
                                label={toggleLayoutPanelText}
                                onClick={() => {
                                    toggleLayoutPanelHidden()
                                    setMenuOpen(false)
                                }}
                            />
                            <MenuItem
                                label={toggleDetailsPanelText}
                                onClick={() => {
                                    toggleDetailsPanelOpen()
                                    setMenuOpen(false)
                                }}
                                disabled={!id}
                            />
                            <MenuItem
                                label={toggleSidebarText}
                                onClick={() => {
                                    toggleSidebarHidden()
                                    setMenuOpen(false)
                                }}
                            />
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </>
    )
}

MegaMenu.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
