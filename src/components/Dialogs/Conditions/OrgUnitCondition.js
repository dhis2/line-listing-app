import { OrgUnitDimension, useCachedDataQuery } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { acAddMetadata } from '../../../actions/metadata.js'
import { acAddParentGraphMap } from '../../../actions/ui.js'
import { OPERATOR_IN } from '../../../modules/conditions.js'
import { getOuPath, removeLastPathSegment } from '../../../modules/orgUnit.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
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
    const { rootOrgUnits, currentUser } = useCachedDataQuery()
    const selected = useMemo(() => {
        const idsString = condition.split(':')?.[1] ?? ''

        if (idsString.length === 0) {
            return []
        }

        return idsString.split(';').map((id) => {
            const item = {
                id,
                name: metadata[id].displayName || metadata[id].name,
            }
            const isOuTreeItem =
                !id.startsWith('LEVEL') &&
                !id.startsWith('OU_GROUP') &&
                !id.startsWith('USER_ORGUNIT')

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
                            acc.itemIds.push(item.id)
                            acc.forMetadata[item.id] = {
                                id: item.id,
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
            // Not sure we need to set any of the props below
            hideGroupSelect={false}
            hideLevelSelect={false}
            hideUserOrgUnits={false}
            warning={undefined}
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
