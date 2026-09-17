import PropTypes from 'prop-types'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import classes from './HorizontalResizablePanel.module.css'

const HorizontalResizablePanel = ({
    leftPanel,
    rightPanel,
    defaultWidth,
    defaultWidthPercent = 70,
    minWidth,
}) => {
    const [leftWidth, setLeftWidth] = useState(defaultWidth)
    const [isDragging, setIsDragging] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const containerRef = useRef(null)
    const startXRef = useRef(null)
    const startWidthRef = useRef(null)
    const previousContainerWidthRef = useRef(0)

    // Initialize width based on percentage if no fixed width is provided
    useEffect(() => {
        if (!defaultWidth && containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth
            // Only initialize if container has a width (is visible)
            if (containerWidth > 0) {
                const calculatedWidth =
                    (containerWidth * defaultWidthPercent) / 100
                setLeftWidth(Math.max(minWidth, calculatedWidth))
                setIsInitialized(true)
            }
        } else if (defaultWidth && !isInitialized) {
            setIsInitialized(true)
        }
    }, [defaultWidth, defaultWidthPercent, minWidth, isInitialized])

    // Use ResizeObserver to detect when container becomes visible
    useEffect(() => {
        if (!defaultWidth && containerRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const containerWidth = entry.contentRect.width
                    const previousWidth = previousContainerWidthRef.current

                    // If container just became visible (went from 0 or very small to a proper width)
                    if (
                        containerWidth > 0 &&
                        previousWidth === 0 &&
                        containerWidth > minWidth
                    ) {
                        const calculatedWidth =
                            (containerWidth * defaultWidthPercent) / 100
                        setLeftWidth(Math.max(minWidth, calculatedWidth))
                    }

                    previousContainerWidthRef.current = containerWidth
                }
            })

            resizeObserver.observe(containerRef.current)

            return () => {
                resizeObserver.disconnect()
            }
        }
    }, [defaultWidth, defaultWidthPercent, minWidth])

    // Handle window resize to maintain percentage-based width
    useEffect(() => {
        if (!defaultWidth && isInitialized) {
            const handleResize = () => {
                if (containerRef.current) {
                    const containerWidth = containerRef.current.offsetWidth
                    const calculatedWidth =
                        (containerWidth * defaultWidthPercent) / 100
                    setLeftWidth(Math.max(minWidth, calculatedWidth))
                }
            }

            window.addEventListener('resize', handleResize)
            return () => window.removeEventListener('resize', handleResize)
        }
    }, [defaultWidth, defaultWidthPercent, minWidth, isInitialized])

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
    defaultWidthPercent: PropTypes.number,
    minWidth: PropTypes.number,
}

HorizontalResizablePanel.defaultProps = {
    defaultWidth: undefined,
    minWidth: 200,
}

export default HorizontalResizablePanel
