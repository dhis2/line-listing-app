import { Toolbar as AnalyticsToolbar } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    IconAdd16,
    IconSave16,
    IconFullscreen16,
    IconFullscreenExit16,
    SharingDialog,
} from '@dhis2/ui'
import { useCachedDataQuery, preparePayloadForSave } from '@dhis2/analytics'
import { useAlert, useDataMutation, useDataEngine } from '@dhis2/app-runtime'
import { sGetCurrent } from '../../reducers/current.js'
import { sGetVisualization } from '../../reducers/visualization.js'
import {
    sGetUi,
    sGetUiShowExpandedVisualizationCanvas,
} from '../../reducers/ui.js'
import { acToggleUiExpandedVisualizationCanvas } from '../../actions/ui.js'
import { apiFetchVisualizationSubscribers } from '../../api/visualization.js'
import { getAlertTypeByStatusCode } from '../../modules/error.js'
import history from '../../modules/history.js'
import { isLayoutValidForSave } from '../../modules/layoutValidation.js'
import {
    STATE_DIRTY,
    STATE_UNSAVED,
    getSaveableVisualization,
    getVisualizationState,
} from '../../modules/visualization.js'
import TitleBar from '../TitleBar/TitleBar.jsx'
import { ChevronToggle } from './ChevronToggle.jsx'
import { FileDropDown } from './FileDropDown.jsx'
import ViewDropDown from './ViewDropDown.jsx'
import { ExportDropDown } from './ExportDropDown.jsx'
import { ToolbarMenuDropdownTrigger } from './ToolbarMenuDropdownTrigger.jsx'
import styles from './Toolbar.module.css'

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

// Custom hook for viewport width
const useViewportWidth = () => {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return width
}

export const Toolbar = ({ onFileMenuAction }) => {
    const [sharingDialogOpen, setSharingDialogOpen] = useState(false)
    const dispatch = useDispatch()
    const engine = useDataEngine()
    const current = useSelector(sGetCurrent)
    const visualization = useSelector(sGetVisualization)
    const ui = useSelector(sGetUi)
    const isExpanded = useSelector(sGetUiShowExpandedVisualizationCanvas)

    const { show: showAlert } = useAlert(
        ({ message }) => message,
        ({ options }) => options
    )

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

    const onSaveComplete = (res) => {
        if (res.response.uid) {
            const locationObject = {
                pathname: `/${res.response.uid}`,
            }
            const locationState = {
                isSaving: true,
            }
            history.replace(locationObject, locationState)
        }
    }

    const [putVisualization] = useDataMutation(visualizationSaveMutation, {
        onComplete: onSaveComplete,
        onError,
    })

    const handleNew = () => {
        if (history.location.pathname === '/') {
            history.replace({ pathname: '/' }, { isResetting: true })
        } else {
            history.push('/')
        }
    }

    const canSave =
        [STATE_UNSAVED, STATE_DIRTY].includes(
            getVisualizationState(visualization, current, ui)
        ) &&
        isLayoutValidForSave({
            ...current,
            legacy: visualization?.legacy,
        })

    const handleSave = async () => {
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

    const handleSharingDialogClose = () => {
        setSharingDialogOpen(false)
    }

    const handleExpandToggle = useCallback(() => {
        dispatch(acToggleUiExpandedVisualizationCanvas())
    }, [dispatch])

    return (
        <>
            <div className={styles.toolbarWrapper}>
                <AnalyticsToolbar>
                    <div className={styles.toolbarLeft}>
                        <ToolbarMenuDropdownTrigger
                            icon={<IconAdd16 color="#6C7787 " />}
                            label={i18n.t('New')}
                            onClick={handleNew}
                            dataTest="new-button"
                            showChevron={false}
                            className={styles.newButton}
                        />
                        <ToolbarMenuDropdownTrigger
                            icon={<IconSave16 color="#6C7787" />}
                            label={i18n.t('Save')}
                            onClick={handleSave}
                            dataTest="save-button"
                            showChevron={false}
                            disabled={!canSave}
                            className={styles.iconButton}
                        />
                        <div className={styles.menuDivider} />
                        <FileDropDown onFileMenuAction={onFileMenuAction} />
                        <ViewDropDown />
                        <ExportDropDown />
                    </div>
                    <TitleBar />
                    <div className={styles.toolbarRight}>
                        <ToolbarMenuDropdownTrigger
                            icon={
                                isExpanded ? (
                                    <IconFullscreenExit16 />
                                ) : (
                                    <IconFullscreen16 />
                                )
                            }
                            onClick={handleExpandToggle}
                            dataTest="fullscreen-toggle"
                            showChevron={false}
                            className={styles.iconButton}
                        />
                        <ChevronToggle />
                    </div>
                </AnalyticsToolbar>
            </div>
            {sharingDialogOpen && current?.id && (
                <SharingDialog
                    id={current.id}
                    type="eventVisualization"
                    onClose={handleSharingDialogClose}
                />
            )}
        </>
    )
}

Toolbar.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
