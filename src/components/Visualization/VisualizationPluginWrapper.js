import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { getAdaptedUiSorting } from '../../modules/current.js'
import { Visualization } from './Visualization.js'

export const VisualizationPluginWrapper = ({
    visualization: originalVisualization,
    ...props
}) => {
    const [visualization, setVisualization] = useState(originalVisualization)

    const onDataSorted = useCallback(
        (sorting) => {
            let newSorting = undefined

            if (sorting.direction !== 'default') {
                newSorting = getAdaptedUiSorting(sorting, originalVisualization)
            }

            setVisualization({
                ...originalVisualization,
                sorting: newSorting,
            })
        },
        [originalVisualization]
    )

    return (
        <Visualization
            {...props}
            visualization={visualization}
            onDataSorted={onDataSorted}
        />
    )
}

VisualizationPluginWrapper.propTypes = {
    visualization: PropTypes.object.isRequired,
}

export default VisualizationPluginWrapper
