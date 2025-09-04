export const currentUser = {
    id: 'currentuserid',
    name: 'John Traore',
    email: 'dummy@dhis2.org',
    settings: {
        keyDbLocale: 'en',
        keyMessageSmsNotification: false,
        keyTrackerDashboardLayout: '',
        keyCurrentStyle: 'light_blue/light_blue.css',
        keyStyle: 'light_blue/light_blue.css',
        keyUiLocale: 'en',
        keyAnalysisDisplayProperty: 'name',
        keyMessageEmailNotification: false,
    },
    authorities: ['F_VIEW_UNAPPROVED_DATA'],
}

export const interpretations = [
    {
        id: 'interpretation1',
        text: 'This is the first interpretation',
        created: '2025-09-04T07:47:12.477',
        createdBy: {
            id: 'currentuserid',
            code: null,
            name: 'John Traore',
            displayName: 'John Traore',
            username: 'admin',
        },
        comments: [
            {
                id: 'commentid1',
            },
            {
                id: 'commentid2',
            },
        ],
        likes: 1,
        access: {
            manage: true,
            write: true,
        },
        likedBy: [
            {
                id: 'currentuserid',
                code: null,
                name: 'John Traore',
                displayName: 'John Traore',
                username: 'admin',
            },
        ],
    },
]

export const interpretationDetails = {
    ...interpretations[0],
    comments: [
        {
            created: '2025-09-04T07:47:39.167',
            createdBy: {
                id: 'currentuserid',
                code: null,
                name: 'John Traore',
                displayName: 'John Traore',
                username: 'admin',
            },
            text: 'This is the first comment',
            id: 'commentid1',
        },
        {
            created: '2025-09-04T07:47:42.011',
            createdBy: {
                id: 'currentuserid',
                code: null,
                name: 'John Traore',
                displayName: 'John Traore',
                username: 'admin',
            },
            text: 'This is the second comment',
            id: 'commentid2',
        },
    ],
}
