import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import SelectBaseOption from '../Options/SelectBaseOption.jsx'

const mockStore = configureMockStore()

describe('ER > Options > SelectBaseOption', () => {
    it('renders the list of options', () => {
        const store = {
            ui: {
                options: {
                    theOptionName: 'option3',
                },
            },
        }

        const option = {
            name: 'theOptionName',
            items: [
                { label: 'Option 1 label', value: 'option1' },
                { label: 'Option 2 label', value: 'option2' },
                { label: 'Option 3 label', value: 'option3' },
            ],
        }

        const { getByText } = render(
            <Provider store={mockStore(store)}>
                <SelectBaseOption
                    dataTest="testing-prefix"
                    label="Should I?"
                    option={option}
                />
            </Provider>
        )

        expect(getByText('Option 3 label')).toBeTruthy()

        const option2 = screen.queryByText('Option 2 label')
        expect(option2).toBeNull()

        const option1 = screen.queryByText('Option 1 label')
        expect(option1).toBeNull()
    })
})
