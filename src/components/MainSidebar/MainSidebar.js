import i18n from '@dhis2/d2-i18n'
import { IconArrowRight16, IconFolder16 } from '@dhis2/ui'
import cx from 'classnames'
import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acSetUiAccessoryPanelOpen,
    acSetUiDetailsPanelOpen,
} from '../../actions/ui.js'
import { sGetCurrent } from '../../reducers/current.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import { sGetUiInputType, sGetUiShowAccessoryPanel } from '../../reducers/ui.js'
import { InputPanel, getLabelForInputType } from './InputPanel/index.js'
import styles from './MainSidebar.module.css'
import { MenuItem } from './MenuItem/index.js'
import { ProgramDimensionsPanel } from './ProgramDimensionsPanel/index.js'
import TimeDimensions from './TimeDimensions.js'
import { YourDimensionsPanel } from './YourDimensionsPanel/index.js'

const TAB_INPUT = 'INPUT'
const TAB_PROGRAM = 'PROGRAM'
const TAB_YOUR = 'YOUR'

const PROGRAM_DIMENSION_TYPES = new Set([
    'DATA_ELEMENT',
    'DATA_ELEMENT_OPERAND',
    'INDICATOR',
    'REPORTING_RATE',
    'PROGRAM_DATA_ELEMENT',
    'PROGRAM_ATTRIBUTE',
    'PROGRAM_INDICATOR',
    'PERIOD',
    'ORGANISATION_UNIT',
    'CATEGORY_OPTION',
    'OPTION_GROUP',
    'DATA_ELEMENT_GROUP',
    'ORGANISATION_UNIT_GROUP',
    'CATEGORY_OPTION_GROUP',
])
const YOUR_DIMENSION_TYPES = new Set(['ORGANISATION_UNIT_GROUP_SET'])

const useSelectedDimensions = () => {
    const current = useSelector(sGetCurrent)
    const metadata = useSelector(sGetMetadata)

    return useMemo(() => {
        const allSelectedIds = current
            ? [
                  ...current.columns,
                  ...current.filters,
                  // Rows not used now, but will be later
                  ...current.rows,
              ].map(({ dimension }) => dimension)
            : []
        const allSelectedIdsSet = new Set(allSelectedIds)
        const counts = allSelectedIds.reduce(
            (acc, id) => {
                const { dimensionType } = metadata[id]

                if (PROGRAM_DIMENSION_TYPES.has(dimensionType)) {
                    acc.program += 1
                }

                if (YOUR_DIMENSION_TYPES.has(dimensionType)) {
                    acc.your += 1
                }
                return acc
            },
            { program: 0, your: 0 }
        )

        return {
            counts,
            isSelected: (id) => allSelectedIdsSet.has(id),
        }
    }, [current])
}

const MainSidebar = () => {
    const dispatch = useDispatch()
    const open = useSelector(sGetUiShowAccessoryPanel)
    const selectedInputType = useSelector(sGetUiInputType)
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
    const { counts, isSelected } = useSelectedDimensions()

    return (
        <div className={styles.container}>
            <div className={styles.main}>
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
                />
                <MenuItem
                    icon={<IconFolder16 />}
                    label={i18n.t('Your dimensions')}
                    onClick={() => onClick(TAB_YOUR)}
                    selected={open && selectedTabId === TAB_YOUR}
                    count={counts.your}
                />

                <div className={styles.dimensionSection}>
                    <div className={styles.dimensionSectionHeader}>
                        {i18n.t('Time dimensions')}
                    </div>
                    <TimeDimensions />
                </div>
            </div>
            <div
                className={cx(styles.accessory, {
                    [styles.hidden]: !open,
                    [styles.padded]: selectedTabId === TAB_INPUT,
                })}
            >
                <div className={styles.accessoryInner}>
                    <InputPanel visible={selectedTabId === TAB_INPUT} />
                    <ProgramDimensionsPanel
                        visible={selectedTabId === TAB_PROGRAM}
                        isSelected={isSelected}
                    />
                    <YourDimensionsPanel
                        isSelected={isSelected}
                        visible={selectedTabId === TAB_YOUR}
                    />
                </div>
            </div>
        </div>
    )
}

export { MainSidebar }
