export const SET_USER = 'SET_USER'

export const DEFAULT_USER = {
    id: '',
    username: '',
    name: '',
    uiLocale: '',
    authorities: {},
}

export default (state = DEFAULT_USER, action) => {
    switch (action.type) {
        case SET_USER: {
            return action.value
        }
        default:
            return state
    }
}

// Selectors

export const sGetUser = (state) => state.user

export const sGetUserId = (state) => sGetUser(state).id
export const sGetUsername = (state) => sGetUser(state).username
export const sGetIsSuperuser = (state) => sGetUser(state).isSuperuser
export const sGetUiLocale = (state) => sGetUser(state).uiLocale
export const sGetUserAuthorities = (state) => sGetUser(state).authorities
