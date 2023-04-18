import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconFullscreen16,
    IconFullscreenExit16,
    Tooltip,
} from '@dhis2/ui'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetUiExpandedVisualizationCanvas } from '../../actions/ui.js'
import { sGetUiShowExpandedVisualizationCanvas } from '../../reducers/ui.js'
import classes from './styles/ExpandedVisualizationCanvasToggle.module.css'

export const ExpandedVisualizationCanvasToggle = () => {
    const dispatch = useDispatch()
    const isExpanded = useSelector(sGetUiShowExpandedVisualizationCanvas)
    const tooltipText = isExpanded
        ? i18n.t('Show panels')
        : i18n.t('Expand visualization and hide panels')
    const icon = isExpanded ? <IconFullscreenExit16 /> : <IconFullscreen16 />
    const onClick = useCallback(
        () => dispatch(acSetUiExpandedVisualizationCanvas(!isExpanded)),
        [dispatch, isExpanded]
    )

    return (
        <Tooltip content={tooltipText}>
            {({ onMouseOver, onMouseOut, ref }) => (
                <span
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    ref={ref}
                    className={classes.tooltipAnchor}
                >
                    <Button icon={icon} small onClick={onClick} />
                </span>
            )}
        </Tooltip>
    )
}
