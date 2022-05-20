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
                conditions={{}}
                items={[]}
                metadata={{}}
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
                conditions={{}}
                items={['LAST_12_MONTHS']}
                metadata={{ LAST_12_MONTHS: { name: 'Last 12 months' } }}
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
                conditions={{}}
                items={[]}
                metadata={{}}
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
                conditions={{}}
                items={['OU_ID_1', 'OU_ID_2']}
                metadata={{
                    OU_ID_1: { name: 'Orgunit 1' },
                    OU_ID_2: { name: 'Orgunit 2' },
                }}
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
                conditions={{}}
                items={[]}
                metadata={{}}
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
                conditions={{
                    condition: 'GT:1:LT:45',
                }}
                items={[]}
                metadata={{}}
            />
        )
        expect(container).toMatchSnapshot()
    })
    test('data element with legend set no options chosen', () => {
        const dimension = {
            id: 'dataElementId',
            name: 'My data element',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditions={{
                    condition: '',
                    legendSet: 'legendSetId',
                }}
                items={[]}
                metadata={{}}
            />
        )
        expect(container).toMatchSnapshot()
    })
    test('data element with legend set and 2 options chosen', () => {
        const dimension = {
            id: 'dataElementId',
            name: 'My data element',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
        }

        const { container } = render(
            <ChipBase
                dimension={dimension}
                conditions={{
                    condition: 'IN:legendSetOption1Id;legendSetOption2Id',
                    legendSet: 'legendSetId',
                }}
                items={[]}
                metadata={{}}
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
                conditions={{
                    condition: 'IN:4;5',
                }}
                items={[]}
                metadata={{}}
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
                conditions={{
                    condition: 'IN:4;5',
                }}
                items={[]}
                metadata={{}}
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
                conditions={{}}
                items={[]}
                metadata={{}}
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
                conditions={{
                    condition: 'IN:1',
                }}
                items={[]}
                metadata={{}}
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
                conditions={{
                    condition: 'IN:1;NV',
                }}
                items={[]}
                metadata={{}}
            />
        )
        expect(container).toMatchSnapshot()
    })
})
