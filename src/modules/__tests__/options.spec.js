import {
    LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
    LEGEND_DISPLAY_STYLE_FILL,
} from '@dhis2/analytics'
import {
    OPTION_LEGEND_DISPLAY_STRATEGY,
    OPTION_LEGEND_DISPLAY_STYLE,
    OPTION_LEGEND_SET,
    OPTION_SHOW_LEGEND_KEY,
    getOptionsFromVisualization,
} from '../options.js'

describe('getOptionsFromVisualization', () => {
    it('should return default options if visualization is empty', () => {
        const visualization = {}
        const result = getOptionsFromVisualization(visualization)
        expect(result).toEqual({
            digitGroupSeparator: 'SPACE',
            displayDensity: 'NORMAL',
            fontSize: 'NORMAL',
            showHierarchy: false,
            skipRounding: false,
        })
    })

    it('should return options from visualization', () => {
        const visualization = {
            digitGroupSeparator: 'COMMA',
            displayDensity: 'COMPACT',
            fontSize: 'SMALL',
            showHierarchy: true,
            skipRounding: true,
        }

        const result = getOptionsFromVisualization(visualization)
        expect(result).toEqual({
            digitGroupSeparator: 'COMMA',
            displayDensity: 'COMPACT',
            fontSize: 'SMALL',
            showHierarchy: true,
            skipRounding: true,
        })
    })

    it('should include legend options if present in visualization', () => {
        const visualization = {
            legend: {
                strategy: LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
                style: LEGEND_DISPLAY_STYLE_FILL,
                set: 'legendSet1',
                showKey: true,
            },
        }
        const result = getOptionsFromVisualization(visualization)
        expect(result).toEqual({
            digitGroupSeparator: 'SPACE',
            displayDensity: 'NORMAL',
            fontSize: 'NORMAL',
            showHierarchy: false,
            skipRounding: false,
            [OPTION_LEGEND_DISPLAY_STRATEGY]:
                LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
            [OPTION_LEGEND_DISPLAY_STYLE]: LEGEND_DISPLAY_STYLE_FILL,
            [OPTION_LEGEND_SET]: 'legendSet1',
            [OPTION_SHOW_LEGEND_KEY]: true,
        })
    })
})
