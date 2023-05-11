import { createContext } from 'react'

const throwErrorIfNotInitialized = () => {
    throw new Error('`HoverMenuBarContext` has not been initialised')
}

export const HoverMenuBarContext = createContext({
    closeMenu: throwErrorIfNotInitialized,
    onDropDownButtonClick: throwErrorIfNotInitialized,
    onDropDownButtonMouseOver: throwErrorIfNotInitialized,
    openedDropdownEl: null,
})
