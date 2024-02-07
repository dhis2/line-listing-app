import { dimensionCreate, VIS_TYPE_LINE_LIST } from '@dhis2/analytics'
import pick from 'lodash-es/pick'
import { BASE_FIELD_TYPE } from './fields.js'
import { getAdaptedUiLayoutByType } from './layout.js'
import {
    options,
    OPTION_LEGEND_DISPLAY_STRATEGY,
    OPTION_LEGEND_DISPLAY_STYLE,
    OPTION_LEGEND_SET,
    OPTION_SHOW_LEGEND_KEY,
} from './options.js'
import { parseUiRepetition } from './ui.js'
import { extractDimensionIdParts } from './utils.js'
import { getDimensionIdFromHeaderName } from './visualization.js'

export const getAdaptedUiSorting = (sorting, visualization) =>
    sorting
        ? [
              {
                  dimension:
                      getDimensionIdFromHeaderName(
                          sorting.dimension,
                          visualization
                      ) || sorting.dimension,
                  direction: sorting.direction.toUpperCase(),
              },
          ]
        : undefined

export const getDefaultFromUi = (current, ui) => {
    const adaptedUi = {
        ...ui,
        layout: {
            ...getAdaptedUiLayoutByType(ui.layout, VIS_TYPE_LINE_LIST),
        },
        itemsByDimension: getItemsByDimensionFromUi(ui),
        sorting: getAdaptedUiSorting(ui.sorting, current),
    }

    return {
        // merge with current if current is a saved visualization to keep id, access etc
        ...(current?.id && current),
        [BASE_FIELD_TYPE]: adaptedUi.type,
        outputType: adaptedUi.input.type,
        sorting: adaptedUi.sorting,
        ...getProgramFromUi(adaptedUi),
        ...getProgramStageFromUi(adaptedUi),
        ...getAxesFromUi(adaptedUi),
        ...getOptionsFromUi(adaptedUi),
    }
}

export const getProgramFromUi = (ui) => ({
    program: { id: ui.program?.id },
})

export const getProgramStageFromUi = (ui) => ({
    programStage: { id: ui.program?.stageId },
})

export const getOptionsFromUi = (ui) => {
    const legend = {
        strategy: ui.options[OPTION_LEGEND_DISPLAY_STRATEGY],
        style: ui.options[OPTION_LEGEND_DISPLAY_STYLE],
        set: ui.options[OPTION_LEGEND_SET],
        showKey: ui.options[OPTION_SHOW_LEGEND_KEY],
    }

    return { ...pick(ui.options, Object.keys(options)), legend }
}

export const getAxesFromUi = (ui) =>
    Object.entries(ui.layout).reduce(
        (layout, [axisId, dimensionIds]) => ({
            ...layout,
            [axisId]: dimensionIds
                .map((id) => {
                    const { dimensionId, programStageId } =
                        extractDimensionIdParts(id)

                    return dimensionCreate(
                        dimensionId,
                        ui.itemsByDimension[id],
                        {
                            filter: ui.conditions[id]?.condition,
                            ...(ui.conditions[id]?.legendSet && {
                                legendSet: {
                                    id: ui.conditions[id].legendSet,
                                },
                            }),
                            ...(ui.repetitionByDimension &&
                                ui.repetitionByDimension[id] && {
                                    repetition: {
                                        indexes: parseUiRepetition(
                                            ui.repetitionByDimension[id]
                                        ),
                                    },
                                }),
                            ...(programStageId && {
                                programStage: {
                                    id: programStageId,
                                },
                            }),
                        }
                    )
                })
                .filter((dim) => dim !== null),
        }),
        {}
    )

export const getItemsByDimensionFromUi = (ui) => {
    const result = {}
    Object.keys(ui.itemsByDimension).forEach(
        (key) => (result[key] = ui.itemsByDimension[key])
    )
    return result
}
