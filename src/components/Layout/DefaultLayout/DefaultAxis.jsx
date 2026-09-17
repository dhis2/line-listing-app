import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    acSetUiOpenDimensionModal,
    acRemoveUiLayoutDimensions,
    acRemoveUiItems,
} from '../../../actions/ui.js'
import { getAxisName } from '../../../modules/axis.js'
import { getDimensionsWithSuffix } from '../../../modules/getDimensionsWithSuffix.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import {
    sGetUiDraggingId,
    sGetUiDimensionIdsByAxisId,
    sGetUiInputType,
    renderChipsSelector,
} from '../../../reducers/ui.js'
import { LAST, getDropzoneId } from '../../DndContext.jsx'
import Chip from '../Chip.jsx'
import { DropZone } from './DropZone.jsx'
import styles from './styles/DefaultAxis.module.css'

const DefaultAxis = ({ axisId, className }) => {
    const lastDropZoneId = getDropzoneId(axisId, LAST)
    const { over, setNodeRef } = useDroppable({
        id: lastDropZoneId,
    })

    const dispatch = useDispatch()
    const dimensionIds = useSelector((state) =>
        sGetUiDimensionIdsByAxisId(state, axisId)
    )
    const renderChips = useSelector(renderChipsSelector)
    const draggingId = useSelector(sGetUiDraggingId)
    const metadata = useSelector(sGetMetadata)
    const inputType = useSelector(sGetUiInputType)

    const activeIndex = draggingId ? dimensionIds.indexOf(draggingId) : -1

    const overLastDropZone = over?.id === lastDropZoneId

    const handleClearAxis = (e) => {
        e.currentTarget.blur()
        if (dimensionIds.length > 0) {
            dispatch(acRemoveUiLayoutDimensions(dimensionIds))
            dispatch(acRemoveUiItems(dimensionIds))
        }
    }

    const handleSettingsClick = (e) => {
        e.currentTarget.blur()
        console.log('Settings clicked')
    }

    return (
        <div ref={setNodeRef} className={styles.lastDropzone}>
            <div id={axisId} className={cx(styles.axisContainer, className)}>
                <div className={styles.label}>
                    <span>{getAxisName(axisId)}</span>
                    <div className={styles.labelActions}>
                        <button
                            className={styles.iconButton}
                            onClick={handleSettingsClick}
                            aria-label="Settings"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13.6455 10.3132C13.8407 10.118 14.1572 10.1181 14.3525 10.3132C14.5478 10.5085 14.5478 10.825 14.3525 11.0202L11.6865 13.6872C11.4913 13.8824 11.1747 13.8822 10.9795 13.6872L8.31246 11.0202C8.1172 10.825 8.1172 10.5085 8.31246 10.3132C8.50772 10.1179 8.82423 10.1179 9.01949 10.3132L11.332 12.6257L13.6455 10.3132Z"
                                    fill="#4A5768"
                                />
                                <path
                                    d="M10.834 13.3337V2.66675C10.834 2.39061 11.0578 2.16675 11.334 2.16675C11.6101 2.16675 11.834 2.39061 11.834 2.66675V13.3337C11.8338 13.6097 11.61 13.8337 11.334 13.8337C11.058 13.8337 10.8342 13.6097 10.834 13.3337Z"
                                    fill="#4A5768"
                                />
                                <path
                                    d="M4.39148 2.24865C4.58554 2.12065 4.84959 2.14231 5.02039 2.3131L7.6864 4.9801C7.88167 5.17536 7.88167 5.49187 7.6864 5.68713C7.49112 5.88206 7.17453 5.88228 6.97937 5.68713L4.6659 3.37365L2.3534 5.68713C2.15818 5.88217 1.84159 5.88217 1.64637 5.68713C1.45116 5.49192 1.45127 5.17537 1.64637 4.9801L4.31336 2.3131L4.39148 2.24865Z"
                                    fill="#4A5768"
                                />
                                <path
                                    d="M4.16602 13.3337V2.66675C4.16602 2.39061 4.38987 2.16675 4.66602 2.16675C4.94216 2.16675 5.16602 2.39061 5.16602 2.66675V13.3337C5.16584 13.6097 4.94205 13.8337 4.66602 13.8337C4.38998 13.8337 4.16619 13.6097 4.16602 13.3337Z"
                                    fill="#4A5768"
                                />
                            </svg>
                        </button>
                        <button
                            className={styles.iconButton}
                            onClick={handleClearAxis}
                            aria-label="Clear all dimensions"
                            title="Clear all dimensions"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clip-path="url(#clip0_3032_32706)">
                                    <path
                                        d="M10 11V12H4V11H10ZM11 10V4C11 3.44772 10.5523 3 10 3H4C3.44772 3 3 3.44772 3 4V10C3 10.5523 3.44772 11 4 11V12L3.7959 11.9893C2.85435 11.8938 2.1062 11.1457 2.01074 10.2041L2 10V4C2 2.89543 2.89543 2 4 2H10C11.1046 2 12 2.89543 12 4V10C12 11.0357 11.2128 11.887 10.2041 11.9893L10 12V11C10.5523 11 11 10.5523 11 10Z"
                                        fill="#4A5768"
                                    />
                                    <path
                                        d="M13 5C14.1046 5 15 5.89543 15 7V13C15 14.0357 14.2128 14.887 13.2041 14.9893L13 15H7L6.7959 14.9893C5.85435 14.8938 5.1062 14.1457 5.01074 13.2041L5 13V12H6V13C6 13.5523 6.44772 14 7 14H13C13.5523 14 14 13.5523 14 13V7C14 6.44772 13.5523 6 13 6H12V5H13Z"
                                        fill="#4A5768"
                                    />
                                    <path
                                        d="M10 6.5V7.5H4V6.5H10Z"
                                        fill="#4A5768"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3032_32706">
                                        <rect
                                            width="16"
                                            height="16"
                                            fill="white"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>
                </div>
                <SortableContext id={axisId} items={dimensionIds}>
                    <div
                        className={styles.content}
                        data-test={`${axisId}-axis`}
                    >
                        <DropZone
                            axisId={axisId}
                            firstElementId={dimensionIds[0]}
                            overLastDropZone={overLastDropZone}
                        />
                        {renderChips &&
                            getDimensionsWithSuffix({
                                dimensionIds,
                                metadata,
                                inputType,
                            }).map((dimension, i) => (
                                <Chip
                                    key={`${axisId}-${dimension.id}`}
                                    onClick={() =>
                                        dispatch(
                                            acSetUiOpenDimensionModal(
                                                dimension.id
                                            )
                                        )
                                    }
                                    dimension={dimension}
                                    axisId={axisId}
                                    isLast={i === dimensionIds.length - 1}
                                    overLastDropZone={overLastDropZone}
                                    activeIndex={activeIndex}
                                />
                            ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    )
}

DefaultAxis.propTypes = {
    axisId: PropTypes.string,
    className: PropTypes.string,
}

export default DefaultAxis
