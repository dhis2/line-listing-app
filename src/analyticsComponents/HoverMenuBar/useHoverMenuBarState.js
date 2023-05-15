import { useCallback, useEffect, useState } from 'react'

export const useHoverMenuBarState = () => {
    const [openedDropdownEl, setOpenedDropdownEl] = useState(null)
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
        openedDropdownEl,
    }
}
