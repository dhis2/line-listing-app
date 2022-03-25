import { getDefaultMetadata } from '../modules/metadata.js'
import { ADD_METADATA, CLEAR_METADATA } from '../reducers/metadata.js'
import { sGetRootOrgUnits } from '../reducers/settings.js'

export const acAddMetadata = (value) => ({
    type: ADD_METADATA,
    value,
})

const acClearMetadata = () => ({
    type: CLEAR_METADATA,
})

export const tSetInitMetadata = () => (dispatch, getState) => {
    const metaData = { ...getDefaultMetadata() }
    const rootOrgUnits = sGetRootOrgUnits(getState())

    rootOrgUnits.forEach((rootOrgUnit) => {
        if (rootOrgUnit.id) {
            metaData[rootOrgUnit.id] = {
                ...rootOrgUnit,
                path: `/${rootOrgUnit.id}`,
            }
        }
    })

    dispatch(acClearMetadata())
    dispatch(acAddMetadata(metaData))
}
