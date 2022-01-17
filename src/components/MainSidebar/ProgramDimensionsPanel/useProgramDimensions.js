import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useReducer, useCallback } from 'react'
import { INPUT_TYPES } from '../InputPanel/index.js'
import { DIMENSION_TYPES } from './ProgramDimensionsFilter.js'

const ACTIONS = {
    INIT: 'INIT',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
}

const initialState = {
    loading: true,
    error: null,
    dimensions: null,
}

const reducer = (_, action) => {
    switch (action.type) {
        case ACTIONS.INIT:
            return { ...initialState }
        case ACTIONS.SUCCESS:
            return {
                loading: false,
                error: null,
                dimensions: action.payload,
            }
        case ACTIONS.ERROR:
            return {
                loading: false,
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
    programId,
    stageId,
    searchTerm,
    dimensionType,
}) => {
    const resource =
        inputType === INPUT_TYPES.EVENT
            ? 'analytics/events/query/dimensions'
            : 'analytics/enrollments/query/dimensions'
    const params = {
        // TODO: change to `paging: false` once DHIS2-12457 is merged
        skipPaging: true,
        fields: ['id', 'displayName'],
    }

    // TODO: create empty `filter` array under params and push to that
    // once DHIS2-12458 is merged
    const filter = []

    if (programId && inputType === INPUT_TYPES.ENROLLMENT) {
        params.programId = programId
    }

    if (stageId && inputType === INPUT_TYPES.EVENT) {
        params.programStageId = stageId
    }

    if (
        stageId &&
        inputType === INPUT_TYPES.ENROLLMENT &&
        dimensionType === DIMENSION_TYPES.DATA_ELEMENT
    ) {
        // This works because data element IDs have the following notation:
        // `${programStageId}.${dataElementId}`
        filter.push(`id:like:${stageId}`)
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
        filter.push(`name:ilike:${searchTerm}`)
    }

    if (dimensionType && dimensionType !== DIMENSION_TYPES.ALL) {
        filter.push(`dimensionType:eq:${dimensionType}`)
    }

    // TODO: remove once DHIS2-12458 is merged
    if (filter.length > 0) {
        params.filter = filter.join(';')
    }

    return {
        resource,
        params,
    }
}

const useProgramDimensions = ({
    inputType,
    programId,
    stageId,
    searchTerm,
    dimensionType,
}) => {
    const engine = useDataEngine()
    const [{ loading, error, dimensions }, dispatch] = useReducer(
        reducer,
        initialState
    )
    const fetchDimensions = useCallback(async () => {
        dispatch({ type: ACTIONS.INIT })
        try {
            const data = await engine.query({
                dimensions: createDimensionsQuery({
                    inputType,
                    programId,
                    stageId,
                    searchTerm,
                    dimensionType,
                }),
            })
            dispatch({
                type: ACTIONS.SUCCESS,
                payload: data.dimensions.dimensions,
            })
        } catch (error) {
            dispatch({ type: ACTIONS.ERROR, payload: error })
        }
    }, [inputType, programId, stageId, searchTerm, dimensionType])

    useEffect(() => {
        fetchDimensions()
    }, [fetchDimensions])

    return {
        loading,
        error,
        dimensions,
    }
}

export { useProgramDimensions, createDimensionsQuery }
