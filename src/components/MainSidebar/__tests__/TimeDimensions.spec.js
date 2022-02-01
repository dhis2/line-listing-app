import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import TimeDimensions from '../TimeDimensions.js'

const mockStore = configureMockStore()

test('input type EVENT, WITHOUT_REGISTRATION no custom labels', () => {
    const store = {
        metadata: {
            theProgramId: {
                programType: 'WITHOUT_REGISTRATION',
                programStages: [
                    {
                        id: 'theOnlyStage',
                        name: 'The Only Stage',
                    },
                ],
            },
        },
        ui: {
            program: {
                id: 'theProgramId',
                stage: 'theOnlyStage',
            },
            input: {
                type: 'EVENT',
            },
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <TimeDimensions />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('input type EVENT, WITHOUT_REGISTRATION with custom labels', () => {
    const store = {
        metadata: {
            theProgramId: {
                programType: 'WITHOUT_REGISTRATION',
                programStages: [
                    {
                        displayExecutionDateLabel: 'le event date',
                        id: 'theOnlyStage',
                        name: 'The Only Stage',
                    },
                ],
            },
        },
        ui: {
            program: {
                id: 'theProgramId',
                stage: 'theOnlyStage',
            },
            input: {
                type: 'EVENT',
            },
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <TimeDimensions />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('input type EVENT, WITH_REGISTRATION', () => {
    const store = {
        metadata: {
            theProgramId: {
                displayIncidentDate: true,
                programType: 'WITH_REGISTRATION',
                programStages: [
                    {
                        displayExecutionDateLabel: 'le event date',
                        hideDueDate: false,
                        id: 'stage1',
                    },
                    {
                        displayExecutionDateLabel: 'le 2nd event date',
                        hideDueDate: false,
                        id: 'stage2',
                    },
                ],
            },
        },
        ui: {
            program: {
                id: 'theProgramId',
                stage: 'stage1',
            },
            input: {
                type: 'EVENT',
            },
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <TimeDimensions />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('input type EVENT, WITH_REGISTRATION, custom labels', () => {
    const store = {
        metadata: {
            theProgramId: {
                displayIncidentDate: true,
                displayEnrollmentDateLabel: 'le enrollment date',
                displayIncidentDateLabel: 'le incident date',
                programType: 'WITH_REGISTRATION',
                programStages: [
                    {
                        displayDueDateLabel: 'le due date',
                        displayExecutionDateLabel: 'le event date',
                        hideDueDate: false,
                        id: 'stage1',
                    },
                    {
                        displayDueDateLabel: 'le 2nd due date',
                        displayExecutionDateLabel: 'le 2nd event date',
                        hideDueDate: true,
                        id: 'stage2',
                    },
                ],
            },
        },
        ui: {
            program: {
                id: 'theProgramId',
                stage: 'stage1',
            },
            input: {
                type: 'EVENT',
            },
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <TimeDimensions />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('input type EVENT, WITH_REGISTRATION, custom labels, hide due date', () => {
    const store = {
        metadata: {
            theProgramId: {
                displayIncidentDate: true,
                displayEnrollmentDateLabel: 'le enrollment date',
                displayIncidentDateLabel: 'le incident date',
                programType: 'WITH_REGISTRATION',
                programStages: [
                    {
                        displayDueDateLabel: 'le due date',
                        displayExecutionDateLabel: 'le event date',
                        hideDueDate: false,
                        id: 'stage1',
                    },
                    {
                        displayDueDateLabel: 'le 2nd due date',
                        displayExecutionDateLabel: 'le 2nd event date',
                        hideDueDate: true,
                        id: 'stage2',
                    },
                ],
            },
        },
        ui: {
            program: {
                id: 'theProgramId',
                stage: 'stage2',
            },
            input: {
                type: 'EVENT',
            },
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <TimeDimensions />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('input type EVENT, WITH_REGISTRATION, custom labels, hide incident date', () => {
    const store = {
        metadata: {
            theProgramId: {
                displayIncidentDate: false,
                displayEnrollmentDateLabel: 'le enrollment date',
                displayIncidentDateLabel: 'le incident date',
                programType: 'WITH_REGISTRATION',
                programStages: [
                    {
                        displayDueDateLabel: 'le due date',
                        displayExecutionDateLabel: 'le event date',
                        hideDueDate: false,
                        id: 'stage1',
                    },
                    {
                        displayDueDateLabel: 'le 2nd due date',
                        displayExecutionDateLabel: 'le 2nd event date',
                        hideDueDate: true,
                        id: 'stage2',
                    },
                ],
            },
        },
        ui: {
            program: {
                id: 'theProgramId',
                stage: 'stage1',
            },
            input: {
                type: 'EVENT',
            },
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <TimeDimensions />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('input type ENROLLMENT, WITH_REGISTRATION, custom labels, hide incident date', () => {
    const store = {
        metadata: {
            theProgramId: {
                displayIncidentDate: false,
                displayEnrollmentDateLabel: 'le enrollment date',
                displayIncidentDateLabel: 'le incident date',
                programType: 'WITH_REGISTRATION',
                programStages: [
                    {
                        displayDueDateLabel: 'le due date',
                        displayExecutionDateLabel: 'le event date',
                        hideDueDate: false,
                        id: 'stage1',
                    },
                    {
                        displayDueDateLabel: 'le 2nd due date',
                        displayExecutionDateLabel: 'le 2nd event date',
                        hideDueDate: true,
                        id: 'stage2',
                    },
                ],
            },
        },
        ui: {
            program: {
                id: 'theProgramId',
                stage: 'stage1',
            },
            input: {
                type: 'ENROLLMENT',
            },
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <TimeDimensions />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('input type ENROLLMENT, WITH_REGISTRATION, custom labels', () => {
    const store = {
        metadata: {
            theProgramId: {
                displayIncidentDate: true,
                displayEnrollmentDateLabel: 'le enrollment date',
                displayIncidentDateLabel: 'le incident date',
                programType: 'WITH_REGISTRATION',
                programStages: [
                    {
                        displayDueDateLabel: 'le due date',
                        displayExecutionDateLabel: 'le event date',
                        hideDueDate: false,
                        id: 'stage1',
                    },
                    {
                        displayDueDateLabel: 'le 2nd due date',
                        displayExecutionDateLabel: 'le 2nd event date',
                        hideDueDate: true,
                        id: 'stage2',
                    },
                ],
            },
        },
        ui: {
            program: {
                id: 'theProgramId',
                stage: 'stage1',
            },
            input: {
                type: 'ENROLLMENT',
            },
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <TimeDimensions />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('input type ENROLLMENT, WITHOUT_REGISTRATION', () => {
    const store = {
        metadata: {
            theProgramId: {
                programType: 'WITHOUT_REGISTRATION',
                programStages: [
                    {
                        hideDueDate: false,
                        id: 'stage1',
                    },
                    {
                        hideDueDate: true,
                        id: 'stage2',
                    },
                ],
            },
        },
        ui: {
            program: {
                id: 'theProgramId',
                stage: 'stage1',
            },
            input: {
                type: 'ENROLLMENT',
            },
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <TimeDimensions />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('stage missing', () => {
    const store = {
        metadata: {
            theProgramId: {
                displayIncidentDate: false,
                displayEnrollmentDateLabel: 'le enrollment date',
                displayIncidentDateLabel: 'le incident date',
                programType: 'WITH_REGISTRATION',
                programStages: [
                    {
                        displayDueDateLabel: 'le due date',
                        displayExecutionDateLabel: 'le event date',
                        hideDueDate: false,
                        id: 'stage1',
                    },
                    {
                        displayDueDateLabel: 'le 2nd due date',
                        displayExecutionDateLabel: 'le 2nd event date',
                        hideDueDate: true,
                        id: 'stage2',
                    },
                ],
            },
        },
        ui: {
            program: {
                id: 'theProgramId',
            },
            input: {
                type: 'EVENT',
            },
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <TimeDimensions />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
