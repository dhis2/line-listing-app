import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../../actions/ui.js'
import { getAxisName } from '../../../modules/axis.js'
import { getDimensionsWithNameModifier } from '../../../modules/getDimensionsWithNameModifier.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import {
    sGetUiDraggingId,
    sGetUiDimensionIdsByAxisId,
    sGetUiInputType,
    renderChipsSelector,
    sGetDimensionIdsFromLayout,
} from '../../../reducers/ui.js'
import { LAST, getDropzoneId } from '../../DndContext.js'
import Chip from '../Chip.js'
import { DropZone } from './DropZone.js'
import styles from './styles/DefaultAxis.module.css'

const DefaultAxis = ({ axisId, className }) => {
    const lastDropZoneId = getDropzoneId(axisId, LAST)
    const { over, setNodeRef } = useDroppable({
        id: lastDropZoneId,
    })

    const dispatch = useDispatch()
    const axisDimensionIds = useSelector((state) =>
        sGetUiDimensionIdsByAxisId(state, axisId)
    )
    const renderChips = useSelector(renderChipsSelector)
    const draggingId = useSelector(sGetUiDraggingId)
    const metadata = useSelector(sGetMetadata)
    const inputType = useSelector(sGetUiInputType)
    const layoutDimensionIds = useSelector(sGetDimensionIdsFromLayout)

    const activeIndex = draggingId ? axisDimensionIds.indexOf(draggingId) : -1

    const overLastDropZone = over?.id === lastDropZoneId

    return (
        <div ref={setNodeRef} className={styles.lastDropzone}>
            <div id={axisId} className={cx(styles.axisContainer, className)}>
                <div className={styles.label}>{getAxisName(axisId)}</div>
                <SortableContext id={axisId} items={axisDimensionIds}>
                    <div
                        className={styles.content}
                        data-test={`${axisId}-axis`}
                    >
                        <DropZone
                            axisId={axisId}
                            firstElementId={axisDimensionIds[0]}
                            overLastDropZone={overLastDropZone}
                        />
                        {renderChips &&
                            getDimensionsWithNameModifier({
                                axisDimensionIds,
                                metadata,
                                inputType,
                                layoutDimensionIds,
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
                                    isLast={i === axisDimensionIds.length - 1}
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
