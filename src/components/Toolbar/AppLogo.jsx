import { ToolbarSidebar } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { IconVisualizationLinelist16 } from '@dhis2/ui'
import React from 'react'
import { useSelector } from 'react-redux'
import { sGetUiSidebarHidden } from '../../reducers/ui.js'
import classes from './styles/AppLogo.module.css'

export const AppLogo = () => {
    const isHidden = useSelector(sGetUiSidebarHidden)

    return (
        <ToolbarSidebar isHidden={isHidden}>
            <span className={classes.container}>
                <IconVisualizationLinelist16 color="#4a5768" />
                <span className={classes.appName}>{i18n.t('Line list')}</span>
            </span>
        </ToolbarSidebar>
    )
}
