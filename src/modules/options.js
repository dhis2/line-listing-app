import pick from 'lodash-es/pick'

export const OPTION_LEGEND_DISPLAY_STRATEGY = 'legendDisplayStrategy'
export const OPTION_LEGEND_DISPLAY_STYLE = 'legendDisplayStyle'
export const OPTION_LEGEND_SET = 'legendSet'
export const OPTION_SHOW_LEGEND_KEY = 'showLegendKey'
export const OPTION_MEASURE_CRITERIA = 'measureCriteria'
export const OPTION_FONT_SIZE = 'fontSize'
export const OPTION_DIGIT_GROUP_SEPARATOR = 'digitGroupSeparator'
export const OPTION_DISPLAY_DENSITY = 'displayDensity'
export const OPTION_SHOW_HIERARCHY = 'showHierarchy'
export const OPTION_SKIP_ROUNDING = 'skipRounding'
export const DISPLAY_DENSITY_COMFORTABLE = 'COMFORTABLE'
export const DISPLAY_DENSITY_NORMAL = 'NORMAL'
export const DISPLAY_DENSITY_COMPACT = 'COMPACT'
export const FONT_SIZE_LARGE = 'LARGE'
export const FONT_SIZE_NORMAL = 'NORMAL'
export const FONT_SIZE_SMALL = 'SMALL'
export const SEPARATOR_NONE = 'NONE'
export const SEPARATOR_SPACE = 'SPACE'
export const SEPARATOR_COMMA = 'COMMA'

export const options = {
    /*
    TODO: PIVOT TABLE OPTIONS:
    showHierarchy: { defaultValue: false, requestable: true, savable: true },
    showDimensionLabels: {
        defaultValue: false,
        requestable: false,
        savable: true,
    },
    colTotals: { defaultValue: false, requestable: false, savable: true },
    colSubTotals: { defaultValue: false, requestable: false, savable: true },
    rowTotals: { defaultValue: false, requestable: false, savable: true },
    rowSubTotals: { defaultValue: false, requestable: false, savable: true },
    // FIXME: hideEmptyRowItems or hideEmptyRows ??
    hideEmptyRowItems: {
        defaultValue: 'NONE',
        requestable: false,
        savable: true,
    },
    hideEmptyRows: { defaultValue: false, requestable: false, savable: true },
    // TODO: Hide n/a data
    title: { defaultValue: undefined, requestable: false, savable: true },
    completedOnly: { defaultValue: false, requestable: true, savable: true },*/
    [OPTION_DISPLAY_DENSITY]: {
        defaultValue: DISPLAY_DENSITY_NORMAL,
        requestable: false,
        savable: true,
    },
    [OPTION_FONT_SIZE]: {
        defaultValue: FONT_SIZE_NORMAL,
        requestable: false,
        savable: true,
    },
    [OPTION_DIGIT_GROUP_SEPARATOR]: {
        defaultValue: SEPARATOR_SPACE,
        requestable: false,
        savable: true,
    },
    [OPTION_SHOW_HIERARCHY]: {
        defaultValue: false,
        requestable: false,
        savable: true,
    },
    [OPTION_SKIP_ROUNDING]: {
        defaultValue: false,
        requestable: true,
        savable: true,
    },
    // TODO: Limit the number of rows shown in the table
    // TODO: Only show the [top/bottom] x rows
}

export default options

export const getOptionsForUi = () => {
    return Object.entries({ ...options }).reduce((map, [option, props]) => {
        map[option] = props.defaultValue
        return map
    }, {})
}

export const getOptionsForRequest = () => {
    return Object.entries(options).filter(
        (entry) => entry[1].requestable // entry = [option, props]
    )
}

export const getOptionsFromVisualization = (visualization) => {
    const optionsFromVisualization = {
        ...getOptionsForUi(),
        ...pick(visualization, Object.keys(options)),
    }

    if (visualization.legend) {
        optionsFromVisualization[OPTION_LEGEND_DISPLAY_STRATEGY] =
            visualization.legend.strategy
        optionsFromVisualization[OPTION_LEGEND_DISPLAY_STYLE] =
            visualization.legend.style
        optionsFromVisualization[OPTION_LEGEND_SET] = visualization.legend.set
        optionsFromVisualization[OPTION_SHOW_LEGEND_KEY] =
            visualization.legend.showKey
    }

    return optionsFromVisualization
}
