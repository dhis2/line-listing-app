import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../modules/utils.js'
import {
    sGetUiShowDetailsPanel,
    sGetUiShowAccessoryPanel,
} from '../../reducers/ui.js'

const LEFT_SIDEBARS_WIDTH = 260
const RIGHT_SIDEBAR_WIDTH = 380
const PADDING = 2 * 4
const BORDER = 2 * 1

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

const computeAvailableWidth = (windowWidth, leftOpen, rightOpen) => {
    let availableWidth = windowWidth - LEFT_SIDEBARS_WIDTH - PADDING - BORDER

    if (leftOpen) {
        availableWidth -= LEFT_SIDEBARS_WIDTH
    }

    if (rightOpen) {
        availableWidth -= RIGHT_SIDEBAR_WIDTH
    }

    return availableWidth
}

export const useAvailableWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const debouncedWindowWidth = useDebounce(windowWidth, 150)
    const leftOpen = useSelector(sGetUiShowAccessoryPanel)
    const rightOpen = useSelector(sGetUiShowDetailsPanel)
    const [availableWidth, setAvailableWidth] = useState(
        computeAvailableWidth(windowWidth, leftOpen, rightOpen)
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
        setAvailableWidth(
            computeAvailableWidth(debouncedWindowWidth, leftOpen, rightOpen)
        )
    }, [leftOpen, rightOpen, debouncedWindowWidth])

    return {
        availableWidth,
        scrollbarWidth,
    }
}
