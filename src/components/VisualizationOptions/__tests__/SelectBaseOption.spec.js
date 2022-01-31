import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import SelectBaseOption from '../Options/SelectBaseOption.js'

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

        const { container } = render(
            <Provider store={mockStore(store)}>
                <SelectBaseOption
                    dataTest="testing-prefix"
                    label="Should I?"
                    option={option}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
})
