import React from 'react'
import DigitGroupSeparator from '../../components/VisualizationOptions/Options/DigitGroupSeparator.js'
import DisplayDensity from '../../components/VisualizationOptions/Options/DisplayDensity.js'
import FontSize from '../../components/VisualizationOptions/Options/FontSize.js'
import ShowHierarchy from '../../components/VisualizationOptions/Options/ShowHierarchy.js'
import SkipRounding from '../../components/VisualizationOptions/Options/SkipRounding.js'
import getDisplayTemplate from './sections/templates/display.js'
import getDataTab from './tabs/data.js'
import getLegendTab from './tabs/legend.js'
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

    if (currentVersion >= '2.39.0') {
        optionsConfig.push(getLegendTab())
    }

    return optionsConfig
}
