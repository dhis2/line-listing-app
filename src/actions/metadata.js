import { getDefaultMetadata } from '../modules/metadata.js'
import { ADD_METADATA, CLEAR_METADATA } from '../reducers/metadata.js'

export const acAddMetadata = (value) => ({
    type: ADD_METADATA,
    value,
})

const acClearMetadata = () => ({
    type: CLEAR_METADATA,
})

export const tSetInitMetadata =
    (rootOrgUnits = []) =>
    (dispatch) => {
        const metaData = { ...getDefaultMetadata() }

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
