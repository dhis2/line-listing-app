import defaultMetadata from '../modules/metadata'
import { ADD_METADATA } from '../reducers/metadata'
import { sGetRootOrgUnit } from '../reducers/settings'

export const acAddMetadata = value => ({
    type: ADD_METADATA,
    value,
})

export const tSetInitMetadata = () => (dispatch, getState) => {
    const rootOrgUnit = sGetRootOrgUnit(getState())
    dispatch(
        acAddMetadata({
            ...defaultMetadata(),
            ...(rootOrgUnit?.id && {
                [rootOrgUnit.id]: {
                    ...rootOrgUnit,
                    path: `/${rootOrgUnit.id}`,
                },
            }),
        })
    )
}
