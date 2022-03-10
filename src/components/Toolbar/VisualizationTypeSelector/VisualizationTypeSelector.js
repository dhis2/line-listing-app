import { visTypeDisplayNames, VIS_TYPE_LINE_LIST } from '@dhis2/analytics'
import { IconVisualizationLinelist16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { visTypes } from '../../../modules/visualization.js'
import { sGetUiType } from '../../../reducers/ui.js'
import classes from './styles/VisualizationTypeSelector.module.css'

const VisualizationTypeSelector = ({ visualizationType }) => {
    return (
        <div className={classes.container}>
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

VisualizationTypeSelector.propTypes = {
    visualizationType: PropTypes.oneOf(visTypes.map(({ type }) => type)),
}

const mapStateToProps = (state) => ({
    visualizationType: sGetUiType(state),
})

export default connect(mapStateToProps)(VisualizationTypeSelector)
