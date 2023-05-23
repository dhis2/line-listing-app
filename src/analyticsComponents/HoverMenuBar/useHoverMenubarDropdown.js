import { useRef } from 'react'
import { useHoverMenuBarContext } from './HoverMenuBar.js'

export const useHoverMenubarDropdown = () => {
    const buttonRef = useRef()
    const {
        closeMenu,
        onDropDownButtonClick,
        onDropDownButtonMouseOver,
        openedDropdownEl,
    } = useHoverMenuBarContext()

    return {
        buttonRef,
        closeMenu,
        isOpen: openedDropdownEl === buttonRef.current,
        onClick: onDropDownButtonClick,
        onMouseOver: onDropDownButtonMouseOver,
    }
}
