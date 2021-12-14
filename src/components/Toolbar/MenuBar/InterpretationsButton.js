import i18n from '@dhis2/d2-i18n'
import { IconChevronRight24, IconChevronLeft24 } from '@dhis2/ui'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiRightSidebarOpen } from '../../../actions/ui.js'
import { sGetCurrentId } from '../../../reducers/current.js'
import { sGetUiShowRightSidebar } from '../../../reducers/ui.js'
import MenuButton from './MenuButton.js'
import styles from './styles/InterpretationsButton.module.css'

export const InterpretationsButton = () => {
    const showRightSidebar = useSelector(sGetUiShowRightSidebar)
    const id = useSelector(sGetCurrentId)
    const dispatch = useDispatch()
    const onClick = () => {
        dispatch(acSetUiRightSidebarOpen(!showRightSidebar))
    }

    return (
        <MenuButton disabled={!id} onClick={onClick}>
            <div className={styles.iconWrapper}>
                {showRightSidebar ? (
                    <IconChevronRight24 />
                ) : (
                    <IconChevronLeft24 />
                )}
            </div>
            {i18n.t('Interpretations')}
        </MenuButton>
    )
}
