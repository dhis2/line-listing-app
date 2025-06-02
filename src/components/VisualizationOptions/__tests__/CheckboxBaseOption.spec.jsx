import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import CheckboxBaseOption from '../Options/CheckboxBaseOption.jsx'

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

        render(
            <Provider store={mockStore(store)}>
                <CheckboxBaseOption
                    dataTest="testing-prefix"
                    inverted={true}
                    label="Should I?"
                    option={option}
                />
            </Provider>
        )

        const inputNode = screen.getByLabelText('Should I?', {
            selector: 'input',
        })

        expect(inputNode.checked).toBeFalsy()
        expect(inputNode.name).toEqual('theOptionName')
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

        render(
            <Provider store={mockStore(store)}>
                <CheckboxBaseOption
                    dataTest="testing-prefix"
                    inverted={false}
                    label="Should I?"
                    option={option}
                />
            </Provider>
        )
        const inputNode = screen.getByLabelText('Should I?', {
            selector: 'input',
        })

        expect(inputNode.checked).toBeTruthy()
        expect(inputNode.name).toEqual('theOptionName')
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

        render(
            <Provider store={mockStore(store)}>
                <CheckboxBaseOption
                    dataTest="testing-prefix"
                    inverted={true}
                    label="Should I?"
                    option={option}
                />
            </Provider>
        )
        const inputNode = screen.getByLabelText('Should I?', {
            selector: 'input',
        })

        expect(inputNode.checked).toBeTruthy()
        expect(inputNode.name).toEqual('theOptionName')
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

        render(
            <Provider store={mockStore(store)}>
                <CheckboxBaseOption
                    dataTest="testing-prefix"
                    inverted={false}
                    label="Should I?"
                    option={option}
                />
            </Provider>
        )
        const inputNode = screen.getByLabelText('Should I?', {
            selector: 'input',
        })

        expect(inputNode.checked).toBeFalsy()
        expect(inputNode.name).toEqual('theOptionName')
    })
})
