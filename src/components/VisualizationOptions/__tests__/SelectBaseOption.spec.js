import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { SelectBaseOption } from '../Options/SelectBaseOption'

describe('ER > Options > SelectBaseOption', () => {
    let props
    let shallowSelectBaseOption
    const onChange = jest.fn()

    const selectBaseOption = props => {
        shallowSelectBaseOption = shallow(<SelectBaseOption {...props} />)

        return shallowSelectBaseOption
    }

    beforeEach(() => {
        props = {
            value: '',
            option: {
                name: 'select',
                defaultValue: '',
                items: [
                    { value: 'opt1', label: 'Option 1' },
                    { value: 'opt2', label: 'Option 2' },
                    { value: 'opt3', label: 'Option 3' },
                ],
            },
            onChange,
        }

        shallowSelectBaseOption = undefined
    })

    it('renders a <SingleSelectField />', () => {
        expect(selectBaseOption(props).find(SingleSelectField)).toHaveLength(1)
    })

    it('renders the list of options', () => {
        const options = selectBaseOption(props).find(SingleSelectOption)

        options.forEach((item, index) => {
            const option = props.option.items[index]

            expect(item.props().value).toEqual(option.value)
            expect(item.props().label).toEqual(option.label)
        })
    })

    it('should trigger the onChange callback on select change', () => {
        const select = selectBaseOption(props).find(SingleSelectField)

        select.simulate('change', {
            selected: {
                value: props.option.items.find(item => item.value === 'opt2'),
            },
        })

        expect(onChange).toHaveBeenCalled()
    })
})
