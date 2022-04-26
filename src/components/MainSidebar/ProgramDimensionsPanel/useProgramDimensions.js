import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useReducer, useCallback, useRef, useMemo } from 'react'
import {
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA_ELEMENT,
} from '../../../modules/dimensionConstants.js'
import { extractDimensionIdParts } from '../../../modules/utils.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
} from '../../../modules/visualization.js'
import { DIMENSION_LIST_FIELDS } from '../DimensionsList/index.js'

const ACTIONS_RESET = 'RESET'
const ACTIONS_INIT = 'INIT'
const ACTIONS_SUCCESS = 'SUCCESS'
const ACTIONS_ERROR = 'ERROR'
const ACTIONS_SET_LIST_END_VISIBLE = 'SET_LIST_END_VISIBLE'

const initialState = {
    loading: true,
    fetching: true,
    error: null,
    dimensions: [],
    nextPage: 1,
    isLastPage: false,
    isListEndVisible: false,
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
        case ACTIONS_SET_LIST_END_VISIBLE:
            return {
                ...state,
                isListEndVisible: action.payload,
            }
        default:
            throw new Error(
                'Invalid action passed to useProgramDimensions reducer function'
            )
    }
}

const createDimensionsQuery = ({
    inputType,
    page,
    programId,
    stageId,
    searchTerm,
    dimensionType,
    nameProp,
}) => {
    const resource =
        inputType === OUTPUT_TYPE_EVENT
            ? 'analytics/events/query/dimensions'
            : 'analytics/enrollments/query/dimensions'
    const params = {
        pageSize: 50,
        page,
        fields: [...DIMENSION_LIST_FIELDS, `${nameProp}~rename(name)`],
        filter: [],
        order: `${nameProp}:asc`,
    }

    if (programId && inputType === OUTPUT_TYPE_ENROLLMENT) {
        params.programId = programId
    }

    if (stageId && inputType === OUTPUT_TYPE_EVENT) {
        params.programStageId = stageId
    }

    if (
        stageId &&
        inputType === OUTPUT_TYPE_ENROLLMENT &&
        dimensionType === DIMENSION_TYPE_DATA_ELEMENT
    ) {
        // This works because data element IDs have the following notation:
        // `${programStageId}.${dataElementId}`
        params.filter.push(`id:startsWith:${stageId}`)
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
        resource,
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

    if (inputType === OUTPUT_TYPE_ENROLLMENT) {
        data.dimensions.dimensions.forEach((dimension) => {
            const { dimensionId } = extractDimensionIdParts(dimension.id)
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

    const allDimensionsWithStageLabel = newDuplicateFound
        ? allDimensions.map((dimension) => {
              const { dimensionId, programStageId } = extractDimensionIdParts(
                  dimension.id
              )
              if (
                  dimensionId &&
                  deDimensionsMapRef.current.get(dimensionId) > 1
              ) {
                  dimension.stageName = programStageNames?.get(programStageId)
              }
              return dimension
          })
        : allDimensions

    return {
        dimensions: allDimensionsWithStageLabel,
        nextPage: pager.page + 1,
        isLastPage: pager.pageSize * pager.page >= pager.total,
    }
}

const useProgramDimensions = ({
    inputType,
    program,
    stageId,
    searchTerm,
    dimensionType,
    nameProp,
}) => {
    const deDimensionsMapRef = useRef(new Map())
    const engine = useDataEngine()
    const [
        {
            loading,
            fetching,
            error,
            dimensions,
            nextPage,
            isLastPage,
            isListEndVisible,
        },
        dispatch,
    ] = useReducer(reducer, initialState)
    const programStageNames = useMemo(
        () =>
            program.programStages?.reduce((acc, stage) => {
                acc.set(stage.id, stage.name)
                return acc
            }, new Map()),
        [program]
    )

    const setIsListEndVisible = (isVisible) => {
        if (isVisible !== isListEndVisible) {
            dispatch({ type: ACTIONS_SET_LIST_END_VISIBLE, payload: isVisible })
        }
    }

    const fetchDimensions = useCallback(
        async (shouldReset) => {
            if (shouldReset) {
                deDimensionsMapRef.current.clear()
                dispatch({ type: ACTIONS_RESET })
            } else {
                dispatch({ type: ACTIONS_INIT })
            }

            try {
                const page = shouldReset ? 1 : nextPage
                const data = await engine.query({
                    dimensions: createDimensionsQuery({
                        inputType,
                        page,
                        programId: program.id,
                        stageId,
                        searchTerm,
                        dimensionType,
                        nameProp,
                    }),
                })

                dispatch({
                    type: ACTIONS_SUCCESS,
                    payload: transformResponseData({
                        data,
                        dimensions,
                        deDimensionsMapRef,
                        programStageNames,
                        shouldReset,
                        inputType,
                    }),
                })
            } catch (error) {
                dispatch({ type: ACTIONS_ERROR, payload: error })
            }
        },
        [
            inputType,
            nextPage,
            program,
            stageId,
            searchTerm,
            dimensionType,
            isListEndVisible,
            nameProp,
        ]
    )

    useEffect(() => {
        fetchDimensions(true)
    }, [inputType, program, stageId, searchTerm, dimensionType, nameProp])

    useEffect(() => {
        if (isListEndVisible && !isLastPage && !fetching) {
            fetchDimensions(false)
        }
    }, [isListEndVisible, isLastPage])

    return {
        loading,
        error,
        dimensions,
        setIsListEndVisible,
    }
}

export { useProgramDimensions, createDimensionsQuery }
