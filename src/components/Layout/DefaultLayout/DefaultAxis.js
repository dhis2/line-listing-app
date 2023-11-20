import { DIMENSION_TYPE_DATA_ELEMENT } from '@dhis2/analytics'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../../actions/ui.js'
import { getAxisName } from '../../../modules/axis.js'
import { extractDimensionIdParts } from '../../../modules/utils.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import {
    sGetUiDraggingId,
    sGetUiDimensionIdsByAxisId,
    sGetUiInputType,
    renderChipsSelector,
} from '../../../reducers/ui.js'
import { LAST, getDropzoneId } from '../../DndContext.js'
import Chip from '../Chip.js'
import { DropZone } from './DropZone.js'
import styles from './styles/DefaultAxis.module.css'

export const getDimensionsWithSuffix = ({
    dimensionIds,
    metadata,
    inputType,
}) => {
    const dimensions = dimensionIds.map((id) => {
        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(id)
        const dimension = {
            ...metadata[id],
            dimensionId,
            programStageId,
            programId,
        }
        return dimension
    })

    if (
        [OUTPUT_TYPE_ENROLLMENT, OUTPUT_TYPE_TRACKED_ENTITY].includes(inputType)
    ) {
        const dimensionsWithSuffix = dimensions.map((dimension) => {
            if (dimension.dimensionType === DIMENSION_TYPE_DATA_ELEMENT) {
                const duplicates = dimensions.filter(
                    (d) =>
                        d.dimensionId === dimension.dimensionId &&
                        d !== dimension
                )

                if (duplicates.length > 0) {
                    const sameProgramId = duplicates.find(
                        (dup) => dup.programId === dimension.programId
                    )
                    const thirdPartyDuplicates = duplicates
                        .filter((dup) => dup.programId !== dimension.programId)
                        .find((dpid) =>
                            duplicates.find(
                                (dup) =>
                                    dup.programStageId !==
                                        dpid.programStageId &&
                                    dup.programId === dpid.programId
                            )
                        )

                    if (sameProgramId || thirdPartyDuplicates) {
                        dimension.suffix =
                            metadata[dimension.programStageId].name
                    } else {
                        dimension.suffix = metadata[dimension.programId].name
                    }
                }
            }

            return dimension
        })

        return dimensionsWithSuffix
    }

    return dimensions
}

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

    return (
        <div ref={setNodeRef} className={styles.lastDropzone}>
            <div id={axisId} className={cx(styles.axisContainer, className)}>
                <div className={styles.label}>{getAxisName(axisId)}</div>
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
