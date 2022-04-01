import { dimensionCreate, VIS_TYPE_LINE_LIST } from '@dhis2/analytics'
import pick from 'lodash-es/pick'
import { BASE_FIELD_TYPE } from './fields.js'
import { getAdaptedUiLayoutByType } from './layout.js'
import { options } from './options.js'
import { parseUiRepetition } from './ui.js'
import { extractDimensionParts } from './utils.js'

export const getDefaultFromUi = (current, ui) => {
    const adaptedUi = {
        ...ui,
        layout: {
            ...getAdaptedUiLayoutByType(ui.layout, VIS_TYPE_LINE_LIST),
        },
        itemsByDimension: getItemsByDimensionFromUi(ui),
    }

    return {
        ...current, // TODO: This turns it in to an "update existing" rather than a "create from scratch" operation, is this intentional?
        [BASE_FIELD_TYPE]: adaptedUi.type,
        outputType: adaptedUi.input.type,
        ...getProgramFromUi(adaptedUi),
        ...getProgramStageFromUi(adaptedUi),
        ...getAxesFromUi(adaptedUi),
        ...getOptionsFromUi(adaptedUi),
    }
}

export const getProgramFromUi = (ui) => ({
    program: { id: ui.program?.id },
})

export const getProgramStageFromUi = (ui) =>
    ui.program?.stageId
        ? {
              programStage: { id: ui.program?.stageId },
          }
        : {}

export const getOptionsFromUi = (ui) => pick(ui.options, Object.keys(options))

export const getAxesFromUi = (ui) =>
    Object.entries(ui.layout).reduce(
        (layout, [axisId, dimensionIds]) => ({
            ...layout,
            [axisId]: dimensionIds
                .map((id) => {
                    const { dimensionId, programStageId } =
                        extractDimensionParts(id)

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
