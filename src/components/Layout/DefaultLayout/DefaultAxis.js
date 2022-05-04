import { DIMENSION_TYPE_DATA_ELEMENT } from '@dhis2/analytics'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../../actions/ui.js'
import { getAxisName } from '../../../modules/axis.js'
import { extractDimensionIdParts } from '../../../modules/utils.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../../modules/visualization.js'
import { sGetMetadata, sGetMetadataById } from '../../../reducers/metadata.js'
import {
    sGetUiDraggingId,
    sGetUiDimensionIdsByAxisId,
    sGetUiInputType,
    sGetUiProgramId,
    renderChipsSelector,
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
    const dimensionIds = useSelector((state) =>
        sGetUiDimensionIdsByAxisId(state, axisId)
    )
    const renderChips = useSelector(renderChipsSelector)
    const draggingId = useSelector(sGetUiDraggingId)
    const metadata = useSelector(sGetMetadata)
    const inputType = useSelector(sGetUiInputType)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const program = useSelector((state) =>
        sGetMetadataById(state, selectedProgramId)
    )

    const programStageNames = useMemo(
        () =>
            program?.programStages?.reduce((acc, stage) => {
                acc.set(stage.id, stage.name)
                return acc
            }, new Map()),
        [program]
    )

    const getDimensionsWithStageName = () => {
        let hasDuplicates = false
        const dataElements = new Map()

        const dimensions = dimensionIds.map((id) => {
            let dimension = {}
            if (metadata[id]) {
                dimension = { ...metadata[id] }
            } else {
                const { dimensionId } = extractDimensionIdParts(id)
                dimension = { ...metadata[dimensionId] }
            }
            return dimension
        })

        if (inputType === OUTPUT_TYPE_ENROLLMENT) {
            dimensions.forEach((dimension) => {
                const { dimensionId } = extractDimensionIdParts(dimension.id)
                if (
                    dimension.dimensionType === DIMENSION_TYPE_DATA_ELEMENT &&
                    dimensionId
                ) {
                    const dataElementCount = dataElements.get(dimensionId)

                    if (dataElementCount) {
                        dataElements.set(dimensionId, dataElementCount + 1)
                        hasDuplicates = true
                    } else {
                        dataElements.set(dimensionId, 1)
                    }
                }
            })

            return hasDuplicates
                ? dimensions.map((dimension) => {
                      const { dimensionId, programStageId } =
                          extractDimensionIdParts(dimension.id)
                      if (dimensionId && dataElements.get(dimensionId) > 1) {
                          dimension.stageName =
                              programStageNames?.get(programStageId)
                      }
                      return dimension
                  })
                : dimensions
        }

        return dimensions
    }

    const activeIndex = draggingId ? dimensionIds.indexOf(draggingId) : -1

    const overLastDropZone = over?.id === lastDropZoneId

    return (
        <div ref={setNodeRef} className={styles.lastDropzone}>
            <div
                id={axisId}
                data-test={`${axisId}-axis`}
                className={cx(styles.axisContainer, className)}
            >
                <div className={styles.label}>{getAxisName(axisId)}</div>
                <SortableContext id={axisId} items={dimensionIds}>
                    <div className={styles.content}>
                        <DropZone
                            axisId={axisId}
                            firstElementId={dimensionIds[0]}
                            overLastDropZone={overLastDropZone}
                        />
                        {renderChips &&
                            getDimensionsWithStageName().map((dimension, i) => (
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
