import { useState, useEffect, useRef } from 'react'
import { OUTPUT_TYPE_TRACKED_ENTITY } from './visualization.js'

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

export const formatDimensionId = (dimensionId, programStageId) =>
    programStageId ? `${programStageId}.${dimensionId}` : dimensionId

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
