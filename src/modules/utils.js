import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_PERIOD,
} from '@dhis2/analytics'
import { useState, useEffect, useRef } from 'react'
import { DIMENSION_TYPE_STATUS } from './dimensionConstants.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from './visualization.js'

const DEFAULT_USER_INPUT_DELAY = 500

export const useDebounce = (value, delay = DEFAULT_USER_INPUT_DELAY) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    return debouncedValue
}

export const useDidUpdateEffect = (fn, inputs) => {
    const didMountRef = useRef(false)

    useEffect(() => {
        if (didMountRef.current) {
            fn()
        } else {
            didMountRef.current = true
        }
    }, inputs)
}

export const formatDimensionId = ({
    dimensionId,
    programStageId,
    programId,
    outputType,
}) => {
    return [
        outputType === OUTPUT_TYPE_TRACKED_ENTITY ? programId : undefined,
        programStageId,
        dimensionId,
    ]
        .filter((p) => p)
        .join('.')
}

export const extractDimensionIdParts = (id, inputType) => {
    let rawStageId
    const [dimensionId, part2, part3] = id.split('.').reverse()
    let programId = part3
    if (part3 || inputType !== OUTPUT_TYPE_TRACKED_ENTITY) {
        rawStageId = part2
    }
    if (inputType === OUTPUT_TYPE_TRACKED_ENTITY && !part3) {
        programId = part2
    }
    const [programStageId, repetitionIndex] = (rawStageId || '').split('[')
    return {
        dimensionId,
        programStageId,
        ...(programId ? { programId } : {}),
        repetitionIndex:
            repetitionIndex?.length &&
            repetitionIndex.substring(0, repetitionIndex.indexOf(']')),
    }
}

export const getDimensionsWithSuffix = ({
    dimensionIds,
    metadata,
    inputType,
}) => {
    const dimensions = dimensionIds.map((id) => {
        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(id, inputType)
        const dimension = {
            ...metadata[id],
            dimensionId,
            programStageId,
            programId,
        }
        if (!dimension.id) {
            dimension.id = id
        }
        return dimension
    })

    if (
        [OUTPUT_TYPE_ENROLLMENT, OUTPUT_TYPE_TRACKED_ENTITY].includes(inputType)
    ) {
        const dimensionsWithSuffix = dimensions.map((dimension) => {
            if (
                [DIMENSION_TYPE_DATA_ELEMENT, DIMENSION_TYPE_PERIOD].includes(
                    dimension.dimensionType || dimension.dimensionItemType
                )
            ) {
                const duplicates = dimensions.filter(
                    (d) =>
                        d.dimensionId === dimension.dimensionId &&
                        d !== dimension &&
                        ((dimension.programId && d.programId) ||
                            (dimension.programStageId && d.programStageId))
                )

                if (duplicates.length > 0) {
                    const sameProgramId = duplicates.find(
                        (dup) => dup.programId === dimension.programId
                    )
                    const thirdPartyDuplicates = duplicates
                        .filter((dup) => dup.programId !== dimension.programId)
                        .find((dpid) =>
                            duplicates.find(
                                (dup) =>
                                    dup.programStageId !==
                                        dpid.programStageId &&
                                    dup.programId === dpid.programId
                            )
                        )

                    if (sameProgramId || thirdPartyDuplicates) {
                        dimension.suffix =
                            metadata[dimension.programStageId].name
                    } else {
                        dimension.suffix = metadata[dimension.programId].name
                    }
                }
            } else if (
                // always suffix ou and statuses for TE
                inputType === OUTPUT_TYPE_TRACKED_ENTITY &&
                [
                    DIMENSION_TYPE_ORGANISATION_UNIT,
                    DIMENSION_TYPE_STATUS,
                ].includes(
                    dimension.dimensionType || dimension.dimensionItemType
                ) &&
                dimension.programId
            ) {
                dimension.suffix = metadata[dimension.programId].name
            }

            return dimension
        })
        return dimensionsWithSuffix
    }

    return dimensions
}
