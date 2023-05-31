import { PROP_MOST_RECENT, PROP_OLDEST } from '../../modules/ui.js'
import { OUTPUT_TYPE_EVENT } from '../../modules/visualization.js'
import reducer, {
    DEFAULT_UI,
    SET_UI_INPUT,
    CLEAR_UI_PROGRAM,
    UPDATE_UI_PROGRAM_ID,
    UPDATE_UI_PROGRAM_STAGE_ID,
    SET_UI_REPETITION,
    TOGGLE_UI_LAYOUT_PANEL_HIDDEN,
    TOGGLE_UI_SIDEBAR_HIDDEN,
    TOGGLE_UI_EXPANDED_VISUALIZATION_CANVAS,
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

        it('is pure', () => {
            const state = {}

            expect(reducer(state, inputAction).input).not.toBe(state)
        })

        it('sets the new value', () => {
            const prevState = {
                input: {
                    type: 'tracked entity',
                    trackedEntityType: 'person',
                },
            }

            expect(reducer(prevState, inputAction)).toEqual({
                input,
            })
        })
    })

    describe(`reducer: ${CLEAR_UI_PROGRAM}`, () => {
        const prevState = {
            program: {
                id: 'P',
                stageId: 'S',
            },
        }

        const clearProgramAction = {
            type: CLEAR_UI_PROGRAM,
        }

        it('clears the selected program', () => {
            expect(reducer(prevState, clearProgramAction)).toEqual({
                program: {},
            })
        })

        it('is pure', () => {
            const state = {}

            expect(reducer(state, clearProgramAction)).not.toBe(state)
        })
    })

    describe(`reducer: ${UPDATE_UI_PROGRAM_ID}`, () => {
        const programId = 'p'

        const programIdAction = {
            type: UPDATE_UI_PROGRAM_ID,
            value: programId,
        }

        it('sets the new program id', () => {
            expect(reducer({}, programIdAction).program.id).toBe(programId)
        })

        it('is pure', () => {
            const state = {}

            expect(
                reducer({ program: state }, programIdAction).program
            ).not.toBe(state)
        })
    })

    describe(`reducer: ${UPDATE_UI_PROGRAM_STAGE_ID}`, () => {
        const programStage = 's'

        const programStageAction = {
            type: UPDATE_UI_PROGRAM_STAGE_ID,
            value: programStage,
        }

        it('sets the new program stage id', () => {
            expect(reducer({}, programStageAction).program.stageId).toBe(
                programStage
            )
        })

        it('is pure', () => {
            const state = {}

            expect(
                reducer({ program: state }, programStageAction).program
            ).not.toBe(state)
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

    describe(`reducer: ${TOGGLE_UI_LAYOUT_PANEL_HIDDEN}`, () => {
        it('toggles true to false', () => {
            expect(
                reducer(
                    { hideLayoutPanel: true },
                    { type: TOGGLE_UI_LAYOUT_PANEL_HIDDEN }
                )
            ).toEqual({ hideLayoutPanel: false })
        })
        it('toggles false to true', () => {
            expect(
                reducer(
                    { hideLayoutPanel: false },
                    { type: TOGGLE_UI_LAYOUT_PANEL_HIDDEN }
                )
            ).toEqual({ hideLayoutPanel: true })
        })
    })
    describe(`reducer: ${TOGGLE_UI_SIDEBAR_HIDDEN}`, () => {
        it('toggles true to false', () => {
            expect(
                reducer(
                    { hideMainSideBar: true },
                    { type: TOGGLE_UI_SIDEBAR_HIDDEN }
                )
            ).toEqual({ hideMainSideBar: false })
        })
        it('toggles false to true', () => {
            expect(
                reducer(
                    { hideMainSideBar: false },
                    { type: TOGGLE_UI_SIDEBAR_HIDDEN }
                )
            ).toEqual({ hideMainSideBar: true })
        })
    })
    describe(`reducer: ${TOGGLE_UI_EXPANDED_VISUALIZATION_CANVAS}`, () => {
        it('toggles both hideLayoutPanel and hideMainSideBar to true if both are false', () => {
            expect(
                reducer(
                    {
                        hideLayoutPanel: false,
                        hideMainSideBar: false,
                    },
                    { type: TOGGLE_UI_EXPANDED_VISUALIZATION_CANVAS }
                )
            ).toEqual({ hideLayoutPanel: true, hideMainSideBar: true })
        })

        it('toggles both hideLayoutPanel and hideMainSideBar to true if one of them is true', () => {
            expect(
                reducer(
                    {
                        hideLayoutPanel: true,
                        hideMainSideBar: false,
                    },
                    { type: TOGGLE_UI_EXPANDED_VISUALIZATION_CANVAS }
                )
            ).toEqual({ hideLayoutPanel: true, hideMainSideBar: true })

            expect(
                reducer(
                    {
                        hideLayoutPanel: false,
                        hideMainSideBar: true,
                    },
                    { type: TOGGLE_UI_EXPANDED_VISUALIZATION_CANVAS }
                )
            ).toEqual({ hideLayoutPanel: true, hideMainSideBar: true })
        })

        it('toggles both hideLayoutPanel and hideMainSideBar to false if both are true', () => {
            expect(
                reducer(
                    {
                        hideLayoutPanel: true,
                        hideMainSideBar: true,
                    },
                    { type: TOGGLE_UI_EXPANDED_VISUALIZATION_CANVAS }
                )
            ).toEqual({ hideLayoutPanel: false, hideMainSideBar: false })
        })
    })
})
