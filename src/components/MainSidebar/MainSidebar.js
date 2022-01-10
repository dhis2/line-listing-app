import i18n from '@dhis2/d2-i18n'
import { IconArrowRight16, IconFolder16 } from '@dhis2/ui'
import cx from 'classnames'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acSetUiAccessoryPanelOpen,
    acSetUiDetailsPanelOpen,
} from '../../actions/ui.js'
import { sGetUiInputType, sGetUiShowAccessoryPanel } from '../../reducers/ui.js'
import { InputPanel, getLabelForInputType } from './InputPanel/index.js'
import styles from './MainSidebar.module.css'
import { MenuItem } from './MenuItem/index.js'

const IDS = {
    INPUT: 'INPUT',
    PROGRAM: 'PROGRAM',
    YOUR: 'YOUR',
}

const MainSidebar = () => {
    const dispatch = useDispatch()
    const open = useSelector(sGetUiShowAccessoryPanel)
    const selectedInputType = useSelector(sGetUiInputType)
    const [dimensionId, setDimensionId] = useState(null)
    const setOpen = (newOpen) => dispatch(acSetUiAccessoryPanelOpen(newOpen))
    const closeDetailsPanel = () => dispatch(acSetUiDetailsPanelOpen(false))
    const onClick = (id) => {
        if (open && id === dimensionId) {
            setDimensionId(null)
            setOpen(false)
        } else {
            setDimensionId(id)
            setOpen(true)
            closeDetailsPanel()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <MenuItem
                    icon={<IconArrowRight16 />}
                    label={
                        selectedInputType
                            ? i18n.t('Input: {{type}}', {
                                  type: getLabelForInputType(selectedInputType),
                                  nsSeparator: '^^',
                              })
                            : i18n.t('Choose an input')
                    }
                    onClick={() => onClick(IDS.INPUT)}
                    selected={open && dimensionId === IDS.INPUT}
                />
                <MenuItem
                    icon={<IconFolder16 />}
                    label={i18n.t('Program dimensions')}
                    onClick={() => onClick(IDS.PROGRAM)}
                    selected={open && dimensionId === IDS.PROGRAM}
                />
                <MenuItem
                    icon={<IconFolder16 />}
                    label={i18n.t('Your dimensions')}
                    onClick={() => onClick(IDS.YOUR)}
                    selected={open && dimensionId === IDS.YOUR}
                    count={5}
                />
            </div>
            <div className={cx(styles.accessory, { [styles.hidden]: !open })}>
                <div className={styles.accessoryInner}>
                    {dimensionId === IDS.INPUT && <InputPanel />}
                    {dimensionId === IDS.PROGRAM && <h1>PROGRAM</h1>}
                    {dimensionId === IDS.YOUR && <h1>YOUR</h1>}
                </div>
            </div>
        </div>
    )
}

export { MainSidebar }
