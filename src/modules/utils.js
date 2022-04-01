import { useState, useEffect, useRef } from 'react'

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

export const extractDimensionIdParts = (input) => {
    const [dimensionId, rawStageId] = input.split('.').reverse()
    const [programStageId, repetitionIndex] = (rawStageId || '').split('[')
    return {
        dimensionId,
        programStageId,
        repetitionIndex:
            repetitionIndex?.length &&
            repetitionIndex.substring(0, repetitionIndex.indexOf(']')),
    }
}
