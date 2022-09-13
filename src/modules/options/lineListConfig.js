/* eslint-disable react/jsx-key */
import React from 'react'
import DigitGroupSeparator from '../../components/VisualizationOptions/Options/DigitGroupSeparator.js'
import DisplayDensity from '../../components/VisualizationOptions/Options/DisplayDensity.js'
import FontSize from '../../components/VisualizationOptions/Options/FontSize.js'
import getLegendTab from './tabs/legend.js'
import getStyleTab from './tabs/style.js'

export default (serverVersion) => [
    getStyleTab([
        {
            key: 'style-section-1',
            content: React.Children.toArray([
                <DisplayDensity />,
                <FontSize />,
                <DigitGroupSeparator />,
            ]),
        },
    ]),
    ...(`${serverVersion.major}.${serverVersion.minor}.${
        serverVersion.patch || 0
    }` >= '2.39.0'
        ? [getLegendTab()]
        : []),
]
