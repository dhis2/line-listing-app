import { dimensionCreate } from '@dhis2/analytics'
import pick from 'lodash-es/pick'
import { BASE_FIELD_TYPE } from './fields.js'
import { getAdaptedUiLayoutByType } from './layout.js'
import { options } from './options.js'
import { VIS_TYPE_LINE_LIST } from './visualization.js'

export const getDefaultFromUi = (current, action) => {
    const ui = {
        ...action.value,
        layout: {
            ...getAdaptedUiLayoutByType(
                action.value.layout,
                VIS_TYPE_LINE_LIST
            ),
        },
        itemsByDimension: getItemsByDimensionFromUi(action.value),
    }

    return {
        ...current,
        [BASE_FIELD_TYPE]: ui.type,
        outputType: ui.input.type,
        ...getAxesFromUi(ui),
        ...getOptionsFromUi(ui),
    }
}

export const getOptionsFromUi = (ui) => pick(ui.options, Object.keys(options))

export const getAxesFromUi = (ui) =>
    Object.entries(ui.layout).reduce(
        (layout, [axisId, dimensionIds]) => ({
            ...layout,
            [axisId]: dimensionIds
                .map((dimensionId) =>
                    dimensionCreate(
                        dimensionId,
                        ui.itemsByDimension[dimensionId],
                        {
                            filter: ui.conditions[dimensionId]?.condition,
                            ...(ui.conditions[dimensionId]?.legendSet && {
                                legendSet: {
                                    id: ui.conditions[dimensionId].legendSet,
                                },
                            }),
                        }
                    )
                )
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
