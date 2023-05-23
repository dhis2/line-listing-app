import { useCallback, useEffect, useState } from 'react'

export const useHoverMenuBarState = () => {
    const [openedDropdownEl, setOpenedDropdownEl] = useState(null)
    const [openedSubMenuEl, setOpenedSubMenuEl] = useState(null)
    const [isInHoverMode, setIsInHoverMode] = useState(false)

    const closeMenu = useCallback(() => {
        setIsInHoverMode(false)
        setOpenedDropdownEl(null)
    }, [])

    const closeMenuByDocumentClick = useCallback((event) => {
        console.log(event.target, event.currentTarget)
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

    const onSubMenuAnchorMouseEnter = useCallback((event) => {
        setOpenedSubMenuEl(event.currentTarget)
    }, [])

    const onMenuItemMouseEnter = useCallback(() => {
        setOpenedSubMenuEl(null)
    }, [])

    useEffect(() => {
        if (isInHoverMode) {
            document.addEventListener('click', closeMenuByDocumentClick, {
                once: true,
            })
        }

        return () => {
            document.removeEventListener('click', closeMenuByDocumentClick)
        }
    }, [closeMenuByDocumentClick, isInHoverMode])

    return {
        closeMenu,
        onDropDownButtonClick,
        onDropDownButtonMouseOver,
        onSubMenuAnchorMouseEnter,
        onMenuItemMouseEnter,
        openedSubMenuEl,
        openedDropdownEl,
    }
}
