import { useState, useEffect, useRef } from 'react'

const DEFAULT_USER_INPUT_DELAY = 500

export const debounceEventHandler = (callback, delay = 150) => {
    let timer = null
    return (event) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(callback, delay, event)
    }
}

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
