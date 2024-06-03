import { useCallback, useMemo, useState } from 'react'

const DEFAULT_WIDTH = 400
const MIN_WIDTH = 180
const MIN_PX_AT_END = 50

export const useResizableAccessorySidebar = (isHidden) => {
    const [isResizing, setIsResizing] = useState(false)
    const [width, setWidth] = useState(DEFAULT_WIDTH)
    const resetWidth = useCallback(() => {
        setWidth(DEFAULT_WIDTH)
    }, [])
    const styles = useMemo(
        () =>
            isHidden
                ? {
                      accessoryStyle: { width: 0 },
                      accessoryInnerStyle: {
                          width: `${width}px`,
                          transform: `translate3d(-${width}px, 0, 0)`,
                      },
                  }
                : {
                      accessoryStyle: { width: `${width}px` },
                      accessoryInnerStyle: { width: `${width}px` },
                  },
        [isHidden, width]
    )

    const onResizeHandleMouseDown = useCallback((event) => {
        setIsResizing(true)
        const startPageX = event.pageX
        let startWidth = undefined

        const onMouseMove = (event) => {
            setWidth((currentWidth) => {
                if (typeof startWidth === 'undefined') {
                    startWidth = currentWidth - event.movementX
                }

                const virtualWidth = startWidth + (event.pageX - startPageX)

                if (
                    virtualWidth <= MIN_WIDTH ||
                    event.pageX >= window.innerWidth - MIN_PX_AT_END
                ) {
                    return currentWidth
                } else {
                    return virtualWidth
                }
            })
        }
        /* Use the window as event target to avoid issues when the browser lags behind
         * and the drag handle temporarily loses its hover state  */
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener(
            'mouseup',
            () => {
                setIsResizing(false)
                window.removeEventListener('mousemove', onMouseMove)
            },
            { once: true }
        )
    }, [])

    return {
        ...styles,
        resetWidth,
        isResizing,
        onResizeHandleMouseDown,
    }
}
