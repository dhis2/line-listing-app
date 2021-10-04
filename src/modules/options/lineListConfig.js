/* eslint-disable react/jsx-key */
import React from 'react'
import CompletedOnly from '../../components/VisualizationOptions/Options/CompletedOnly'
import DigitGroupSeparator from '../../components/VisualizationOptions/Options/DigitGroupSeparator'
import DisplayDensity from '../../components/VisualizationOptions/Options/DisplayDensity'
import FontSize from '../../components/VisualizationOptions/Options/FontSize'
import getDisplayTemplate from './sections/templates/display'
import getDataTab from './tabs/data'
import getStyleTab from './tabs/style'

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
