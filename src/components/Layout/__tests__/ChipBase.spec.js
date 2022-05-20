import { render } from '@testing-library/react'
import React from 'react'
import { ChipBase } from '../ChipBase.js'
import '../../../locales/index.js'

describe('ChipBase', () => {
    test('Period: none selected', () => {
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
    test('Period: 1 selected', () => {
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
    test('OU: none selected', () => {
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
    test('OU: 2 selected', () => {
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
    test('Data element: no conditions', () => {
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
    test('Data element: 2 conditions', () => {
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
    test('Data element: option set and 2 options chosen', () => {
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
    test('Data element: in stage with option set and 2 options chosen', () => {
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
    test('Data element: TRUE_ONLY no conditions', () => {
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
    test('Data element: TRUE_ONLY 1 conditions', () => {
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
    test('Data element: TRUE_ONLY both selected', () => {
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
