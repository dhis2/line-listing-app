import i18n from '@dhis2/d2-i18n'
import { IconArrowRight16, IconFolder16 } from '@dhis2/ui'
import cx from 'classnames'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acSetUiAccessoryPanelOpen,
    acSetUiDetailsPanelOpen,
} from '../../actions/ui.js'
import {
    sGetUiInputType,
    sGetUiShowAccessoryPanel,
    sGetUiProgramId,
    sGetUiSidebarHidden,
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
import { TimeDimensions } from './TimeDimensions.js'
import { YourDimensionsMenuItem } from './YourDimensionsMenuItem.js'
import { YourDimensionsPanel } from './YourDimensionsPanel/index.js'

const TAB_INPUT = 'INPUT'
const TAB_PROGRAM = 'PROGRAM'
const TAB_YOUR = 'YOUR'

const MainSidebar = () => {
    const dispatch = useDispatch()
    const open = useSelector(sGetUiShowAccessoryPanel)
    const selectedInputType = useSelector(sGetUiInputType)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const isHidden = useSelector(sGetUiSidebarHidden)
    const [selectedTabId, setSelectedTabId] = useState(null)
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
                />
                <MenuItem
                    icon={<IconFolder16 />}
                    label={i18n.t('Program dimensions')}
                    onClick={() => onClick(TAB_PROGRAM)}
                    selected={open && selectedTabId === TAB_PROGRAM}
                    count={counts.program}
                    isCountDisabled={!selectedProgramId}
                />
                <YourDimensionsMenuItem
                    selected={open && selectedTabId === TAB_YOUR}
                    count={counts.your}
                    onClick={() => onClick(TAB_YOUR)}
                />
                <MainDimensions />
                <TimeDimensions />
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
