const userSettings = {
    keyDbLocale: 'someLang',
}

export function getStubContext() {
    return {
        i18n: {
            t: () => {},
        },
        d2: {
            currentUser: {
                firstName: 'John',
                surname: 'Doe',
                userSettings: {
                    get: (key) => userSettings[key],
                },
            },
        },
        store: {
            dispatch: () => {},
        },
    }
}
