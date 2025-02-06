import React from 'react'
import DigitGroupSeparator from '../../components/VisualizationOptions/Options/DigitGroupSeparator.jsx'
import DisplayDensity from '../../components/VisualizationOptions/Options/DisplayDensity.jsx'
import FontSize from '../../components/VisualizationOptions/Options/FontSize.jsx'
import ShowHierarchy from '../../components/VisualizationOptions/Options/ShowHierarchy.jsx'
import SkipRounding from '../../components/VisualizationOptions/Options/SkipRounding.jsx'
import getDisplayTemplate from './sections/templates/display.js'
import getDataTab from './tabs/data.js'
import getLegendTab from './tabs/legend.jsx'
import getStyleTab from './tabs/style.js'

export default (serverVersion) => {
    const currentVersion = `${serverVersion.major}.${serverVersion.minor}.${
        serverVersion.patch || 0
    }`

    const optionsConfig = [
        getDataTab([
            getDisplayTemplate({
                content: React.Children.toArray([<SkipRounding />]),
            }),
        ]),

        getStyleTab([
            {
                key: 'style-section-1',
                content: React.Children.toArray([
                    <DisplayDensity />,
                    <FontSize />,
                    <DigitGroupSeparator />,
                    currentVersion >= '2.40.0' ? <ShowHierarchy /> : null,
                ]),
            },
        ]),
    ]

    optionsConfig.push(getLegendTab())

    return optionsConfig
}
