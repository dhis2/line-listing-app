import {
    OrgUnitDimension,
    ouIdHelper,
    useCachedDataQuery,
} from '@dhis2/analytics'
import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, OrganisationUnitTree, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { acAddMetadata } from '../../../actions/metadata.js'
import { acAddParentGraphMap } from '../../../actions/ui.js'
import { OPERATOR_EQUAL, OPERATOR_IN } from '../../../modules/conditions.js'
import { getOuPath, removeLastPathSegment } from '../../../modules/orgUnit.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import { sGetUiParentGraphMap } from '../../../reducers/ui.js'
import styles from './styles/OrgUnitCondition.module.css'

// VERSION-TOGGLE: remove when 42 is lowest supported version
const ouPathQuery = {
    organisationUnit: {
        resource: 'organisationUnits',
        id: ({ id }) => id,
        params: {
            fields: ['id', 'path'],
        },
    },
}
const parseParentGraphMapItem = (id, fullPath) => {
    const path = removeLastPathSegment(fullPath)

    return path === `/${id}` ? '' : path.replace(/^\//, '')
}

const OrgUnitConditionMaxVersionV41 = ({
    addMetadata,
    addParentGraphMap,
    condition,
    onChange,
    metadata,
    parentGraphMap,
}) => {
    const { rootOrgUnits } = useCachedDataQuery()
    const { loading, error, refetch } = useDataQuery(ouPathQuery, {
        lazy: true,
        onComplete: ({ organisationUnit: { id, path } }) => {
            addParentGraphMap({ [id]: parseParentGraphMapItem(id, path) })
        },
        onError: () => {
            /* When details of the selected item cannot be fetched we cannot
             * show the previously selected item in the tree so it is better
             * to clear the selection so what the user sees reflects reality */
            onChange('')
        },
    })
    const parts = condition.split(':')
    const selectedOuId = parts[1]?.length && parts[1]
    const selectedOuPath = getOuPath(selectedOuId, metadata, parentGraphMap)

    const setValues = (item) => {
        if (item.checked) {
            addMetadata({
                [item.id]: {
                    id: item.id,
                    name: item.name || item.displayName,
                    displayName: item.displayName,
                },
            })

            if (item.path) {
                addParentGraphMap({
                    [item.id]: parseParentGraphMapItem(item.id, item.path),
                })
            }

            onChange(`${OPERATOR_EQUAL}:${item.id}`)
        } else {
            onChange('')
        }
    }

    const roots = rootOrgUnits.map((rootOrgUnit) => rootOrgUnit.id)

    useEffect(() => {
        if (selectedOuId && !selectedOuPath) {
            refetch({ id: selectedOuId })
        }
    }, [selectedOuId, selectedOuPath, refetch])

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <CircularLoader small />
            </div>
        )
    }

    return (
        <>
            {error && (
                <NoticeBox
                    warning
                    title={i18n.t('Previous selection was cleared')}
                    className={styles.warningNoticeBox}
                >
                    {i18n.t(
                        'Fetching details for the previously selected organisation unit failed. The selected item has been cleared so that a new selection can be made.'
                    )}
                </NoticeBox>
            )}
            <OrganisationUnitTree
                roots={roots}
                initiallyExpanded={[
                    ...(roots.length === 1 ? [`/${roots[0]}`] : []),
                    selectedOuPath?.substring(
                        0,
                        selectedOuPath.lastIndexOf('/')
                    ),
                ].filter((path) => path)}
                selected={selectedOuPath && [selectedOuPath]}
                onChange={(item) => setValues(item)}
                dataTest="org-unit-tree"
                singleSelection
            />
        </>
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

// VERSION-TOGGLE: remove when 42 is lowest supported version
OrgUnitConditionMaxVersionV41.propTypes = OrgUnitCondition.propTypes
OrgUnitConditionMinVersionV42.propTypes = OrgUnitCondition.propTypes

const mapStateToProps = (state) => ({
    metadata: sGetMetadata(state),
    parentGraphMap: sGetUiParentGraphMap(state),
})

export default connect(mapStateToProps, {
    addMetadata: acAddMetadata,
    addParentGraphMap: acAddParentGraphMap,
})(OrgUnitCondition)
