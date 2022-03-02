import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../modules/utils.js'
import {
    sGetUiShowDetailsPanel,
    sGetUiShowAccessoryPanel,
} from '../../reducers/ui.js'

const PAGE_LEFT_SIDEBARS_WIDTH = 260
const PAGE_RIGHT_SIDEBAR_WIDTH = 380
const PAGE_PADDING = 2 * 4
const PAGE_BORDER = 2 * 1

const MODAL_SIDEBAR_WIDTH = 300
const MODAL_GAP = 16
const MODAL_SIDE_PADDING = 2 * 24
const MODAL_SIDE_MARGINS = 2 * 128

const className = '__scrollbar-width-test__'
const styles = `
    .${className} {
        position: absolute;
        top: -9999px;
        width: 100px;
        height: 100px;
        overflow-y: scroll;
    }
`

const scrollbarWidth = (() => {
    const style = document.createElement('style')
    style.innerHTML = styles

    const el = document.createElement('div')
    el.classList.add(className)

    document.body.appendChild(style)
    document.body.appendChild(el)

    const width = el.offsetWidth - el.clientWidth

    document.body.removeChild(style)
    document.body.removeChild(el)

    return width
})()

const computeOuterWidthInModal = ({ windowWidth }) =>
    windowWidth -
    MODAL_SIDEBAR_WIDTH -
    MODAL_GAP -
    MODAL_SIDE_PADDING -
    MODAL_SIDE_MARGINS

const computeOuterWidthInPage = ({ windowWidth, leftOpen, rightOpen }) => {
    let availableOuterWidth =
        windowWidth - PAGE_LEFT_SIDEBARS_WIDTH - PAGE_PADDING - PAGE_BORDER

    if (leftOpen) {
        availableOuterWidth -= PAGE_LEFT_SIDEBARS_WIDTH
    }

    if (rightOpen) {
        availableOuterWidth -= PAGE_RIGHT_SIDEBAR_WIDTH
    }

    return availableOuterWidth
}

const computeAvailableOuterWidth = ({
    isInModal,
    windowWidth,
    leftOpen,
    rightOpen,
}) =>
    isInModal
        ? computeOuterWidthInModal({ windowWidth })
        : computeOuterWidthInPage({ windowWidth, leftOpen, rightOpen })

export const useAvailableWidth = (isInModal) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const debouncedWindowWidth = useDebounce(windowWidth, 150)
    const leftOpen = useSelector(sGetUiShowAccessoryPanel)
    const rightOpen = useSelector(sGetUiShowDetailsPanel)
    const [availableOuterWidth, setAvailableOuterWidth] = useState(
        computeAvailableOuterWidth({
            isInModal,
            windowWidth,
            leftOpen,
            rightOpen,
        })
    )

    useEffect(() => {
        const onResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    useEffect(() => {
        setAvailableOuterWidth(
            computeAvailableOuterWidth({
                isInModal,
                windowWidth: debouncedWindowWidth,
                leftOpen,
                rightOpen,
            })
        )
    }, [isInModal, leftOpen, rightOpen, debouncedWindowWidth])

    return {
        availableOuterWidth,
        availableInnerWidth: availableOuterWidth - scrollbarWidth - PAGE_BORDER,
    }
}
