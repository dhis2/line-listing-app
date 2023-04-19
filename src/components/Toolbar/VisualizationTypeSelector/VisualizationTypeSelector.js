import { visTypeDisplayNames, VIS_TYPE_LINE_LIST } from '@dhis2/analytics'
import { IconVisualizationLinelist16 } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import { sGetSetUiSidebarHidden, sGetUiType } from '../../../reducers/ui.js'
import classes from './styles/VisualizationTypeSelector.module.css'

const VisualizationTypeSelector = () => {
    const visualizationType = useSelector(sGetUiType)
    const isHidden = useSelector(sGetSetUiSidebarHidden)

    return (
        <div className={cx(classes.container, { [classes.hidden]: isHidden })}>
            <div className={classes.button}>
                {visualizationType === VIS_TYPE_LINE_LIST && (
                    <IconVisualizationLinelist16 color="#4a5768" />
                )}
                <span data-test="visualization-type-selector-currently-selected-text">
                    {visTypeDisplayNames[visualizationType]}
                </span>
            </div>
        </div>
    )
}

export default VisualizationTypeSelector
