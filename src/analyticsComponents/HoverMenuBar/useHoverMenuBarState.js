import { useCallback, useEffect, useState } from 'react'

export const useHoverMenuBarState = () => {
    const [openedDropdownEl, setOpenedDropdownEl] = useState(null)
    const [isInHoverMode, setIsInHoverMode] = useState(false)

    const closeMenu = useCallback(() => {
        setIsInHoverMode(false)
        setOpenedDropdownEl(null)
    }, [])

    const onDropDownButtonClick = useCallback(
        (event) => {
            if (!isInHoverMode) {
                setIsInHoverMode(true)
                setOpenedDropdownEl(event.currentTarget)
            } else {
                closeMenu()
            }
        },
        [closeMenu, isInHoverMode]
    )

    const onDropDownButtonMouseOver = useCallback(
        (event) => {
            if (isInHoverMode) {
                setOpenedDropdownEl(event.currentTarget)
            }
        },
        [isInHoverMode]
    )

    useEffect(() => {
        if (isInHoverMode) {
            document.addEventListener('click', closeMenu, { once: true })
        }

        return () => {
            document.removeEventListener('click', closeMenu)
        }
    }, [closeMenu, isInHoverMode])

    return {
        closeMenu,
        onDropDownButtonClick,
        onDropDownButtonMouseOver,
        openedDropdownEl,
    }
}
