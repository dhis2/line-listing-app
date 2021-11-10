import { ADD_METADATA } from '../reducers/metadata'
import { sGetRootOrgUnits } from '../reducers/settings'

export const acAddMetadata = value => ({
    type: ADD_METADATA,
    value,
})

export const tSetInitMetadata = () => (dispatch, getState) => {
    const rootOrgUnits = sGetRootOrgUnits(getState())
    rootOrgUnits.forEach(rootOrgUnit => {
        if (rootOrgUnit.id) {
            dispatch(
                acAddMetadata({
                    [rootOrgUnit.id]: {
                        ...rootOrgUnit,
                        path: `/${rootOrgUnit.id}`,
                    },
                })
            )
        }
    })
}
