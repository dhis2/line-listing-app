import i18n from '@dhis2/d2-i18n'
import { IconArrowRight16, IconFolder16 } from '@dhis2/ui'
import cx from 'classnames'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acSetUiAccessoryPanelOpen,
    acSetUiDetailsPanelOpen,
} from '../../actions/ui.js'
import { sGetUiShowAccessoryPanel } from '../../reducers/ui.js'
import { DimensionMenuItem } from './DimensionMenuItem.js'
import styles from './DimensionPanel.module.css'
import { InputPanel } from './InputPanel/index.js'

const IDS = {
    INPUT: 'INPUT',
    PROGRAM: 'PROGRAM',
    YOUR: 'YOUR',
}

const DimensionPanel = () => {
    const dispatch = useDispatch()
    const open = useSelector(sGetUiShowAccessoryPanel)
    const [dimensionId, setDimensionId] = useState(null)
    const [selectedInputType, setSelectedInputType] = useState(null)
    const setOpen = (newOpen) => dispatch(acSetUiAccessoryPanelOpen(newOpen))
    const closeDetailsPanel = () => dispatch(acSetUiDetailsPanelOpen(false))
    const onClick = (id) => {
        if (id === dimensionId) {
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
                <DimensionMenuItem
                    icon={<IconArrowRight16 />}
                    label={
                        selectedInputType
                            ? i18n.t('Input: {{selectedInputType}}', {
                                  selectedInputType: selectedInputType.label,
                                  nsSeparator: '^^',
                              })
                            : i18n.t('Choose an input')
                    }
                    onClick={() => onClick(IDS.INPUT)}
                    selected={dimensionId === IDS.INPUT}
                />
                <DimensionMenuItem
                    icon={<IconFolder16 />}
                    label="Program dimensions"
                    onClick={() => onClick(IDS.PROGRAM)}
                    selected={dimensionId === IDS.PROGRAM}
                />
                <DimensionMenuItem
                    icon={<IconFolder16 />}
                    label="Your dimensions"
                    onClick={() => onClick(IDS.YOUR)}
                    selected={dimensionId === IDS.YOUR}
                    count={5}
                />
            </div>
            <div className={cx(styles.accessory, { [styles.hidden]: !open })}>
                <div className={styles.accessoryInner}>
                    {dimensionId === IDS.INPUT && (
                        <InputPanel
                            selectedInputType={selectedInputType}
                            setSelectedInputType={setSelectedInputType}
                        />
                    )}
                    {dimensionId === IDS.PROGRAM && <h1>PROGRAM</h1>}
                    {dimensionId === IDS.YOUR && <h1>YOUR</h1>}
                </div>
            </div>
        </div>
    )
}

export { DimensionPanel }
