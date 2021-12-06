/* eslint-disable react/jsx-key */
import React from 'react'
import CompletedOnly from '../../components/VisualizationOptions/Options/CompletedOnly.js'
import DigitGroupSeparator from '../../components/VisualizationOptions/Options/DigitGroupSeparator.js'
import DisplayDensity from '../../components/VisualizationOptions/Options/DisplayDensity.js'
import FontSize from '../../components/VisualizationOptions/Options/FontSize.js'
import getDisplayTemplate from './sections/templates/display.js'
import getDataTab from './tabs/data.js'
import getStyleTab from './tabs/style.js'

export default () => [
    getDataTab([
        getDisplayTemplate({
            content: React.Children.toArray([<CompletedOnly />]),
        }),
    ]),
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
]
