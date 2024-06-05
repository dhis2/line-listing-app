import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetUiAccessoryPanelWidth } from '../../actions/ui.js'
import {
    ACCESSORY_PANEL_MIN_WIDTH,
    ACCESSORY_PANEL_MIN_PX_AT_END,
    setUserSidebarWidthToLocalStorage,
    ACCESSORY_PANEL_DEFAULT_WIDTH,
    getUserSidebarWidth,
} from '../../modules/ui.js'
import { debounceEventHandler } from '../../modules/utils.js'
import { sGetUiAccessoryPanelWidth } from '../../reducers/ui.js'

const ARROW_LEFT_KEY = 'ArrowLeft'
const ARROW_RIGHT_KEY = 'ArrowRight'

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
            event.preventDefault()
            event.stopPropagation()

            const resizeHandleElement = event.currentTarget
            /* If the user focusses the draghandle by tabbing/ keyboard navigation,
             * but never blurs it, and then starts resizing using the mouse, it causes
             * problems we need to deal with. These situations can be identified by
             * the fact that theb drag handle is already the active element when the
             * mousedown event fires */
            const isActive = document.activeElement === resizeHandleElement

            if (isActive) {
                // Manually call blur to ensure event handlers are removed
                resizeHandleElement.blur()
            }

            setIsResizing(true)

            /* Because the user never blurred the draghandle, the
             * width preference is not yet updated when this callback
             * is executed. Since the userSettingWidth is stale, the width
             * needs to be assessed some other way. The solution below
             * works but will break when make any changes to the relevant
             * DOM structure. */
            const startWidth = isActive
                ? resizeHandleElement.previousSibling.offsetWidth
                : userSettingWidth
            let cumulativeDeltaX = 0
            let finalWidth = startWidth

            const onMouseMove = (event) => {
                event.preventDefault()
                event.stopPropagation()
                cumulativeDeltaX += event.movementX
                const virtualWidth = startWidth + cumulativeDeltaX
                const isBelowLowerBound =
                    virtualWidth < ACCESSORY_PANEL_MIN_WIDTH
                const isAboveUpperBound =
                    event.pageX >
                    window.innerWidth - ACCESSORY_PANEL_MIN_PX_AT_END

                if (isBelowLowerBound) {
                    finalWidth = ACCESSORY_PANEL_MIN_WIDTH
                } else if (isAboveUpperBound) {
                    const excessWidth =
                        event.pageX -
                        (window.innerWidth - ACCESSORY_PANEL_MIN_PX_AT_END)
                    finalWidth = virtualWidth - excessWidth
                } else {
                    finalWidth = virtualWidth
                }

                setWidth(finalWidth)
            }
            /* Use the window as event target to avoid issues when the browser lags behind
             * and the drag handle temporarily loses its hover state  */
            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener(
                'mouseup',
                (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsResizing(false)
                    window.removeEventListener('mousemove', onMouseMove)
                    setUserSidebarWidthToLocalStorage(finalWidth)
                    dispatch(acSetUiAccessoryPanelWidth(finalWidth))
                },
                { once: true }
            )
        },
        [dispatch, userSettingWidth]
    )

    const onResizeHandleFocus = useCallback(
        (event) => {
            setIsResizing(true)
            const resizeHandleElement = event.currentTarget
            const { right: startPageX } =
                resizeHandleElement.getBoundingClientRect()
            const startWidth = userSettingWidth
            let cumulativeDeltaX = 0
            let finalWidth = startWidth

            const onKeyDown = (event) => {
                // Ignore all keys apart from left and right arrow
                if (
                    event.key !== ARROW_LEFT_KEY &&
                    event.key !== ARROW_RIGHT_KEY
                ) {
                    return
                }
                const deltaX = event.key === ARROW_LEFT_KEY ? -10 : 10
                const virtualCumulativeDeltaX = cumulativeDeltaX + deltaX
                const virtualWidth = startWidth + virtualCumulativeDeltaX
                const isAboveLowerBound =
                    virtualWidth >= ACCESSORY_PANEL_MIN_WIDTH
                const isBelowUpperBound =
                    startPageX + virtualCumulativeDeltaX <=
                    window.innerWidth - ACCESSORY_PANEL_MIN_PX_AT_END

                if (isAboveLowerBound && isBelowUpperBound) {
                    cumulativeDeltaX = virtualCumulativeDeltaX
                    finalWidth = virtualWidth
                    setWidth(virtualWidth)
                }
            }
            resizeHandleElement.addEventListener('keydown', onKeyDown)
            resizeHandleElement.addEventListener(
                'blur',
                (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsResizing(false)
                    window.removeEventListener('keydown', onKeyDown)
                    setUserSidebarWidthToLocalStorage(finalWidth)
                    dispatch(acSetUiAccessoryPanelWidth(finalWidth))
                },
                { once: true }
            )
        },
        [dispatch, userSettingWidth]
    )

    useEffect(() => {
        // Respond to reset via view menu
        if (userSettingWidth === ACCESSORY_PANEL_DEFAULT_WIDTH) {
            setWidth(ACCESSORY_PANEL_DEFAULT_WIDTH)
        }
    }, [userSettingWidth])

    useEffect(() => {
        const debouncedOnResize = debounceEventHandler(() => {
            /*`getUserSidebarWidth` takes window width into
             * account so the returned value is save to use */
            const width = getUserSidebarWidth()
            setWidth(width)
            setUserSidebarWidthToLocalStorage(width)
            dispatch(acSetUiAccessoryPanelWidth(width))
        })
        window.addEventListener('resize', debouncedOnResize)
        return () => window.removeEventListener('resize', debouncedOnResize)
    }, [dispatch])

    return {
        ...styles,
        isResizing,
        onResizeHandleMouseDown,
        onResizeHandleFocus,
    }
}
