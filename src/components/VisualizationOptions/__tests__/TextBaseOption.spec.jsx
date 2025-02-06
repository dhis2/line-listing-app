import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import TextBaseOption from '../Options/TextBaseOption.jsx'

const mockStore = configureMockStore()

describe('ER > Options > TextBaseOption', () => {
    it('renders enabled input with type time', () => {
        const store = {
            ui: {
                options: {
                    theTime: '10:30',
                },
            },
        }

        const option = {
            name: 'theTime',
        }

        render(
            <Provider store={mockStore(store)}>
                <TextBaseOption
                    dataTest="testing-prefix"
                    disabled={false}
                    label="Current time"
                    option={option}
                    placeholder="placeholder text"
                    type="time"
                    width="200px"
                />
            </Provider>
        )

        const inputNode = screen.getByLabelText('Current time', {
            selector: 'input',
        })

        expect(inputNode.disabled).toBeFalsy()
        expect(inputNode.type).toEqual('time')
        expect(inputNode.name).toEqual('theTime')
    })

    it('renders disabled input with type time', () => {
        const store = {
            ui: {
                options: {
                    theTime: '10:30',
                },
            },
        }

        const option = {
            name: 'theTime',
        }

        render(
            <Provider store={mockStore(store)}>
                <TextBaseOption
                    dataTest="testing-prefix"
                    disabled={true}
                    label="Current time"
                    option={option}
                    placeholder="placeholder text"
                    type="time"
                    width="200px"
                />
            </Provider>
        )

        const inputNode = screen.getByLabelText('Current time', {
            selector: 'input',
        })

        expect(inputNode.disabled).toBeTruthy()
        expect(inputNode.type).toEqual('time')
        expect(inputNode.name).toEqual('theTime')
    })
})
