import { useCallback, useMemo, useState } from 'react'

const DEFAULT_WIDTH = 400
// const MIN_WIDTH = 180

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
        let baseX = event.pageX
        let deltaX = 0
        const onMouseMove = (event) => {
            setIsResizing(true)
            deltaX = event.pageX - baseX
            baseX = event.pageX
            setWidth((currentWidth) => currentWidth + deltaX)
        }

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
