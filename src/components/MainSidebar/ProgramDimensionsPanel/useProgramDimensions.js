import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useReducer, useCallback } from 'react'
import { INPUT_TYPE_EVENT, INPUT_TYPE_ENROLLMENT } from '../InputPanel/index.js'
import {
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA_ELEMENT,
} from './ProgramDimensionsFilter.js'

const ACTIONS = {
    RESET: 'RESET',
    INIT: 'INIT',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
}

const initialState = {
    loading: true,
    fetching: true,
    error: null,
    dimensions: null,
    nextPage: 1,
    isLastPage: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.RESET:
            return { ...initialState }
        case ACTIONS.INIT:
            return {
                ...state,
                loading: !state.dimensions,
                fetching: true,
                error: null,
            }
        case ACTIONS.SUCCESS:
            return {
                ...state,
                loading: false,
                fetching: false,
                error: null,
                dimensions: state.dimensions
                    ? [...state.dimensions, ...action.payload.dimensions]
                    : action.payload.dimensions,
                nextPage: action.payload.page + 1,
                isLastPage:
                    action.payload.pageSize * action.payload.page >=
                    action.payload.total,
            }
        case ACTIONS.ERROR:
            return {
                ...state,
                loading: false,
                fetching: false,
                error: action.payload,
                dimensions: null,
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
}) => {
    const resource =
        inputType === INPUT_TYPE_EVENT
            ? 'analytics/events/query/dimensions'
            : 'analytics/enrollments/query/dimensions'
    const params = {
        pageSize: 30,
        page,
        fields: ['id', 'displayName'],
        filter: [],
    }

    if (programId && inputType === INPUT_TYPE_ENROLLMENT) {
        params.programId = programId
    }

    if (stageId && inputType === INPUT_TYPE_EVENT) {
        params.programStageId = stageId
    }

    if (
        stageId &&
        inputType === INPUT_TYPE_ENROLLMENT &&
        dimensionType === DIMENSION_TYPE_DATA_ELEMENT
    ) {
        // This works because data element IDs have the following notation:
        // `${programStageId}.${dataElementId}`
        params.filter.push(`id:like:${stageId}`)
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
        params.filter.push(`name:ilike:${searchTerm}`)
    }

    if (dimensionType && dimensionType !== DIMENSION_TYPE_ALL) {
        params.filter.push(`dimensionType:eq:${dimensionType}`)
    }

    return {
        resource,
        params,
    }
}

const useProgramDimensions = ({
    inputType,
    isListEndVisible,
    programId,
    stageId,
    searchTerm,
    dimensionType,
}) => {
    const engine = useDataEngine()
    const [
        { loading, fetching, error, dimensions, nextPage, isLastPage },
        dispatch,
    ] = useReducer(reducer, initialState)

    const fetchDimensions = useCallback(
        async (shouldReset) => {
            if (shouldReset) {
                dispatch({ type: ACTIONS.RESET })
            } else {
                dispatch({ type: ACTIONS.INIT })
            }

            try {
                const page = shouldReset ? 1 : nextPage
                const data = await engine.query({
                    dimensions: createDimensionsQuery({
                        inputType,
                        page,
                        programId,
                        stageId,
                        searchTerm,
                        dimensionType,
                    }),
                })
                dispatch({
                    type: ACTIONS.SUCCESS,
                    payload: data.dimensions,
                })
            } catch (error) {
                dispatch({ type: ACTIONS.ERROR, payload: error })
            }
        },
        [
            inputType,
            nextPage,
            programId,
            stageId,
            searchTerm,
            dimensionType,
            isListEndVisible,
        ]
    )

    useEffect(() => {
        fetchDimensions(true)
    }, [inputType, programId, stageId, searchTerm, dimensionType])

    useEffect(() => {
        if (isListEndVisible && !isLastPage && !fetching) {
            fetchDimensions(false)
        }
    }, [isListEndVisible, isLastPage])

    return {
        loading,
        error,
        dimensions,
    }
}

export { useProgramDimensions, createDimensionsQuery }
