import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { TooltipContent } from '../TooltipContent.js'

const mockStore = configureMockStore()

describe('TooltipContent', () => {
    test('ou and level', () => {
        const store = {
            ui: {
                itemsByDimension: {
                    ou: ['equestriaOuId', 'LEVEL-evertreeForestId'],
                },
                conditions: {},
            },
            metadata: {
                equestriaOuId: { name: 'OU Equestria' },
                evertreeForestId: { name: 'Evertree forest' },
            },
        }

        const dimension = {
            id: 'ou',
            dimensionType: 'ORGANISATION_UNIT',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('ou with missing metadata', () => {
        const store = {
            ui: {
                itemsByDimension: {
                    ou: ['equestriaOuId', 'LEVEL-evertreeForestId'],
                },
                conditions: {},
            },
            metadata: {},
        }

        const dimension = {
            id: 'ou',
            dimensionType: 'ORGANISATION_UNIT',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('ou id and 3 ou groups', () => {
        const store = {
            ui: {
                itemsByDimension: {
                    ou: [
                        'equestriaOuId',
                        'OU_GROUP-bluePonies',
                        'OU_GROUP-yellowPonies',
                        'OU_GROUP-purplePonies',
                    ],
                },
                conditions: {},
            },
            metadata: {
                equestriaOuId: { name: 'OU Equestria' },
                bluePonies: { name: 'All the blue ponies' },
                yellowPonies: { name: 'All the yellow ponies' },
                purplePonies: { name: 'All the purple ponies' },
            },
        }

        const dimension = {
            id: 'ou',
            dimensionType: 'ORGANISATION_UNIT',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('no conditions', () => {
        const store = {
            ui: { itemsByDimension: {}, conditions: {} },
            metadata: {},
        }

        const dimension = {
            id: 'dataElementId',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
            optionSet: undefined,
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('COGS', () => {
        const store = {
            ui: {
                itemsByDimension: {
                    COGS_id: ['cogs1Id', 'cogs2Id'],
                },
                conditions: {},
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
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('no period selected', () => {
        const store = {
            ui: { itemsByDimension: {}, conditions: {} },
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
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('period selected', () => {
        const store = {
            ui: {
                itemsByDimension: {
                    eventDate: ['202205', '202207'],
                },
                conditions: {},
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
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('no ou selected', () => {
        const store = {
            ui: { itemsByDimension: {}, conditions: {} },
            metadata: {},
        }

        const dimension = {
            id: 'ou',
            dimensionType: 'ORGANISATION_UNIT',
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('return null when at least one item is missing a name', () => {
        const store = {
            ui: {
                itemsByDimension: {},
                conditions: {
                    myDataElementId: {
                        condition: 'IN:ModernaVaxCode;PfizerVaxCode',
                    },
                },
            },
            metadata: {
                PfizerVaxId: {
                    id: 'PfizerVaxId',
                    name: 'The Pfizer Vaccine',
                    code: 'PfizerVaxCode',
                },
            },
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
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('with stage', () => {
        const store = {
            ui: {
                itemsByDimension: {},
                conditions: {
                    'stageId.dataElementId': {
                        condition: 'GT:11',
                    },
                },
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
            optionSet: undefined,
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('legendset without options chosen', () => {
        const store = {
            ui: {
                itemsByDimension: {},
                conditions: {
                    dimensionId: {
                        condition: '',
                        legendSet: 'legendSetId',
                    },
                },
            },
            metadata: {
                legendSetId: {
                    id: 'legendSetId',
                    legends: [
                        {
                            startValue: 0,
                            endValue: 5,
                            id: 'legendOption1Id',
                            name: '0 - 4',
                        },
                        {
                            startValue: 5,
                            endValue: 15,
                            id: 'legendOption2Id',
                            name: '5 - 14',
                        },
                        {
                            startValue: 15,
                            endValue: 25,
                            id: 'evLlhbRsG6e',
                            name: '15 - 24',
                        },
                    ],
                    name: 'Legend set name',
                },
            },
        }

        const dimension = {
            id: 'dimensionId',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
            legendSets: [{ id: 'legendSetId', name: 'Legend set name' }],
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('legendset with options chosen', () => {
        const store = {
            ui: {
                itemsByDimension: {},
                conditions: {
                    dimensionId: {
                        condition: 'IN:legendOption1Id;legendOption2Id',
                        legendSet: 'legendSetId',
                    },
                },
            },
            metadata: {
                legendSetId: {
                    id: 'legendSetId',
                    legends: [
                        {
                            startValue: 0,
                            endValue: 5,
                            id: 'legendOption1Id',
                            name: '0 - 4',
                        },
                        {
                            startValue: 5,
                            endValue: 15,
                            id: 'legendOption2Id',
                            name: '5 - 14',
                        },
                        {
                            startValue: 15,
                            endValue: 25,
                            id: 'evLlhbRsG6e',
                            name: '15 - 24',
                        },
                    ],
                    name: 'Legend set name',
                },
            },
        }

        const dimension = {
            id: 'dimensionId',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
            legendSets: [{ id: 'legendSetId', name: 'Legend set name' }],
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('2 conditions', () => {
        const store = {
            ui: {
                itemsByDimension: {},
                conditions: {
                    dimensionId: {
                        condition: 'NE:NV:LT:1000',
                    },
                },
            },
            metadata: {},
        }

        const dimension = {
            id: 'dimensionId',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
            optionSet: undefined,
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    test('6 conditions', () => {
        const store = {
            ui: {
                itemsByDimension: {},
                conditions: {
                    dimensionId: {
                        condition: 'NE:NV:LT:1000:GT:10:!EQ:11:!EQ:50:!EQ:35',
                    },
                },
            },
            metadata: {},
        }

        const dimension = {
            id: 'dimensionId',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
            optionSet: undefined,
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
    // TODO: figure out why plural translations are not being returned from i18n.t() in Jest tests
    test.skip('8 conditions', () => {
        const store = {
            ui: {
                itemsByDimension: {},
                conditions: {
                    dimensionId: {
                        condition:
                            'NE:NV:LT:1000:GT:10:!EQ:11:!EQ:50:!EQ:35:!EQ:3500:EQ:33',
                    },
                },
            },
            metadata: {},
        }

        const dimension = {
            id: 'dimensionId',
            dimensionType: 'DATA_ELEMENT',
            valueType: 'NUMBER',
            optionSet: undefined,
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TooltipContent dimension={dimension} />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
})
