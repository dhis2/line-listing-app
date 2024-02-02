import { getAdaptedVisualization } from '../analyticsQueryTools.js'

describe('analyticsQueryTools', () => {
    it('should move enrollmentDate items to parameters', () => {
        const visualization = {
            outputType: 'TRACKED_ENTITY_INSTANCE',
            trackedEntityType: {
                id: 'nEenWmSyUEp',
            },
            columns: [
                {
                    dimension: 'ou',
                    items: [
                        {
                            id: 'USER_ORGUNIT',
                        },
                    ],
                },
                {
                    dimension: 'enrollmentDate',
                    items: [
                        {
                            id: 'theProgramId.THIS_MONTH',
                        },
                        {
                            id: 'theProgramId.LAST_3_MONTHS',
                        },
                    ],
                    programStage: {
                        id: 'theProgramId',
                    },
                },
            ],
            rows: [],
            filters: [],
        }
        const expected = {
            adaptedVisualization: {
                columns: [
                    {
                        dimension: 'ou',
                        items: [
                            {
                                id: 'USER_ORGUNIT',
                            },
                        ],
                    },
                ],
                rows: [],
                filters: [],
                outputType: 'TRACKED_ENTITY_INSTANCE',
            },
            headers: ['ouname', 'theProgramId.enrollmentdate'],
            parameters: {
                enrollmentDate: [
                    'theProgramId.THIS_MONTH',
                    'theProgramId.LAST_3_MONTHS',
                ],
            },
        }
        expect(getAdaptedVisualization(visualization)).toEqual(expected)
    })
})
