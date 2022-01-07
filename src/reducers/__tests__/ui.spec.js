import { PROP_MOST_RECENT, PROP_OLDEST } from '../../modules/ui.js'
import { OUTPUT_TYPE_EVENT } from '../../modules/visualization.js'
import reducer, { DEFAULT_UI, SET_INPUT, SET_UI_REPETITION } from '../ui.js'

describe('reducer: ui', () => {
    it('returns the default state when no matching action', () => {
        const actualState = reducer(DEFAULT_UI, { type: 'NO_MATCH' })

        expect(actualState).toEqual(DEFAULT_UI)
    })

    // outputType
    describe('reducer: ui.input', () => {
        const inputAction = {
            type: SET_INPUT,
            value: {
                type: OUTPUT_TYPE_EVENT,
            },
        }

        it('returns a new object', () => {
            const state = {}

            expect(reducer(state, {})).not.toBe(reducer(state, inputAction))
        })

        it('sets the new input', () => {
            expect(reducer({}, inputAction)).toEqual({
                input: {
                    type: OUTPUT_TYPE_EVENT,
                }
            })
        })
    })

    // repetition
    describe('reducer: ui.repetitionByDimension', () => {
        const getTestRepetition = () => ({
            [PROP_MOST_RECENT]: 2,
            [PROP_OLDEST]: 1,
        })

        const dimensionId = 'abc'

        it('adds repetition by dimension id', () => {
            const actualState = reducer(
                {},
                {
                    type: SET_UI_REPETITION,
                    value: {
                        dimensionId,
                        repetition: getTestRepetition(),
                    },
                }
            )

            const expectedState = {
                repetitionByDimension: {
                    abc: getTestRepetition(),
                },
            }

            expect(actualState).toEqual(expectedState)
        })

        it('overrides existing repetitions by dimension id', () => {
            const updatedRepetition = {
                ...getTestRepetition(),
                [PROP_MOST_RECENT]: 999,
            }

            const initialState = {
                repetitionByDimension: {
                    abc: getTestRepetition(),
                },
            }

            const actualState = reducer(initialState, {
                type: SET_UI_REPETITION,
                value: {
                    dimensionId,
                    repetition: updatedRepetition,
                },
            })

            const expectedState = {
                repetitionByDimension: {
                    [dimensionId]: updatedRepetition,
                },
            }

            expect(actualState).toEqual(expectedState)
        })
    })
})
