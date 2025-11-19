import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import { formatDimensionId } from '../../../modules/dimensionId.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
} from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { acAddMetadata } from '../../../actions/metadata.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../../modules/programTypes.js'

/**
 * OrganizationUnitsPanel displays all organization unit dimensions
 * from enrollment and stages grouped together
 */
const OrganizationUnitsPanel = ({ program, searchTerm }) => {
    const dispatch = useDispatch()

    const isProgramWithRegistration =
        program?.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
        program?.programStages &&
        program.programStages.length > 0

    // Get enrollment org unit dimension
    const enrollmentOrgUnitId = program?.id
        ? formatDimensionId({
              dimensionId: DIMENSION_ID_ORGUNIT,
              programId: program.id,
              outputType: OUTPUT_TYPE_ENROLLMENT,
          })
        : null

    const enrollmentOrgUnit = useSelector((state) =>
        sGetMetadataById(state, enrollmentOrgUnitId)
    )

    // Get stage org unit dimensions
    const stageOrgUnits = useMemo(() => {
        if (!isProgramWithRegistration) return []

        return program.programStages.map((stage) => {
            const stageOrgUnitId = formatDimensionId({
                dimensionId: DIMENSION_ID_ORGUNIT,
                programId: program.id,
                programStageId: stage.id,
                outputType: OUTPUT_TYPE_EVENT,
            })
            return {
                id: stageOrgUnitId,
                stageId: stage.id,
                stageName: stage.name,
            }
        })
    }, [isProgramWithRegistration, program])

    // Get stage org units from metadata
    const stageOrgUnitsMetadata = useSelector((state) =>
        stageOrgUnits.map((stageOu) => ({
            ...sGetMetadataById(state, stageOu.id),
            stageId: stageOu.stageId,
            stageName: stageOu.stageName,
        }))
    )

    // Create and store mock stage org unit dimensions
    useEffect(() => {
        if (!isProgramWithRegistration) return

        const mockMetadata = {}

        program.programStages.forEach((stage) => {
            const stageOrgUnitId = formatDimensionId({
                dimensionId: DIMENSION_ID_ORGUNIT,
                programId: program.id,
                programStageId: stage.id,
                outputType: OUTPUT_TYPE_EVENT,
            })

            // Add stage to metadata
            mockMetadata[stage.id] = { id: stage.id, name: stage.name }

            // Create mock stage-specific org unit dimension
            mockMetadata[stageOrgUnitId] = {
                id: stageOrgUnitId,
                name: 'Organisation unit',
                dimensionType: 'ORGANISATION_UNIT',
                programStage: { id: stage.id, name: stage.name },
            }
        })

        if (Object.keys(mockMetadata).length > 0) {
            dispatch(acAddMetadata(mockMetadata))
        }
    }, [dispatch, isProgramWithRegistration, program])

    // For programs without registration, get the single org unit dimension
    const programOrgUnitId =
        !isProgramWithRegistration && program?.id
            ? formatDimensionId({
                  dimensionId: DIMENSION_ID_ORGUNIT,
                  programId: program.id,
                  outputType: OUTPUT_TYPE_EVENT,
              })
            : null

    const programOrgUnit = useSelector((state) =>
        sGetMetadataById(state, programOrgUnitId)
    )

    // Build all org unit dimensions
    const orgUnitDimensions = useMemo(() => {
        const dims = []

        // Add enrollment org unit if it's a program with registration
        if (isProgramWithRegistration && enrollmentOrgUnit) {
            dims.push({
                ...enrollmentOrgUnit,
                displayName: `${enrollmentOrgUnit.name} (Enrollment)`,
            })
        }

        // Add stage org units
        stageOrgUnitsMetadata.forEach((stageOu) => {
            if (stageOu && stageOu.id) {
                dims.push({
                    ...stageOu,
                    displayName: `${stageOu.name} (${stageOu.stageName})`,
                })
            }
        })

        // If it's a program without registration, just show one org unit
        if (!isProgramWithRegistration && programOrgUnit) {
            dims.push({
                ...programOrgUnit,
                displayName: programOrgUnit.name,
            })
        }

        return dims
    }, [
        isProgramWithRegistration,
        enrollmentOrgUnit,
        stageOrgUnitsMetadata,
        programOrgUnit,
    ])

    // Filter dimensions based on search term
    const filteredOrgUnitDimensions = useMemo(() => {
        if (!searchTerm) return orgUnitDimensions
        return orgUnitDimensions.filter((dimension) =>
            dimension.displayName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
    }, [orgUnitDimensions, searchTerm])

    // Add draggableId to dimensions
    const draggableOrgUnitDimensions = filteredOrgUnitDimensions.map(
        (dimension) => ({
            draggableId: `orgunit-${dimension.id}`,
            ...dimension,
            name: dimension.displayName, // Use displayName for rendering
        })
    )

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    // Don't render if no dimensions after filtering
    if (draggableOrgUnitDimensions.length === 0) {
        return null
    }

    return (
        <DimensionsList
            dimensions={draggableOrgUnitDimensions}
            loading={false}
            fetching={false}
            error={null}
            hasMore={false}
            onLoadMore={() => {}}
            dataTest="org-units-dimensions-list"
        />
    )
}

OrganizationUnitsPanel.propTypes = {
    program: PropTypes.object.isRequired,
    searchTerm: PropTypes.string,
}

export { OrganizationUnitsPanel }
