export const SET_USER = 'SET_USER'

export const DEFAULT_USER = {
    id: '',
    username: '',
    name: '',
    uiLocale: '',
    isSuperuser: false,
    authorities: {},
}

export default (state = DEFAULT_USER, action) => {
    switch (action.type) {
        case SET_USER: {
            return fromD2ToUserObj(action.value)
        }
        default:
            return state
    }
}

function fromD2ToUserObj(d2Object) {
    return {
        id: d2Object.id,
        username: d2Object.username,
        name: d2Object.name,
        uiLocale: d2Object.settings.keyUiLocale,
        isSuperuser: d2Object.authorities.has('ALL'),
    }
}

// Selectors

export const sGetUser = (state) => state.user

export const sGetUserId = (state) => sGetUser(state).id
export const sGetUsername = (state) => sGetUser(state).username
export const sGetIsSuperuser = (state) => sGetUser(state).isSuperuser
export const sGetUiLocale = (state) => sGetUser(state).uiLocale
export const sGetUserAuthorities = (state) => sGetUser(state).authorities
