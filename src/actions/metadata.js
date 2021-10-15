import { ADD_METADATA } from '../reducers/metadata'
import { sGetRootOrgUnit } from '../reducers/settings'

export const acAddMetadata = value => ({
    type: ADD_METADATA,
    value,
})

export const tSetInitMetadata = () => (dispatch, getState) => {
    const rootOrgUnit = sGetRootOrgUnit(getState())
    if (rootOrgUnit?.id) {
        dispatch(
            acAddMetadata({
                [rootOrgUnit.id]: {
                    ...rootOrgUnit,
                    path: `/${rootOrgUnit.id}`,
                },
            })
        )
    }
}
