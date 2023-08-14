import i18n from '@dhis2/d2-i18n'
import { IconArrowRight16, IconFolder16, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acSetUiAccessoryPanelOpen,
    acSetUiDetailsPanelOpen,
} from '../../actions/ui.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../modules/programTypes.js'
import { OUTPUT_TYPE_EVENT } from '../../modules/visualization.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import {
    sGetUiInputType,
    sGetUiShowAccessoryPanel,
    sGetUiProgramId,
    sGetUiSidebarHidden,
    sGetUiProgramStageId,
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
import { YourDimensionsMenuItem } from './YourDimensionsMenuItem.js'
import { YourDimensionsPanel } from './YourDimensionsPanel/index.js'

const TAB_INPUT = 'INPUT'
const TAB_PROGRAM = 'PROGRAM'
const TAB_YOUR = 'YOUR'

const MainSidebar = () => {
    const dispatch = useDispatch()
    const [selectedTabId, setSelectedTabId] = useState(TAB_INPUT)
    const open = useSelector(sGetUiShowAccessoryPanel) && Boolean(selectedTabId)
    const selectedInputType = useSelector(sGetUiInputType)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedStageId = useSelector(sGetUiProgramStageId)
    const program = useSelector((state) =>
        sGetMetadataById(state, selectedProgramId)
    )
    const stage = useSelector((state) =>
        sGetMetadataById(state, selectedStageId)
    )
    const subtitle =
        selectedInputType === OUTPUT_TYPE_EVENT &&
        program?.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
        program?.name &&
        stage?.name
            ? `${program.name} - ${stage.name}`
            : program?.name
    const isHidden = useSelector(sGetUiSidebarHidden)
    const setOpen = (newOpen) => dispatch(acSetUiAccessoryPanelOpen(newOpen))
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
            onClick={() => onClick(TAB_PROGRAM)}
            selected={open && selectedTabId === TAB_PROGRAM}
            count={counts.program}
            disabled={!selectedProgramId}
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
                    onClick={() => onClick(TAB_INPUT)}
                    selected={open && selectedTabId === TAB_INPUT}
                    subtitle={subtitle}
                />
                {!selectedProgramId ? (
                    <Tooltip
                        dataTest={'no-input-tooltip'}
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
                    selected={open && selectedTabId === TAB_YOUR}
                    count={counts.your}
                    onClick={() => onClick(TAB_YOUR)}
                />
                <MainDimensions />
            </div>
            <div
                className={cx(styles.accessory, {
                    [styles.hidden]: !open,
                    [styles.padded]: selectedTabId === TAB_INPUT,
                })}
                data-test="accessory-sidebar"
            >
                <div className={styles.accessoryInner}>
                    <InputPanel visible={selectedTabId === TAB_INPUT} />
                    <ProgramDimensionsPanel
                        visible={selectedTabId === TAB_PROGRAM}
                    />
                    <YourDimensionsPanel visible={selectedTabId === TAB_YOUR} />
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
