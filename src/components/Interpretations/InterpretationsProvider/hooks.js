import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react'
import {
    getCommentAccess,
    getInterpretationAccess,
} from '../common/getInterpretationAccess.js'
import { IntepretationsContext } from './InterpretationsProvider.js'

const SET_LOADING = 'SET_LOADING'
const SET_ERROR = 'SET_ERROR'
const SET_DATA = 'SET_DATA'
const RESET = 'RESET'
const initialLoadingState = {
    loading: false,
    error: undefined,
    data: undefined,
}

function loadingReducer(state, action) {
    switch (action.type) {
        case SET_LOADING:
            return { ...initialLoadingState, loading: true }
        case SET_ERROR:
            return { ...initialLoadingState, error: action.payload }
        case SET_DATA:
            return { ...initialLoadingState, data: action.payload }
        case RESET:
            return { ...initialLoadingState }
        default:
            return state
    }
}

export function useAsyncCallbackState(asyncCallback) {
    const [state, dispatch] = useReducer(loadingReducer, initialLoadingState)
    const doAsyncCallback = useCallback(async () => {
        dispatch({ type: SET_LOADING })
        try {
            const data = await asyncCallback()
            dispatch({ type: SET_DATA, payload: data })
        } catch (error) {
            console.error(error)
            dispatch({ type: SET_ERROR, payload: error })
        }
    }, [asyncCallback, dispatch])

    return [doAsyncCallback, state]
}

export const useInterpretationsManager = () => {
    const interpretationsManager = useContext(IntepretationsContext)

    if (!interpretationsManager) {
        throw new Error(
            'Called useInterpretationsManager() from outside an InterpretationsProvider'
        )
    }

    return interpretationsManager
}

export const useInterpretationsList = (type, id) => {
    const prevTypeRef = useRef(null)
    const prevIdRef = useRef(null)
    const interpretationsManager = useInterpretationsManager()
    const [state, dispatch] = useReducer(loadingReducer, initialLoadingState)
    const fetchList = useCallback(async () => {
        dispatch({ type: SET_LOADING })
        try {
            const data =
                await interpretationsManager.fetchInterpretationsForVisualization(
                    type,
                    id
                )
            dispatch({ type: SET_DATA, payload: data })
        } catch (error) {
            console.error(error)
            dispatch({ type: SET_ERROR, payload: error })
        }
    }, [interpretationsManager, type, id, dispatch])

    // Ensure manager updates get propagated to the state
    useEffect(() => {
        const unsubscribe =
            interpretationsManager.subscribeToInterpretationsListUpdates(
                (interpretations) => {
                    dispatch({ type: SET_DATA, payload: interpretations })
                }
            )
        return unsubscribe
    }, [interpretationsManager])

    // Fetch on when mounting or after a reset
    useEffect(() => {
        if (type && id && !state.loading && !state.data && !state.error) {
            fetchList()
        }
    }, [fetchList, state, type, id])

    // Handle active item changes and clearance
    useEffect(() => {
        const prevType = prevTypeRef.current
        const prevId = prevIdRef.current
        const isTypeChange = prevId && id && prevId !== id
        const isIdChange = prevId && id && prevId !== id
        const isTypeClearance = prevType && !type
        const isIdClearance = prevId && !id
        if (isTypeChange || isIdChange || isTypeClearance || isIdClearance) {
            dispatch({ type: RESET })
        }
        if (isTypeClearance || isIdClearance) {
            interpretationsManager.clearInterpretations()
        }
        prevTypeRef.current = type
        prevIdRef.current = id
    }, [interpretationsManager, type, id])

    return state
}

export const useActiveInterpretation = (id) => {
    const prevIdRef = useRef(null)
    const interpretationsManager = useInterpretationsManager()
    const [state, dispatch] = useReducer(loadingReducer, initialLoadingState)
    const fetchInterpretation = useCallback(async () => {
        dispatch({ type: SET_LOADING })
        try {
            const data = await interpretationsManager.loadActiveInterpretation(
                id
            )
            dispatch({ type: SET_DATA, payload: data })
        } catch (error) {
            console.error(error)
            dispatch({ type: SET_ERROR, payload: error })
        }
    }, [interpretationsManager, id, dispatch])

    // Ensure manager updates get propagated to the state
    useEffect(() => {
        const unsubscribe =
            interpretationsManager.subscribeToInterpretationUpdates(
                id,
                (interpretations) => {
                    dispatch({ type: SET_DATA, payload: interpretations })
                }
            )
        return unsubscribe
    }, [interpretationsManager, id])

    // Fetch on when mounting or after a reset
    useEffect(() => {
        if ((id, !state.loading && !state.data && !state.error)) {
            fetchInterpretation()
        }
    }, [fetchInterpretation, state, id])

    // Handle active item changes and clearance
    useEffect(() => {
        const prevId = prevIdRef.current
        const isIdChange = prevId && id && prevId !== id
        const isIdClearance = prevId && !id
        if (isIdChange || isIdClearance) {
            dispatch({ type: RESET })
        }
        if (isIdClearance) {
            interpretationsManager.clearActiveInterpretation()
        }
        prevIdRef.current = id
    }, [id, interpretationsManager])

    return state
}

export const useInterpretation = (id) => {
    const interpretationsManager = useInterpretationsManager()
    const [interpretation, setInterpretation] = useState(
        interpretationsManager.getInterpretation(id)
    )

    useEffect(() => {
        interpretationsManager.subscribeToInterpretationUpdates(
            id,
            (newInterpretation) => {
                setInterpretation(newInterpretation)
            }
        )
    }, [interpretationsManager, id])

    return interpretation
}

export const useLike = (id) => {
    const interpretationsManager = useInterpretationsManager()
    const [{ loading: toggleLikeInProgress, data: interpretation }, dispatch] =
        useReducer(loadingReducer, {
            ...initialLoadingState,
            data: interpretationsManager.getInterpretation(id),
        })
    const toggleLike = useCallback(async () => {
        dispatch({ type: SET_LOADING })
        try {
            const data = await interpretationsManager.toggleInterpretationLike(
                id
            )
            dispatch({ type: SET_DATA, payload: data })
        } catch (error) {
            console.error(error)
            dispatch({ type: SET_ERROR, payload: error })
        }
    }, [id, interpretationsManager])
    const isLikedByCurrentUser = useMemo(() => {
        const currentUser = interpretationsManager.getCurrentUser()
        return interpretation.likedBy.some(
            (likedBy) => likedBy.id === currentUser.id
        )
    }, [interpretation, interpretationsManager])

    return {
        isLikedByCurrentUser,
        toggleLike,
        toggleLikeInProgress,
    }
}

export const useInterpretationAccess = (interpretation) => {
    const interpretationsManager = useInterpretationsManager()
    const currentUser = interpretationsManager.getCurrentUser()
    const access = useMemo(
        () => getInterpretationAccess(interpretation, currentUser),
        [interpretation, currentUser]
    )
    return access
}

export const useCommentAccess = (comment, canComment) => {
    const interpretationsManager = useInterpretationsManager()
    const currentUser = interpretationsManager.getCurrentUser()
    const access = useMemo(
        () => getCommentAccess(comment, canComment, currentUser),
        [comment, canComment, currentUser]
    )
    return access
}

export const useDeleteInterpretation = ({ id, onComplete, onError }) => {
    const interpretationsManager = useInterpretationsManager()
    const mutation = useCallback(() => {
        interpretationsManager.deleteInterpretation({ id, onComplete, onError })
    }, [interpretationsManager, id, onComplete, onError])
    return useAsyncCallbackState(mutation)
}

export const useUpdateInterpretationText = ({
    id,
    text,
    onComplete,
    onError,
}) => {
    const interpretationsManager = useInterpretationsManager()
    const mutation = useCallback(() => {
        interpretationsManager.updateInterpretationText({
            id,
            text,
            onComplete,
            onError,
        })
    }, [interpretationsManager, id, text, onComplete, onError])
    return useAsyncCallbackState(mutation)
}

export const useUpdateCommentForActiveInterpretation = ({
    id,
    text,
    onComplete,
}) => {
    const interpretationsManager = useInterpretationsManager()
    const mutation = useCallback(() => {
        interpretationsManager.updateCommentForActiveInterpretation({
            id,
            text,
            onComplete,
        })
    }, [interpretationsManager, id, text, onComplete])
    return useAsyncCallbackState(mutation)
}

export const useAddCommentToActiveInterpretation = ({ text, onComplete }) => {
    const interpretationsManager = useInterpretationsManager()
    const mutation = useCallback(() => {
        interpretationsManager.addCommentToActiveInterpretation({
            text,
            onComplete,
        })
    }, [interpretationsManager, text, onComplete])
    return useAsyncCallbackState(mutation)
}

export const useDeleteCommentFromActiveInterpretation = (id) => {
    const interpretationsManager = useInterpretationsManager()
    const mutation = useCallback(() => {
        interpretationsManager.deleteCommentFromActiveInterpretation(id)
    }, [interpretationsManager, id])
    return useAsyncCallbackState(mutation)
}

export const useCreateInterpretation = ({ type, id, text, onComplete }) => {
    const interpretationsManager = useInterpretationsManager()
    const mutation = useCallback(() => {
        interpretationsManager.createInterpretation({
            type,
            id,
            text,
            onComplete,
        })
    }, [interpretationsManager, type, id, text, onComplete])
    return useAsyncCallbackState(mutation)
}
