import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { OUTPUT_TYPE_EVENT } from '../../../modules/visualization.js'
import { TooltipContent } from '../TooltipContent.jsx'

const mockStore = configureMockStore()

const inputTypeEvent = {
    input: {
        type: OUTPUT_TYPE_EVENT,
    },
}

describe('TooltipContent', () => {
    test('OU: 1 id and 1 level', () => {
        const store = {
            ui: {
                ...inputTypeEvent,
                itemsByDimension: {
                    ou: ['theOuId', 'LEVEL-level1Id'],
                },
            },
            metadata: {
                theOuId: { name: 'My OU' },
                level1Id: { name: 'My level 1' },
            },
        }

        const dimension = {
            id: 'ou',
            dimensionType: 'ORGANISATION_UNIT',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={false}
                    conditionsTexts={[]}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('OU: 1 id and 1 level, and missing metadata', () => {
        const store = {
            ui: {
                ...inputTypeEvent,
                itemsByDimension: {
                    ou: ['theOuId', 'LEVEL-level1Id'],
                },
            },
            metadata: {},
        }

        const dimension = {
            id: 'ou',
            dimensionType: 'ORGANISATION_UNIT',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={false}
                    conditionsTexts={[]}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('OU: 1 id and 3 groups', () => {
        const store = {
            ui: {
                ...inputTypeEvent,
                itemsByDimension: {
                    ou: [
                        'theOuId',
                        'OU_GROUP-group1Id',
                        'OU_GROUP-group2Id',
                        'OU_GROUP-group3Id',
                    ],
                },
            },
            metadata: {
                theOuId: { name: 'OU Equestria' },
                group1Id: { name: 'All the blue ponies' },
                group2Id: { name: 'All the yellow ponies' },
                group3Id: { name: 'All the purple ponies' },
            },
        }

        const dimension = {
            id: 'ou',
            dimensionType: 'ORGANISATION_UNIT',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={false}
                    conditionsTexts={[]}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('OU: none selected', () => {
        const store = {
            ui: { ...inputTypeEvent, itemsByDimension: {} },
            metadata: {},
        }

        const dimension = {
            id: 'ou',
            dimensionType: 'ORGANISATION_UNIT',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={false}
                    conditionsTexts={[]}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('Period: none selected', () => {
        const store = {
            ui: { ...inputTypeEvent, itemsByDimension: {} },
            metadata: {
                eventDate: { name: 'Report compilation date' },
            },
        }

        const dimension = {
            id: 'eventDate',
            dimensionType: 'PERIOD',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={false}
                    conditionsTexts={[]}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('Period: 2 selected', () => {
        const store = {
            ui: {
                ...inputTypeEvent,
                itemsByDimension: {
                    eventDate: ['202205', '202207'],
                },
            },
            metadata: {
                202205: {
                    id: '202205',
                    name: 'May 2022',
                },
                202207: {
                    id: '202207',
                    name: 'July 2022',
                },
            },
        }

        const dimension = {
            id: 'eventDate',
            dimensionType: 'PERIOD',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={false}
                    conditionsTexts={[]}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('COGS: 2 items', () => {
        const store = {
            ui: {
                ...inputTypeEvent,
                itemsByDimension: {
                    COGS_id: ['cogs1Id', 'cogs2Id'],
                },
            },
            metadata: {
                cogs1Id: {
                    id: 'cogs1Id',
                    name: 'COGS item 1',
                    code: 'cogs1Code',
                },
                cogs2Id: {
                    id: 'cogs2Id',
                    name: 'COGS item 2',
                    code: 'cogs2Code',
                },
            },
        }

        const dimension = {
            id: 'COGS_id',
            dimensionType: 'CATEGORY_OPTION_GROUP_SET',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={false}
                    conditionsTexts={[]}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('Data element: optionSet, 2 conditions but name missing for one', () => {
        const store = {
            ui: {
                ...inputTypeEvent,
                itemsByDimension: {},
            },
            metadata: {},
        }

        const dimension = {
            id: 'myDataElementId',
            name: 'My fascinating Data Element',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'TEXT',
            optionSet: 'optionSetId',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={true}
                    conditionsTexts={[undefined, 'Condition 2']}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('Data element: with stage and 1 condition', () => {
        const store = {
            ui: {
                ...inputTypeEvent,
                itemsByDimension: {},
            },
            metadata: {
                stageId: { name: 'The first stage' },
                'stageId.dataElementId': { name: 'Lucky numbers' },
            },
        }

        const dimension = {
            id: 'stageId.dataElementId',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
            name: 'Lucky numbers',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={true}
                    conditionsTexts={['Condition 1']}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('Data element: no conditions', () => {
        const store = {
            ui: { ...inputTypeEvent, itemsByDimension: {} },
            metadata: {},
        }

        const dimension = {
            id: 'dataElementId',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={false}
                    conditionsTexts={[]}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('Data element: 2 conditions', () => {
        const store = {
            ui: {
                ...inputTypeEvent,
                itemsByDimension: {},
            },
            metadata: {},
        }

        const dimension = {
            id: 'dimensionId',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={true}
                    conditionsTexts={['Condition 1', 'Condition 2']}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('Data element: 6 conditions', () => {
        const store = {
            ui: {
                ...inputTypeEvent,
                itemsByDimension: {},
            },
            metadata: {},
        }

        const dimension = {
            id: 'dimensionId',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={true}
                    conditionsTexts={[
                        'Condition 1',
                        'Condition 2',
                        'Condition 3',
                        'Condition 4',
                        'Condition 5',
                        'Condition 6',
                    ]}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    // TODO: figure out why plural translations are not being returned from i18n.t() in Jest tests
    // The snapshot should say "And 3 others..."
    test('Data element: 8 conditions', () => {
        const store = {
            ui: {
                ...inputTypeEvent,
                itemsByDimension: {},
            },
            metadata: {},
        }

        const dimension = {
            id: 'dimensionId',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent
                    dimension={dimension}
                    hasConditions={true}
                    conditionsTexts={[
                        'Condition 1',
                        'Condition 2',
                        'Condition 3',
                        'Condition 4',
                        'Condition 5',
                        'Condition 6',
                        'Condition 7',
                        'Condition 8',
                    ]}
                />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
})
