import i18n from '@dhis2/d2-i18n'
import React from 'react'
import ColSubTotals from '../../components/VisualizationOptions/Options/ColSubTotals.jsx'
import ColTotals from '../../components/VisualizationOptions/Options/ColTotals.jsx'
import DigitGroupSeparator from '../../components/VisualizationOptions/Options/DigitGroupSeparator.jsx'
import DisplayDensity from '../../components/VisualizationOptions/Options/DisplayDensity.jsx'
import FontSize from '../../components/VisualizationOptions/Options/FontSize.jsx'
import HideEmptyRows from '../../components/VisualizationOptions/Options/HideEmptyRows.jsx'
import RowSubTotals from '../../components/VisualizationOptions/Options/RowSubTotals.jsx'
import RowTotals from '../../components/VisualizationOptions/Options/RowTotals.jsx'
import ShowDimensionLabels from '../../components/VisualizationOptions/Options/ShowDimensionLabels.jsx'
import ShowHierarchy from '../../components/VisualizationOptions/Options/ShowHierarchy.jsx'
import Title from '../../components/VisualizationOptions/Options/Title.jsx'
import getDisplayTemplate from './sections/templates/display.js'
import getEmptyDataTemplate from './sections/templates/emptyData.js'
import getTotalsTemplate from './sections/templates/totals.js'
import getDataTab from './tabs/data.js'
import getLegendTab from './tabs/legend.jsx'
import getLimitValuesTab from './tabs/limitValues.jsx'
import getStyleTab from './tabs/style.js'

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
