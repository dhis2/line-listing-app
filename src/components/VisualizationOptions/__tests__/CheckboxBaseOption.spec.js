import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import CheckboxBaseOption from '../Options/CheckboxBaseOption.js'

const mockStore = configureMockStore()

describe('ER > Options > CheckboxBaseOption', () => {
    it('renders checkbox with value: true, inverted: true', () => {
        const store = {
            ui: {
                options: {
                    theOptionName: true,
                },
            },
        }

        const option = {
            name: 'theOptionName',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <CheckboxBaseOption
                    dataTest="testing-prefix"
                    inverted={true}
                    label="Should I?"
                    option={option}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })

    it('renders checkbox with value: true, inverted: false', () => {
        const store = {
            ui: {
                options: {
                    theOptionName: true,
                },
            },
        }

        const option = {
            name: 'theOptionName',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <CheckboxBaseOption
                    dataTest="testing-prefix"
                    inverted={false}
                    label="Should I?"
                    option={option}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })

    it('renders checkbox with value: false, inverted: true', () => {
        const store = {
            ui: {
                options: {
                    theOptionName: false,
                },
            },
        }

        const option = {
            name: 'theOptionName',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <CheckboxBaseOption
                    dataTest="testing-prefix"
                    inverted={true}
                    label="Should I?"
                    option={option}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })

    it('renders checkbox with value: false, inverted: false', () => {
        const store = {
            ui: {
                options: {
                    theOptionName: false,
                },
            },
        }

        const option = {
            name: 'theOptionName',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <CheckboxBaseOption
                    dataTest="testing-prefix"
                    inverted={false}
                    label="Should I?"
                    option={option}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
})
