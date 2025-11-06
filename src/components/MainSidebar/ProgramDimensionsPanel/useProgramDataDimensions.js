import {
    useCachedDataQuery,
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA_ELEMENT,
} from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useReducer, useCallback, useRef, useMemo } from 'react'
import { extractDimensionIdParts } from '../../../modules/dimensionId.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { DIMENSION_LIST_FIELDS } from '../DimensionsList/index.js'

const ACTIONS_RESET = 'RESET'
const ACTIONS_INIT = 'INIT'
const ACTIONS_SUCCESS = 'SUCCESS'
const ACTIONS_ERROR = 'ERROR'
const ACTIONS_NO_PARAMS = 'NO_PARAMS'

const initialState = {
    loading: true,
    fetching: true,
    error: null,
    dimensions: [],
    nextPage: 1,
    isLastPage: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS_RESET:
            return { ...initialState }
        case ACTIONS_INIT:
            return {
                ...state,
                loading: !state.dimensions,
                fetching: true,
                error: null,
            }
        case ACTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                fetching: false,
                error: null,
                ...action.payload,
            }
        case ACTIONS_ERROR:
            return {
                ...state,
                loading: false,
                fetching: false,
                error: action.payload,
                dimensions: [],
            }
        case ACTIONS_NO_PARAMS:
            return {
                ...state,
                loading: false,
                fetching: false,
                error: null,
                dimensions: [],
                nextPage: 1,
                isLastPage: true,
            }
        default:
            throw new Error(
                'Invalid action passed to useProgramDataDimensions reducer function'
            )
    }
}

const resourceMap = {
    [OUTPUT_TYPE_TRACKED_ENTITY]: 'analytics/trackedEntities/query/dimensions',
    [OUTPUT_TYPE_ENROLLMENT]: 'analytics/enrollments/query/dimensions',
    [OUTPUT_TYPE_EVENT]: 'analytics/events/query/dimensions',
}

const createDimensionsQuery = ({
    inputType,
    page,
    trackedEntityTypeId,
    programId,
    stageId,
    searchTerm,
    dimensionType,
    nameProp,
}) => {
    const params = {
        pageSize: 25,
        page,
        fields: [...DIMENSION_LIST_FIELDS, `${nameProp}~rename(name)`],
        filter: [],
        order: `${nameProp}:asc`,
    }

    if (trackedEntityTypeId && inputType === OUTPUT_TYPE_TRACKED_ENTITY) {
        params.trackedEntityType = trackedEntityTypeId
    }

    if (programId) {
        if (inputType === OUTPUT_TYPE_EVENT) {
            // For Event output with a specific stage, use programStageId
            // When no stage is specified, don't add program filter to get all dimensions
            if (stageId) {
                params.programStageId = stageId
            }
        } else if (inputType === OUTPUT_TYPE_ENROLLMENT) {
            params.programId = programId
        } else if (inputType === OUTPUT_TYPE_TRACKED_ENTITY) {
            params.program = programId
        }
    }

    // Stage filter is now optional - only apply if explicitly filtering by stage
    if (
        stageId &&
        inputType === OUTPUT_TYPE_ENROLLMENT &&
        dimensionType === DIMENSION_TYPE_DATA_ELEMENT
    ) {
        // Filter data elements by stage for enrollment
        // Data element IDs have the notation: `${programStageId}.${dataElementId}`
        params.filter.push(`id:startsWith:${stageId}`)
    }

    if (
        programId &&
        stageId &&
        inputType === OUTPUT_TYPE_TRACKED_ENTITY &&
        dimensionType === DIMENSION_TYPE_DATA_ELEMENT
    ) {
        // Filter data elements by stage for tracked entity
        // Data element IDs have the notation: `${programId}.${programStageId}.${dataElementId}`
        params.filter.push(`id:startsWith:${programId}.${stageId}`)
    }

    if (inputType === OUTPUT_TYPE_TRACKED_ENTITY) {
        params.filter.push('dimensionType:ne:PROGRAM_ATTRIBUTE')
        params.filter.push('dimensionType:ne:PROGRAM_INDICATOR')
    }

    /*
     * TODO: currently no matches on shortname are captured
     * if this is required we would need the backend add support for this, because
     * we can't have a request with a mixed `rootJunction` (use both AND and OR)
     * so we need to keep using the AND rootJunction and if we want to match a
     * searchTerm against several fields, we need a specific query param for that,
     * i.e. `filter=identifiable:token:${searchTerm}` or `query=${searchTerm}`
     */
    if (searchTerm) {
        params.filter.push(`${nameProp}:ilike:${searchTerm}`)
    }

    if (dimensionType && dimensionType !== DIMENSION_TYPE_ALL) {
        params.filter.push(`dimensionType:eq:${dimensionType}`)
    }

    return {
        resource: resourceMap[inputType],
        params,
    }
}

const transformResponseData = ({
    data,
    dimensions,
    deDimensionsMapRef,
    programStageNames,
    shouldReset,
    inputType,
}) => {
    const pager = data.dimensions.pager
    let newDuplicateFound = false

    // For EVENT, ENROLLMENT, and TRACKED_ENTITY, track duplicate data elements
    if (
        [
            OUTPUT_TYPE_EVENT,
            OUTPUT_TYPE_ENROLLMENT,
            OUTPUT_TYPE_TRACKED_ENTITY,
        ].includes(inputType)
    ) {
        data.dimensions.dimensions.forEach((dimension) => {
            if (!dimension || !dimension.id) return
            const { dimensionId } = extractDimensionIdParts(
                dimension.id,
                inputType
            )
            if (
                dimension.dimensionType === DIMENSION_TYPE_DATA_ELEMENT &&
                dimensionId
            ) {
                const dataElementCount =
                    deDimensionsMapRef.current.get(dimensionId)
                if (dataElementCount) {
                    deDimensionsMapRef.current.set(
                        dimensionId,
                        dataElementCount + 1
                    )
                    newDuplicateFound = true
                } else {
                    deDimensionsMapRef.current.set(dimensionId, 1)
                }
            }
        })
    }

    const allDimensions = shouldReset
        ? data.dimensions.dimensions
        : [...dimensions, ...data.dimensions.dimensions]

    // Filter out null/undefined dimensions and add stage labels for duplicates
    const allDimensionsWithStageLabel = newDuplicateFound
        ? allDimensions
              .filter((dimension) => dimension && dimension.id)
              .map((dimension) => {
                  const { dimensionId, programStageId } =
                      extractDimensionIdParts(dimension.id, inputType)
                  if (
                      dimensionId &&
                      deDimensionsMapRef.current.get(dimensionId) > 1
                  ) {
                      dimension.stageName =
                          programStageNames?.get(programStageId)
                  }
                  return dimension
              })
        : allDimensions.filter((dimension) => dimension && dimension.id)

    // For EVENT output, deduplicate non-stage-specific dimensions (like program indicators)
    // that don't have a stage prefix in their ID
    let finalDimensions = allDimensionsWithStageLabel
    if (inputType === OUTPUT_TYPE_EVENT) {
        const seenNonStageIds = new Set()
        finalDimensions = allDimensionsWithStageLabel.filter((dimension) => {
            const { programStageId } = extractDimensionIdParts(
                dimension.id,
                inputType
            )
            // If dimension has a stage prefix, keep it (it's stage-specific)
            if (programStageId) {
                return true
            }
            // If no stage prefix, it's program-level - deduplicate it
            if (seenNonStageIds.has(dimension.id)) {
                return false
            }
            seenNonStageIds.add(dimension.id)
            return true
        })
    }

    return {
        dimensions: finalDimensions,
        nextPage: pager.page + 1,
        isLastPage: pager.pageSize * pager.page >= pager.total,
    }
}

const useProgramDataDimensions = ({
    inputType,
    trackedEntityTypeId,
    program,
    stageId,
    searchTerm,
    dimensionType,
}) => {
    const { currentUser } = useCachedDataQuery()
    const deDimensionsMapRef = useRef(new Map())
    const engine = useDataEngine()
    const [
        { loading, fetching, error, dimensions, nextPage, isLastPage },
        dispatch,
    ] = useReducer(reducer, initialState)

    const programId = useMemo(() => program?.id, [program])
    const programStageNames = useMemo(
        () =>
            program?.programStages?.reduce((acc, stage) => {
                if (stage && stage.id) {
                    acc.set(stage.id, stage.name)
                }
                return acc
            }, new Map()),
        [program]
    )

    const nameProp =
        currentUser.settings[DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY]

    const fetchDimensions = useCallback(
        async (shouldReset) => {
            // Check if we have the required parameters for the API call
            const hasRequiredParams = (() => {
                if (inputType === OUTPUT_TYPE_EVENT) {
                    // For EVENT, we need a program with at least one stage
                    return !!(program?.id && program?.programStages?.length)
                } else if (inputType === OUTPUT_TYPE_ENROLLMENT) {
                    return !!program?.id
                } else if (inputType === OUTPUT_TYPE_TRACKED_ENTITY) {
                    return !!trackedEntityTypeId
                }
                return false
            })()

            if (!hasRequiredParams) {
                // Don't make API call, set to empty state without loading
                if (shouldReset) {
                    deDimensionsMapRef.current.clear()
                }
                dispatch({ type: ACTIONS_NO_PARAMS })
                return
            }

            if (shouldReset) {
                deDimensionsMapRef.current.clear()
                dispatch({ type: ACTIONS_RESET })
            } else {
                dispatch({ type: ACTIONS_INIT })
            }

            try {
                const page = shouldReset ? 1 : nextPage

                // For EVENT output without a specific stage filter, fetch from all stages
                if (
                    inputType === OUTPUT_TYPE_EVENT &&
                    !stageId &&
                    program?.programStages
                ) {
                    console.log(
                        'Multi-stage query - program:',
                        program?.name,
                        'stages:',
                        program?.programStages?.length
                    )
                    // Query each stage separately and combine results
                    const stageQueries = {}
                    program.programStages.forEach((stage, index) => {
                        console.log(
                            `Creating query for stage ${index}:`,
                            stage.id,
                            stage.name
                        )
                        stageQueries[`stage${index}`] = createDimensionsQuery({
                            inputType,
                            page,
                            trackedEntityTypeId,
                            programId,
                            stageId: stage.id,
                            searchTerm,
                            dimensionType,
                            nameProp,
                        })
                    })

                    console.log('Stage queries:', stageQueries)
                    const allStageData = await engine.query(stageQueries)
                    console.log(
                        'All stage data received:',
                        Object.keys(allStageData),
                        allStageData
                    )

                    // Combine all dimensions from all stages
                    const combinedDimensions = []
                    Object.entries(allStageData).forEach(
                        ([key, stageResult]) => {
                            // Multi-query returns dimensions directly as an array, not nested
                            if (
                                stageResult?.dimensions &&
                                Array.isArray(stageResult.dimensions)
                            ) {
                                console.log(
                                    `  Adding ${stageResult.dimensions.length} dimensions from ${key}`
                                )
                                combinedDimensions.push(
                                    ...stageResult.dimensions
                                )
                            }
                        }
                    )

                    // Sort combined dimensions alphabetically by name
                    combinedDimensions.sort((a, b) => {
                        const nameA = (a?.name || '').toLowerCase()
                        const nameB = (b?.name || '').toLowerCase()
                        return nameA.localeCompare(nameB)
                    })

                    console.log(
                        'Combined dimensions total:',
                        combinedDimensions.length
                    )

                    // Create synthetic pager - we're showing all results at once (no pagination)
                    const syntheticData = {
                        dimensions: {
                            dimensions: combinedDimensions,
                            pager: {
                                page: 1,
                                pageSize: combinedDimensions.length,
                                total: combinedDimensions.length,
                            },
                        },
                    }

                    const transformedData = transformResponseData({
                        data: syntheticData,
                        dimensions,
                        deDimensionsMapRef,
                        programStageNames,
                        shouldReset,
                        inputType,
                    })

                    dispatch({
                        type: ACTIONS_SUCCESS,
                        payload: transformedData,
                    })
                } else {
                    // Normal single query for ENROLLMENT, TRACKED_ENTITY, or filtered EVENT
                    const query = createDimensionsQuery({
                        inputType,
                        page,
                        trackedEntityTypeId,
                        programId,
                        stageId,
                        searchTerm,
                        dimensionType,
                        nameProp,
                    })
                    const data = await engine.query({
                        dimensions: query,
                    })

                    const transformedData = transformResponseData({
                        data,
                        dimensions,
                        deDimensionsMapRef,
                        programStageNames,
                        shouldReset,
                        inputType,
                    })

                    dispatch({
                        type: ACTIONS_SUCCESS,
                        payload: transformedData,
                    })
                }
            } catch (error) {
                dispatch({ type: ACTIONS_ERROR, payload: error })
            }
        },
        [
            dimensions,
            engine,
            programStageNames,
            inputType,
            nextPage,
            trackedEntityTypeId,
            program,
            stageId,
            searchTerm,
            dimensionType,
            nameProp,
        ]
    )

    useEffect(() => {
        fetchDimensions(true)
    }, [
        inputType,
        trackedEntityTypeId,
        program,
        stageId,
        searchTerm,
        dimensionType,
        nameProp,
    ])

    const loadMore = useCallback(() => {
        // Disable pagination for EVENT output without stage filter (multi-stage query)
        const isMultiStageQuery =
            inputType === OUTPUT_TYPE_EVENT &&
            !stageId &&
            program?.programStages
        if (!isMultiStageQuery && !isLastPage && !fetching) {
            fetchDimensions(false)
        }
    }, [isLastPage, fetching, fetchDimensions, inputType, stageId, program])

    return {
        loading,
        fetching,
        error,
        dimensions,
        hasMore: !isLastPage,
        loadMore,
    }
}

export { useProgramDataDimensions, createDimensionsQuery }
