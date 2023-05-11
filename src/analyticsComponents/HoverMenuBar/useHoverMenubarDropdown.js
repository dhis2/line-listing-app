import { useContext, useRef } from 'react'
import { HoverMenuBarContext } from './HoverMenuBarContext.js'

export const useHoverMenubarDropdown = () => {
    const buttonRef = useRef()
    const {
        closeMenu,
        onDropDownButtonClick,
        onDropDownButtonMouseOver,
        openedDropdownEl,
    } = useContext(HoverMenuBarContext)

    return {
        buttonRef,
        closeMenu,
        isOpen: openedDropdownEl === buttonRef.current,
        onClick: onDropDownButtonClick,
        onMouseOver: onDropDownButtonMouseOver,
    }
}
