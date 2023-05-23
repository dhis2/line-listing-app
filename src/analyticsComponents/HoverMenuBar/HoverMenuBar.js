import PropTypes from 'prop-types'
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

const throwErrorIfNotInitialized = () => {
    throw new Error('`HoverMenuBarContext` has not been initialised')
}

const HoverMenuBarContext = createContext({
    closeMenu: throwErrorIfNotInitialized,
    onDropDownButtonClick: throwErrorIfNotInitialized,
    onDropDownButtonMouseOver: throwErrorIfNotInitialized,
    openedDropdownEl: null,
})

const useHoverMenuBarContext = () => useContext(HoverMenuBarContext)

const HoverMenuBar = ({ children }) => {
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

    const closeMenuWithEsc = useCallback(
        (event) => {
            if (event.keyCode === 27) {
                closeMenu()
            }
        },
        [closeMenu]
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

    return (
        <HoverMenuBarContext.Provider
            value={{
                closeMenu,
                onDropDownButtonClick,
                onDropDownButtonMouseOver,
                openedDropdownEl,
            }}
        >
            <div onKeyDown={closeMenuWithEsc}>
                {children}
                <style jsx>{`
                    display: flex;
                `}</style>
            </div>
        </HoverMenuBarContext.Provider>
    )
}

HoverMenuBar.propTypes = {
    children: PropTypes.node.isRequired,
}
export { HoverMenuBar, useHoverMenuBarContext }
