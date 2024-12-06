import { DashboardPluginWrapper } from '@dhis2/analytics'
import React, { useCallback, useEffect, useState } from 'react'
import { Visualization } from './components/Visualization/Visualization.js'
import { getAdaptedUiSorting } from './modules/current.js'
import './locales/index.js'

const PluginWrapper = (props) => {
    const [propsFromParent, setPropsFromParent] = useState(props)

    useEffect(() => setPropsFromParent(props), [props])

    const onDataSorted = useCallback(
        (sorting) => {
            let newSorting = undefined

            if (sorting.direction !== 'default') {
                newSorting = getAdaptedUiSorting(
                    sorting,
                    propsFromParent.visualization
                )
            }

            setPropsFromParent({
                ...propsFromParent,
                visualization: {
                    ...propsFromParent.visualization,
                    sorting: newSorting,
                },
            })
        },
        [propsFromParent]
    )

    return (
        <DashboardPluginWrapper {...propsFromParent}>
            {(props) => (
                <Visualization {...props} onDataSorted={onDataSorted} />
            )}
        </DashboardPluginWrapper>
    )
}

export default PluginWrapper
