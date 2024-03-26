import { useCachedDataQuery } from '@dhis2/analytics'
import { OrganisationUnitTree } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acAddMetadata } from '../../../actions/metadata.js'
import { acAddParentGraphMap } from '../../../actions/ui.js'
import { OPERATOR_EQUAL } from '../../../modules/conditions.js'
import { getOuPath, removeLastPathSegment } from '../../../modules/orgUnit.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import { sGetUiParentGraphMap } from '../../../reducers/ui.js'

const OrgUnitCondition = ({
    addMetadata,
    addParentGraphMap,
    condition,
    onChange,
    metadata,
    parentGraphMap,
}) => {
    const { rootOrgUnits } = useCachedDataQuery()
    const parts = condition.split(':')
    const value = parts[1]?.length && parts[1]

    const setValues = (item) => {
        if (item.checked) {
            const forMetadata = {}
            const forParentGraphMap = {}

            forMetadata[item.id] = {
                id: item.id,
                name: item.name || item.displayName,
                displayName: item.displayName,
            }

            if (item.path) {
                const path = removeLastPathSegment(item.path)

                forParentGraphMap[item.id] =
                    path === `/${item.id}` ? '' : path.replace(/^\//, '')
            }

            addMetadata(forMetadata)
            addParentGraphMap(forParentGraphMap)
            onChange(`${OPERATOR_EQUAL}:${item.id}`)
        } else {
            onChange('')
        }
    }

    const selected = value
        ? {
              id: value,
              name: metadata[value].displayName || metadata[value].name,
              path: getOuPath(value, metadata, parentGraphMap),
          }
        : {}

    const roots = rootOrgUnits.map((rootOrgUnit) => rootOrgUnit.id)

    return (
        <OrganisationUnitTree
            roots={roots}
            initiallyExpanded={[
                ...(roots.length === 1 ? [`/${roots[0]}`] : []),
                selected?.path?.substring(0, selected.path.lastIndexOf('/')),
            ].filter((path) => path)}
            selected={selected.path && [selected.path]}
            onChange={(item) => setValues(item)}
            dataTest="org-unit-tree"
            singleSelection
        />
    )
}

OrgUnitCondition.propTypes = {
    condition: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    addMetadata: PropTypes.func,
    addParentGraphMap: PropTypes.func,
    metadata: PropTypes.object,
    parentGraphMap: PropTypes.object,
}

OrgUnitCondition.defaultProps = {
    rootOrgUnits: [],
}

const mapStateToProps = (state) => ({
    metadata: sGetMetadata(state),
    parentGraphMap: sGetUiParentGraphMap(state),
})

export default connect(mapStateToProps, {
    addMetadata: acAddMetadata,
    addParentGraphMap: acAddParentGraphMap,
})(OrgUnitCondition)
