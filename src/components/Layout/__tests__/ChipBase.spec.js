import { render } from '@testing-library/react'
import React from 'react'
import { ChipBase } from '../ChipBase.js'
import '../../../locales/index.js'

describe('ChipBase', () => {
    test('empty date', () => {
        const dimension = {
            id: 'eventDate',
            name: 'Event date (analytics)',
            dimensionType: 'PERIOD',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditionsLength={0}
                itemsLength={0}
            />
        )
        expect(container).toMatchSnapshot()
    })
    test('date 1 selected', () => {
        const dimension = {
            id: 'eventDate',
            name: 'Event date (analytics)',
            dimensionType: 'PERIOD',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditionsLength={0}
                itemsLength={1}
            />
        )
        expect(container).toMatchSnapshot()
    })
    test('empty ou', () => {
        const dimension = {
            id: 'ou',
            name: 'Organsiation unit',
            dimensionType: 'ORGANISATION_UNIT',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditionsLength={0}
                itemsLength={0}
            />
        )
        expect(container).toMatchSnapshot()
    })
    test('ou 2 selected', () => {
        const dimension = {
            id: 'eventDate',
            name: 'Event date (analytics)',
            dimensionType: 'PERIOD',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditionsLength={0}
                itemsLength={2}
            />
        )
        expect(container).toMatchSnapshot()
    })
    test('data element all', () => {
        const dimension = {
            id: 'dataElementId',
            name: 'My data element',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditionsLength={0}
                itemsLength={0}
            />
        )
        expect(container).toMatchSnapshot()
    })
    //TODO - why isn't i18n.t working with plurals
    test('data element 2 conditions', () => {
        const dimension = {
            id: 'dataElementId',
            name: 'My data element',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditionsLength={2}
                itemsLength={0}
            />
        )
        expect(container).toMatchSnapshot()
    })
    test('data element with option set and 2 options chosen', () => {
        const dimension = {
            id: 'dataElementId',
            name: 'My data element',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
            optionSet: 'optionSetId',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditionsLength={2}
                itemsLength={0}
            />
        )
        expect(container).toMatchSnapshot()
    })
    test('data element in stage with option set and 2 options chosen', () => {
        const dimension = {
            id: 'stageId.dataElementId',
            name: 'My data element',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
            optionSet: 'optionSetId',
            stageName: 'Stage 1',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditionsLength={2}
                itemsLength={0}
            />
        )
        expect(container).toMatchSnapshot()
    })
    test('TRUE_ONLY data element with all', () => {
        const dimension = {
            id: 'dataElementId',
            name: 'My data element',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'TRUE_ONLY',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditionsLength={0}
                itemsLength={0}
            />
        )
        expect(container).toMatchSnapshot()
    })
    test('TRUE_ONLY data element with 1 selected', () => {
        const dimension = {
            id: 'dataElementId',
            name: 'My data element',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'TRUE_ONLY',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditionsLength={1}
                itemsLength={0}
            />
        )
        expect(container).toMatchSnapshot()
    })
    test('TRUE_ONLY data element with both selected', () => {
        const dimension = {
            id: 'dataElementId',
            name: 'My data element',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'TRUE_ONLY',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditionsLength={2}
                itemsLength={0}
            />
        )
        expect(container).toMatchSnapshot()
    })
})
