import { dimensionCreate, VIS_TYPE_LINE_LIST } from '@dhis2/analytics'
import pick from 'lodash-es/pick'
import { extractDimensionIdParts } from './dimensionId.js'
import { BASE_FIELD_TYPE } from './fields.js'
import { getAdaptedUiLayoutByType, getFilteredLayout } from './layout.js'
import { getInvalidDimensions } from './layoutValidation.js'
import {
    options,
    OPTION_LEGEND_DISPLAY_STRATEGY,
    OPTION_LEGEND_DISPLAY_STYLE,
    OPTION_LEGEND_SET,
    OPTION_SHOW_LEGEND_KEY,
} from './options.js'
import { parseUiRepetition } from './repetition.js'
import {
    getDimensionIdFromHeaderName,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from './visualization.js'

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

export const getDefaultFromUi = (current, ui, metadata = {}) => {
    // Get the adapted layout
    const adaptedLayout = getAdaptedUiLayoutByType(
        ui.layout,
        VIS_TYPE_LINE_LIST
    )

    // Filter out invalid dimensions
    const outputType = ui.output?.type || ui.input?.type
    const invalidDimensionIds = getInvalidDimensions(
        adaptedLayout,
        outputType,
        metadata
    )

    const filteredLayout = getFilteredLayout(
        adaptedLayout,
        Array.from(invalidDimensionIds)
    )

    const adaptedUi = {
        ...ui,
        layout: filteredLayout,
        itemsByDimension: getItemsByDimensionFromUi(ui),
        sorting: getAdaptedUiSorting(ui.sorting, current),
    }

    const output = {
        // merge with current if current is a saved visualization to keep id, access etc
        ...(current?.id && current),
        [BASE_FIELD_TYPE]: adaptedUi.type,
        outputType: outputType,
        sorting: adaptedUi.sorting,
        ...getEntityTypeFromUi(adaptedUi),
        ...getProgramFromUi(adaptedUi),
        ...getProgramStageFromUi(adaptedUi),
        ...getAxesFromUi(adaptedUi),
        ...getOptionsFromUi(adaptedUi),
    }

    if (output.outputType === OUTPUT_TYPE_TRACKED_ENTITY) {
        // delete program and programStage if output type is TE as the api doesn't accept these props at all
        delete output.program
        delete output.programStage
    } else {
        // delete trackedEntityType if output type is not TE
        delete output.trackedEntityType
    }

    return output
}

export const getEntityTypeFromUi = (ui) => ({
    trackedEntityType: { id: ui.entityType?.id },
})

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

export const getAxesFromUi = (ui) => {
    const outputType = ui.output?.type || ui.input?.type

    return Object.entries(ui.layout).reduce(
        (layout, [axisId, dimensionIds]) => ({
            ...layout,
            [axisId]: dimensionIds
                .map((id) => {
                    const { programId, programStageId, dimensionId } =
                        extractDimensionIdParts(id, outputType)

                    // For tracked entity output, we need to handle dimension ID conversion
                    // from 2-part (stageId.dimensionId) to 3-part (programId.stageId.dimensionId)
                    let actualProgramId = programId
                    let actualProgramStageId = programStageId

                    if (
                        outputType === OUTPUT_TYPE_TRACKED_ENTITY &&
                        ui.program?.id
                    ) {
                        // If we have a programId but no programStageId, it means the layout
                        // has 2-part dimensions (stageId.dimensionId) that need conversion
                        if (programId && !programStageId) {
                            // The extracted programId is actually a stage ID
                            actualProgramStageId = programId
                            actualProgramId = ui.program.id
                        }
                        // If we already have both, use the real program ID
                        else if (programStageId) {
                            actualProgramId = ui.program.id
                        }
                    }

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
                            ...(actualProgramId && {
                                program: {
                                    id: actualProgramId,
                                },
                            }),
                            ...(actualProgramStageId && {
                                programStage: {
                                    id: actualProgramStageId,
                                },
                            }),
                        }
                    )
                })
                .filter((dim) => dim !== null),
        }),
        {}
    )
}

export const getItemsByDimensionFromUi = (ui) => {
    const result = {}
    Object.keys(ui.itemsByDimension).forEach(
        (key) => (result[key] = ui.itemsByDimension[key])
    )
    return result
}
