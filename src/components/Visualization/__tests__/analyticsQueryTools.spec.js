import { getAdaptedVisualization } from '../analyticsQueryTools.js'

describe('analyticsQueryTools', () => {
    it('should move enrollmentDate items to parameters', () => {
        const visualization = {
            outputType: 'TRACKED_ENTITY_INSTANCE',
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
    it('should move enrollmentDate items from 2 programs to parameters', () => {
        const visualization = {
            outputType: 'TRACKED_ENTITY_INSTANCE',
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
                            id: 'program_1_id.LAST_3_MONTHS',
                        },
                        {
                            id: 'program_1_id.LAST_MONTH',
                        },
                    ],
                    programStage: {
                        id: 'program_1_id',
                    },
                },
                {
                    dimension: 'enrollmentDate',
                    items: [
                        {
                            id: 'program_2_id.LAST_12_MONTHS',
                        },
                        {
                            id: 'program_2_id.LAST_6_MONTHS',
                        },
                    ],
                    programStage: {
                        id: 'program_2_id',
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
            headers: [
                'ouname',
                'program_1_id.enrollmentdate',
                'program_2_id.enrollmentdate',
            ],
            parameters: {
                enrollmentDate: [
                    'program_1_id.LAST_3_MONTHS',
                    'program_1_id.LAST_MONTH',
                    'program_2_id.LAST_12_MONTHS',
                    'program_2_id.LAST_6_MONTHS',
                ],
            },
        }

        expect(getAdaptedVisualization(visualization)).toEqual(expected)
    })
    it('should not prefix eventDate with stage ID for EVENT output type', () => {
        const visualization = {
            outputType: 'EVENT',
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
                    dimension: 'eventDate',
                    items: [
                        {
                            id: 'LAST_MONTH',
                        },
                    ],
                    programStage: {
                        id: 'A03MvHHogjR',
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
                outputType: 'EVENT',
            },
            headers: ['ouname', 'eventdate'],
            parameters: {
                eventDate: ['LAST_MONTH'],
            },
        }
        expect(getAdaptedVisualization(visualization)).toEqual(expected)
    })
    it('should not prefix scheduledDate with stage ID for EVENT output type', () => {
        const visualization = {
            outputType: 'EVENT',
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
            rows: [
                {
                    dimension: 'scheduledDate',
                    items: [
                        {
                            id: 'THIS_MONTH',
                        },
                    ],
                    programStage: {
                        id: 'B12345678',
                    },
                },
            ],
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
                outputType: 'EVENT',
            },
            headers: ['ouname', 'scheduleddate'],
            parameters: {
                scheduledDate: ['THIS_MONTH'],
            },
        }
        expect(getAdaptedVisualization(visualization)).toEqual(expected)
    })
    it('should not prefix enrollmentDate with stage ID for ENROLLMENT output type', () => {
        const visualization = {
            outputType: 'ENROLLMENT',
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
            rows: [
                {
                    dimension: 'enrollmentDate',
                    items: [
                        {
                            id: 'LAST_YEAR',
                        },
                    ],
                    programStage: {
                        id: 'C12345678',
                    },
                },
            ],
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
                outputType: 'ENROLLMENT',
            },
            headers: ['ouname', 'enrollmentdate'],
            parameters: {
                enrollmentDate: ['LAST_YEAR'],
            },
        }
        expect(getAdaptedVisualization(visualization)).toEqual(expected)
    })
})
