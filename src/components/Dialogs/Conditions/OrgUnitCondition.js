import {
    OrgUnitDimension,
    ouIdHelper,
    useCachedDataQuery,
} from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
import { OrganisationUnitTree } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { acAddMetadata } from '../../../actions/metadata.js'
import { acAddParentGraphMap } from '../../../actions/ui.js'
import { OPERATOR_EQUAL, OPERATOR_IN } from '../../../modules/conditions.js'
import { getOuPath, removeLastPathSegment } from '../../../modules/orgUnit.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import { sGetUiParentGraphMap } from '../../../reducers/ui.js'

// VERSION-TOGGLE: remove when 42 is lowest supported version
const OrgUnitConditionMaxVersionV41 = ({
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

// VERSION-TOGGLE: rename to OrgUnitCondition when 42 is lowest supported version
const OrgUnitConditionMinVersionV42 = ({
    addMetadata,
    addParentGraphMap,
    condition,
    onChange,
    metadata,
    parentGraphMap,
}) => {
    const { rootOrgUnits, currentUser } = useCachedDataQuery()
    const selected = useMemo(() => {
        const idsString = condition.split(':')?.[1] ?? ''

        if (idsString.length === 0) {
            return []
        }

        return idsString.split(';').map((id) => {
            const isOuTreeItem =
                !ouIdHelper.hasLevelPrefix(id) &&
                !ouIdHelper.hasGroupPrefix(id) &&
                !id.startsWith('USER_ORGUNIT')
            const metaDataId = ouIdHelper.removePrefix(id)
            const item = {
                id,
                // We store IDs for levels and groups in the metadata store without prefix
                name:
                    metadata[metaDataId].displayName ||
                    metadata[metaDataId].name,
            }

            if (isOuTreeItem) {
                item.path = getOuPath(id, metadata, parentGraphMap)
            }

            return item
        })
    }, [condition, metadata, parentGraphMap])
    const onSelect = useCallback(
        ({ items }) => {
            if (items.length === 0) {
                onChange('')
            } else {
                const { forMetadata, forParentGraphMap, itemIds } =
                    items.reduce(
                        (acc, item) => {
                            const metaDataId = ouIdHelper.removePrefix(item.id)
                            acc.itemIds.push(item.id)
                            acc.forMetadata[metaDataId] = {
                                id: metaDataId,
                                name: item.name || item.displayName,
                                displayName: item.displayName,
                            }

                            if (item.path) {
                                const path = removeLastPathSegment(item.path)

                                acc.forParentGraphMap[item.id] =
                                    path === `/${item.id}`
                                        ? ''
                                        : path.replace(/^\//, '')
                            }

                            return acc
                        },
                        { forMetadata: {}, forParentGraphMap: {}, itemIds: [] }
                    )
                addMetadata(forMetadata)
                addParentGraphMap(forParentGraphMap)
                onChange(`${OPERATOR_IN}:${itemIds.join(';')}`)
            }
        },
        [addMetadata, addParentGraphMap, onChange]
    )
    const roots = rootOrgUnits.map((rootOrgUnit) => rootOrgUnit.id)

    return (
        <OrgUnitDimension
            selected={selected}
            roots={roots}
            displayNameProp={
                currentUser.settings[
                    DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                ]
            }
            onSelect={onSelect}
        />
    )
}

// VERSION-TOGGLE: remove when 42 is lowest supported version
const OrgUnitCondition = (props) => {
    const config = useConfig()

    return config.serverVersion.minor >= 42 ? (
        <OrgUnitConditionMinVersionV42 {...props} />
    ) : (
        <OrgUnitConditionMaxVersionV41 {...props} />
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

// VERSION-TOGGLE: remove when 42 is lowest supported version
OrgUnitConditionMaxVersionV41.propTypes = OrgUnitCondition.propTypes
OrgUnitConditionMinVersionV42.propTypes = OrgUnitCondition.propTypes
OrgUnitConditionMaxVersionV41.defaultProps = OrgUnitCondition.defaultProps
OrgUnitConditionMinVersionV42.defaultProps = OrgUnitCondition.defaultProps

const mapStateToProps = (state) => ({
    metadata: sGetMetadata(state),
    parentGraphMap: sGetUiParentGraphMap(state),
})

export default connect(mapStateToProps, {
    addMetadata: acAddMetadata,
    addParentGraphMap: acAddParentGraphMap,
})(OrgUnitCondition)
