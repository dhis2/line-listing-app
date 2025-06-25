import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetUiAccessoryPanelWidth } from '../../actions/ui.js'
import {
    ARROW_LEFT_KEY,
    ARROW_RIGHT_KEY,
    ACCESSORY_PANEL_MIN_WIDTH,
    ACCESSORY_PANEL_MIN_PX_AT_END,
    ACCESSORY_PANEL_DEFAULT_WIDTH,
} from '../../modules/accessoryPanelConstants.js'
import { setUserSidebarWidthToLocalStorage } from '../../modules/localStorage.js'
import { getUserSidebarWidth } from '../../modules/ui.js'
import { debounceEventHandler } from '../../modules/utils.js'
import { sGetUiAccessoryPanelWidth } from '../../reducers/ui.js'

const createWidthWithinBoundsCalculator = (event, startWidth) => {
    const element = event.currentTarget
    const isKeyboardMode = event.type === 'focus'
    const rect = element.getBoundingClientRect()
    const minWidth = ACCESSORY_PANEL_MIN_WIDTH
    /* This needs to correspond with right edge of the accessory sidebar
     * which is 2px right of the left edge of the resize handle */
    const startPageX = Math.ceil(rect.left + 2)
    const maxPageX = window.innerWidth - ACCESSORY_PANEL_MIN_PX_AT_END
    const maxDeltaX = maxPageX - startPageX
    const maxWidth = startWidth + maxDeltaX

    let virtualWidth = startWidth
    let actualWidth = startWidth

    return (deltaX) => {
        virtualWidth = isKeyboardMode
            ? actualWidth + deltaX
            : virtualWidth + deltaX

        if (virtualWidth < minWidth) {
            actualWidth = minWidth
        } else if (virtualWidth > maxWidth) {
            actualWidth = maxWidth
        } else {
            actualWidth = virtualWidth
        }

        return actualWidth
    }
}

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
             * the fact that the draghandle is already the active element when the
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
            const computeWidth = createWidthWithinBoundsCalculator(
                event,
                startWidth
            )
            let width = startWidth

            const onMouseMove = (event) => {
                event.preventDefault()
                event.stopPropagation()

                // if
                width = computeWidth(event.movementX)

                setWidth(width)
            }
            /* Use the window as event target to avoid issues when the browser
             * lags behind and the draghandle temporarily loses its hover state */
            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener(
                'mouseup',
                (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsResizing(false)
                    window.removeEventListener('mousemove', onMouseMove)
                    setUserSidebarWidthToLocalStorage(width)
                    dispatch(acSetUiAccessoryPanelWidth(width))
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
            const startWidth = userSettingWidth
            const computeWidth = createWidthWithinBoundsCalculator(
                event,
                startWidth
            )

            let width = startWidth

            const onKeyDown = (event) => {
                // Ignore all keys apart from left and right arrow
                if (
                    event.key !== ARROW_LEFT_KEY &&
                    event.key !== ARROW_RIGHT_KEY
                ) {
                    return
                }
                const deltaX = event.key === ARROW_LEFT_KEY ? -10 : 10
                width = computeWidth(deltaX)
                console.log('key down set width', width)
                setWidth(width)
            }
            console.log('add keydown event listener')
            resizeHandleElement.addEventListener('keydown', onKeyDown)
            resizeHandleElement.addEventListener(
                'blur',
                (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsResizing(false)
                    console.log('remove keydown event listener', width)
                    resizeHandleElement.removeEventListener(
                        'keydown',
                        onKeyDown
                    )
                    setUserSidebarWidthToLocalStorage(width)
                    dispatch(acSetUiAccessoryPanelWidth(width))
                },
                { once: true }
            )
        },
        [dispatch, userSettingWidth]
    )

    const onResizeHandleDblClick = (event) => {
        console.log('resize dbl click', event)
        event.stopPropagation()
        event.preventDefault()
        setWidth(ACCESSORY_PANEL_DEFAULT_WIDTH)
        setUserSidebarWidthToLocalStorage(ACCESSORY_PANEL_DEFAULT_WIDTH)
        dispatch(acSetUiAccessoryPanelWidth(ACCESSORY_PANEL_DEFAULT_WIDTH))
    }

    useEffect(() => {
        // Respond to reset via view menu
        if (userSettingWidth === ACCESSORY_PANEL_DEFAULT_WIDTH) {
            console.log('user settings width default width')
            setWidth(ACCESSORY_PANEL_DEFAULT_WIDTH)
        }
    }, [userSettingWidth])

    useEffect(() => {
        const debouncedOnResize = debounceEventHandler(() => {
            /*`getUserSidebarWidth` takes window width into
             * account so the returned value is save to use */
            const width = getUserSidebarWidth()
            console.log('resize debounce width', width)
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
        onResizeHandleDblClick,
    }
}
