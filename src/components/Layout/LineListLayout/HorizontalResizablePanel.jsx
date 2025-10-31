import PropTypes from 'prop-types'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import classes from './HorizontalResizablePanel.module.css'

const HorizontalResizablePanel = ({
    leftPanel,
    rightPanel,
    defaultWidth,
    minWidth,
}) => {
    const [leftWidth, setLeftWidth] = useState(defaultWidth)
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef(null)
    const startXRef = useRef(null)
    const startWidthRef = useRef(null)

    const handleMouseDown = useCallback(
        (e) => {
            e.preventDefault()
            setIsDragging(true)
            startXRef.current = e.clientX
            startWidthRef.current = leftWidth
        },
        [leftWidth]
    )

    const handleMouseMove = useCallback(
        (e) => {
            if (!isDragging || startXRef.current === null) return

            const delta = e.clientX - startXRef.current
            const newWidth = Math.max(minWidth, startWidthRef.current + delta)

            // Also ensure right panel has minimum width
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth
                const maxWidth = containerWidth - minWidth
                setLeftWidth(Math.min(newWidth, maxWidth))
            }
        },
        [isDragging, minWidth]
    )

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
        startXRef.current = null
        startWidthRef.current = null
    }, [])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            // Prevent text selection while dragging
            document.body.style.userSelect = 'none'
            document.body.style.cursor = 'ew-resize'

            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
                document.body.style.userSelect = ''
                document.body.style.cursor = ''
            }
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    return (
        <div ref={containerRef} className={classes.container}>
            <div
                className={classes.leftPanel}
                style={{ width: `${leftWidth}px` }}
            >
                {leftPanel}
            </div>
            <div
                className={classes.divider}
                onMouseDown={handleMouseDown}
                data-test="horizontal-resizable-divider"
            >
                <div className={classes.dividerHandle} />
            </div>
            <div className={classes.rightPanel}>{rightPanel}</div>
        </div>
    )
}

HorizontalResizablePanel.propTypes = {
    leftPanel: PropTypes.node.isRequired,
    rightPanel: PropTypes.node.isRequired,
    defaultWidth: PropTypes.number,
    minWidth: PropTypes.number,
}

HorizontalResizablePanel.defaultProps = {
    defaultWidth: 400,
    minWidth: 200,
}

export default HorizontalResizablePanel
