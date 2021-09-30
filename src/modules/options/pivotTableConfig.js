/* eslint-disable react/jsx-key */
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import ColSubTotals from '../../components/VisualizationOptions/Options/ColSubTotals'
import ColTotals from '../../components/VisualizationOptions/Options/ColTotals'
import DigitGroupSeparator from '../../components/VisualizationOptions/Options/DigitGroupSeparator'
import DisplayDensity from '../../components/VisualizationOptions/Options/DisplayDensity'
import FontSize from '../../components/VisualizationOptions/Options/FontSize'
import HideEmptyRows from '../../components/VisualizationOptions/Options/HideEmptyRows'
import RowSubTotals from '../../components/VisualizationOptions/Options/RowSubTotals'
import RowTotals from '../../components/VisualizationOptions/Options/RowTotals'
import ShowDimensionLabels from '../../components/VisualizationOptions/Options/ShowDimensionLabels'
import ShowHierarchy from '../../components/VisualizationOptions/Options/ShowHierarchy'
import Title from '../../components/VisualizationOptions/Options/Title'
import getDisplayTemplate from './sections/templates/display'
import getEmptyDataTemplate from './sections/templates/emptyData'
import getTotalsTemplate from './sections/templates/totals'
import getDataTab from './tabs/data'
import getLegendTab from './tabs/legend'
import getLimitValuesTab from './tabs/limitValues'
import getStyleTab from './tabs/style'

export default () => [
    getDataTab([
        getDisplayTemplate({
            content: React.Children.toArray([
                <ShowHierarchy />,
                <ShowDimensionLabels />,
            ]),
        }),
        getTotalsTemplate({
            content: React.Children.toArray([
                <ColTotals />,
                <ColSubTotals />,
                <RowTotals />,
                <RowSubTotals />,
            ]),
        }),
        getEmptyDataTemplate({
            content: React.Children.toArray([
                <HideEmptyRows />,
                //TODO: hide n/a data
            ]),
        }),
    ]),
    getLegendTab(),
    getStyleTab([
        {
            key: 'style-section-1',
            content: React.Children.toArray([
                <Title label={i18n.t('Table title')} />,
                <DisplayDensity />,
                <FontSize />,
                <DigitGroupSeparator />,
            ]),
        },
    ]),
    getLimitValuesTab(), // TODO: include these two options instead
    //Limit the number of rows shown in the table
    //Only show the [top/bottom] x rows
]
