import i18n from '@dhis2/d2-i18n'
import { IconArrowRight16, IconFolder16, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acSetUiAccessoryPanelActiveTab,
    acSetUiAccessoryPanelOpen,
    acSetUiDetailsPanelOpen,
} from '../../actions/ui.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../modules/programTypes.js'
import {
    ACCESSORY_PANEL_TAB_INPUT,
    ACCESSORY_PANEL_TAB_PROGRAM,
    ACCESSORY_PANEL_TAB_TRACKED_ENTITY,
    ACCESSORY_PANEL_TAB_YOUR,
} from '../../modules/ui.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../modules/visualization.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import {
    sGetUiInputType,
    sGetUiShowAccessoryPanel,
    sGetUiProgramId,
    sGetUiSidebarHidden,
    sGetUiProgramStageId,
    sGetUiAccessoryPanelActiveTab,
    sGetUiEntityTypeId,
} from '../../reducers/ui.js'
import { InputPanel, getLabelForInputType } from './InputPanel/index.js'
import { MainDimensions } from './MainDimensions.js'
import styles from './MainSidebar.module.css'
import { MenuItem } from './MenuItem/index.js'
import { ProgramDimensionsPanel } from './ProgramDimensionsPanel/index.js'
import {
    SelectedDimensionsProvider,
    useSelectedDimensions,
} from './SelectedDimensionsContext.js'
import { TrackedEntityDimensionsMenuItem } from './TrackedEntityDimensionsMenuItem.js'
import { TrackedEntityDimensionsPanel } from './TrackedEntityDimensionsPanel/index.js'
import { YourDimensionsMenuItem } from './YourDimensionsMenuItem.js'
import { YourDimensionsPanel } from './YourDimensionsPanel/index.js'

const MainSidebar = () => {
    const dispatch = useDispatch()
    const selectedTabId = useSelector(sGetUiAccessoryPanelActiveTab)
    const open = useSelector(sGetUiShowAccessoryPanel) && Boolean(selectedTabId)
    const selectedInputType = useSelector(sGetUiInputType)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedStageId = useSelector(sGetUiProgramStageId)
    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)
    const program = useSelector((state) =>
        sGetMetadataById(state, selectedProgramId)
    )
    const stage = useSelector((state) =>
        sGetMetadataById(state, selectedStageId)
    )
    const entityType = useSelector((state) =>
        sGetMetadataById(state, selectedEntityTypeId)
    )
    const getSubtitle = () => {
        if (
            selectedInputType === OUTPUT_TYPE_EVENT &&
            program?.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
            program?.name &&
            stage?.name
        ) {
            return `${program.name} - ${stage.name}`
        } else if (selectedInputType === OUTPUT_TYPE_TRACKED_ENTITY) {
            return entityType?.name
        } else {
            return program?.name
        }
    }

    const isHidden = useSelector(sGetUiSidebarHidden)
    const setOpen = (newOpen) => dispatch(acSetUiAccessoryPanelOpen(newOpen))
    const setSelectedTabId = (id) =>
        dispatch(acSetUiAccessoryPanelActiveTab(id))
    const closeDetailsPanel = () => dispatch(acSetUiDetailsPanelOpen(false))
    const onClick = (id) => {
        if (open && id === selectedTabId) {
            setSelectedTabId(null)
            setOpen(false)
        } else {
            setSelectedTabId(id)
            setOpen(true)
            closeDetailsPanel()
        }
    }
    const { counts } = useSelectedDimensions()
    const programDimensionsItem = (
        <MenuItem
            icon={<IconFolder16 />}
            label={i18n.t('Program dimensions')}
            onClick={() => onClick(ACCESSORY_PANEL_TAB_PROGRAM)}
            selected={open && selectedTabId === ACCESSORY_PANEL_TAB_PROGRAM}
            count={counts.program}
            disabled={!(selectedProgramId || selectedEntityTypeId)}
            dataTest="program-dimensions-button"
        />
    )

    return (
        <div className={cx(styles.container, { [styles.hidden]: isHidden })}>
            <div className={styles.main} data-test="main-sidebar">
                <MenuItem
                    icon={<IconArrowRight16 />}
                    label={i18n.t('Input: {{type}}', {
                        type: getLabelForInputType(selectedInputType),
                        nsSeparator: '^^',
                    })}
                    onClick={() => onClick(ACCESSORY_PANEL_TAB_INPUT)}
                    selected={
                        open && selectedTabId === ACCESSORY_PANEL_TAB_INPUT
                    }
                    subtitle={getSubtitle()}
                    dataTest="input-panel-button"
                />
                {entityType?.name && (
                    <TrackedEntityDimensionsMenuItem
                        selected={
                            open &&
                            selectedTabId === ACCESSORY_PANEL_TAB_TRACKED_ENTITY
                        }
                        count={counts.trackedEntity}
                        onClick={() =>
                            onClick(ACCESSORY_PANEL_TAB_TRACKED_ENTITY)
                        }
                        name={entityType.name}
                    />
                )}
                {!(selectedProgramId || selectedEntityTypeId) ? (
                    <Tooltip
                        dataTest="no-input-tooltip"
                        content={i18n.t('Choose an input first')}
                        closeDelay={0}
                        placement="bottom"
                    >
                        {({ onMouseOver, onMouseOut, ref }) => (
                            <span
                                onMouseOver={onMouseOver}
                                onMouseOut={onMouseOut}
                                ref={ref}
                            >
                                {programDimensionsItem}
                            </span>
                        )}
                    </Tooltip>
                ) : (
                    programDimensionsItem
                )}
                <YourDimensionsMenuItem
                    selected={
                        open && selectedTabId === ACCESSORY_PANEL_TAB_YOUR
                    }
                    count={counts.your}
                    onClick={() => onClick(ACCESSORY_PANEL_TAB_YOUR)}
                />
                <MainDimensions />
            </div>
            <div
                className={cx(styles.accessory, {
                    [styles.hidden]: !open,
                    [styles.padded]:
                        selectedTabId === ACCESSORY_PANEL_TAB_INPUT,
                })}
                data-test="accessory-sidebar"
            >
                <div className={styles.accessoryInner}>
                    <InputPanel
                        visible={selectedTabId === ACCESSORY_PANEL_TAB_INPUT}
                    />
                    <ProgramDimensionsPanel
                        visible={selectedTabId === ACCESSORY_PANEL_TAB_PROGRAM}
                    />
                    <TrackedEntityDimensionsPanel
                        visible={
                            selectedTabId === ACCESSORY_PANEL_TAB_TRACKED_ENTITY
                        }
                    />
                    <YourDimensionsPanel
                        visible={selectedTabId === ACCESSORY_PANEL_TAB_YOUR}
                    />
                </div>
            </div>
        </div>
    )
}

const MainSidebarWithSelectedDimensionsProvider = () => (
    <SelectedDimensionsProvider>
        <MainSidebar />
    </SelectedDimensionsProvider>
)

export { MainSidebarWithSelectedDimensionsProvider as MainSidebar }
