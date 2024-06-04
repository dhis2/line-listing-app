import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetUiAccessoryPanelWidth } from '../../actions/ui.js'
import {
    ACCESSORY_PANEL_MIN_WIDTH,
    ACCESSORY_PANEL_MIN_PX_AT_END,
    setUserSidebarWidthToLocalStorage,
} from '../../modules/ui.js'
import { sGetUiAccessoryPanelWidth } from '../../reducers/ui.js'

export const useResizableAccessorySidebar = (isHidden) => {
    const dispatch = useDispatch()
    const userSettingWidth = useSelector(sGetUiAccessoryPanelWidth)
    const [isResizing, setIsResizing] = useState(false)
    const [width, setWidth] = useState(userSettingWidth)
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

    const onResizeHandleMouseDown = useCallback(
        (event) => {
            setIsResizing(true)
            const startPageX = event.pageX
            let startWidth = undefined
            let finalWidth = undefined

            const onMouseMove = (event) => {
                setWidth((currentWidth) => {
                    if (typeof startWidth === 'undefined') {
                        startWidth = finalWidth = currentWidth - event.movementX
                    }

                    const virtualWidth = startWidth + (event.pageX - startPageX)

                    if (
                        virtualWidth <= ACCESSORY_PANEL_MIN_WIDTH ||
                        event.pageX >=
                            window.innerWidth - ACCESSORY_PANEL_MIN_PX_AT_END
                    ) {
                        finalWidth = currentWidth
                        return currentWidth
                    } else {
                        finalWidth = virtualWidth
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
                    setUserSidebarWidthToLocalStorage(finalWidth)
                    dispatch(acSetUiAccessoryPanelWidth(finalWidth))
                },
                { once: true }
            )
        },
        [dispatch]
    )

    console.log(userSettingWidth)

    return {
        ...styles,
        isResizing,
        onResizeHandleMouseDown,
    }
}
