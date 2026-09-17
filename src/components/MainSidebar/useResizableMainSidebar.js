import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetUiMainSidebarWidth } from '../../actions/ui.js'
import { sGetUiMainSidebarWidth } from '../../reducers/ui.js'

const MIN_WIDTH = 200
const MAX_WIDTH = 800

export const useResizableMainSidebar = () => {
    const dispatch = useDispatch()
    const width = useSelector(sGetUiMainSidebarWidth)
    const isResizing = useRef(false)
    const startX = useRef(0)
    const startWidth = useRef(0)

    const handleMouseMove = useCallback((e) => {
        if (!isResizing.current) return

        const deltaX = e.clientX - startX.current
        const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth.current + deltaX))
        
        dispatch(acSetUiMainSidebarWidth(newWidth))
    }, [dispatch])

    const handleMouseUp = useCallback(() => {
        if (!isResizing.current) return
        
        isResizing.current = false
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        
        // Remove event listeners when resizing ends
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }, [])

    const handleMouseDown = useCallback((e) => {
        isResizing.current = true
        startX.current = e.clientX
        startWidth.current = width
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
        e.preventDefault()
        
        // Add event listeners immediately when resizing starts
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }, [width, handleMouseMove, handleMouseUp])

    const handleDoubleClick = useCallback(() => {
        dispatch(acSetUiMainSidebarWidth(400))
    }, [dispatch])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [handleMouseMove, handleMouseUp])

    return {
        width,
        handleMouseDown,
        handleDoubleClick,
    }
}
