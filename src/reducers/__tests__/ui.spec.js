import { PROP_MOST_RECENT, PROP_OLDEST } from '../../modules/ui.js'
import { OUTPUT_TYPE_EVENT } from '../../modules/visualization.js'
import reducer, {
    DEFAULT_UI,
    SET_UI_INPUT,
    SET_UI_PROGRAM,
    SET_UI_REPETITION,
} from '../ui.js'

describe('reducer: store.ui', () => {
    it('returns the default state when no matching action', () => {
        const actualState = reducer(DEFAULT_UI, { type: 'NO_MATCH' })

        expect(actualState).toEqual(DEFAULT_UI)
    })

    describe(`reducer: ${SET_UI_INPUT}`, () => {
        const input = {
            type: OUTPUT_TYPE_EVENT,
        }

        const inputAction = {
            type: SET_UI_INPUT,
            value: input,
        }

        it('returns a new object', () => {
            const state = {}

            expect(reducer(state, inputAction)).not.toBe(
                reducer(state, inputAction)
            )
        })

        it('sets the new value', () => {
            const prevState = {
                input: {
                    type: 'OUTPUT_TYPE_TRACKED_ENTITY',
                    trackedEntity: 'PERSON',
                },
            }

            expect(reducer(prevState, inputAction)).toEqual({
                input,
            })
        })
    })

    describe(`reducer: ${SET_UI_PROGRAM}`, () => {
        const program = {
            id: 'p',
        }

        const programAction = {
            type: SET_UI_PROGRAM,
            value: program,
        }
        it('returns a new object', () => {
            const state = {}

            expect(reducer(state, programAction)).not.toBe(
                reducer(state, programAction)
            )
        })

        it('sets the new value', () => {
            const prevState = {
                program: {
                    program: 'P',
                    stage: 'S',
                },
            }
            expect(reducer(prevState, programAction)).toEqual({
                program,
            })
        })
    })

    describe(`reducer: ${SET_UI_REPETITION}`, () => {
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
