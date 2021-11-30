import {
    OrgUnitDimension,
    ouIdHelper,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current'
import { acAddMetadata } from '../../actions/metadata'
import { acSetUiItems, acAddParentGraphMap } from '../../actions/ui'
import { removeLastPathSegment, getOuPath } from '../../modules/orgUnit'
import { sGetMetadata } from '../../reducers/metadata'
import { sGetRootOrgUnits } from '../../reducers/settings'
import {
    sGetUiItemsByDimension,
    sGetUiParentGraphMap,
    sGetDimensionIdsFromLayout,
} from '../../reducers/ui'
import DimensionModal from './DimensionModal'

export const FixedDimension = ({
    addMetadata,
    addParentGraphMap,
    onClose,
    dimensionId,
    isInLayout,
    metadata,
    onUpdate,
    ouIds,
    parentGraphMap,
    rootOrgUnits,
    setUiItems,
}) => {
    const selectUiItems = ({ dimensionId, items }) => {
        setUiItems({
            dimensionId,
            itemIds: items.map(item => item.id),
        })

        switch (dimensionId) {
            case DIMENSION_ID_ORGUNIT: {
                const forMetadata = {}
                const forParentGraphMap = {}

                items.forEach(ou => {
                    const id = ouIdHelper.removePrefix(ou.id)
                    forMetadata[id] = {
                        id,
                        name: ou.name || ou.displayName,
                        displayName: ou.displayName,
                    }

                    if (ou.path) {
                        const path = removeLastPathSegment(ou.path)

                        forParentGraphMap[ou.id] =
                            path === `/${ou.id}` ? '' : path.replace(/^\//, '')
                    }
                })

                addMetadata(forMetadata)
                addParentGraphMap(forParentGraphMap)

                break
            }
            // TODO: case DIMENSION_ID_PERIOD:
        }
    }

    const closeModal = () => onClose()

    const renderModalContent = () => {
        switch (dimensionId) {
            case DIMENSION_ID_ORGUNIT: {
                const dimensionProps = {
                    onSelect: selectUiItems,
                }

                const selected = ouIds // TODO: Refactor to not depend on the whole metadata object, but pass in full ouObjects (mapped with metadata) instead of just ids
                    .filter(
                        id =>
                            metadata[ouIdHelper.removePrefix(id)] !== undefined
                    )
                    .map(id => {
                        const ouUid = ouIdHelper.removePrefix(id)
                        return {
                            id,
                            name:
                                metadata[ouUid].displayName ||
                                metadata[ouUid].name,
                            path: getOuPath(ouUid, metadata, parentGraphMap),
                        }
                    })

                const display =
                    DIMENSION_ID_ORGUNIT === dimensionId ? 'block' : 'none'

                return (
                    <div key={DIMENSION_ID_ORGUNIT} style={{ display }}>
                        <OrgUnitDimension
                            selected={selected}
                            roots={rootOrgUnits.map(
                                rootOrgUnit => rootOrgUnit.id
                            )}
                            {...dimensionProps}
                        />
                    </div>
                )
            }
            // TODO: case DIMENSION_ID_PERIOD:
        }
    }

    const primaryOnClick = () => {
        onUpdate()
        closeModal()
    }

    const renderModalTitle = () => dimension.name

    const dimension = metadata[dimensionId]

    return (
        <>
            {dimension && (
                <DimensionModal
                    content={renderModalContent()}
                    dataTest={'dialog-manager-modal'}
                    isInLayout={isInLayout}
                    onClose={closeModal}
                    onUpdate={primaryOnClick}
                    title={renderModalTitle()}
                />
            )}
        </>
    )
}

FixedDimension.propTypes = {
    dimensionId: PropTypes.string.isRequired,
    isInLayout: PropTypes.array.isRequired,
    ouIds: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    addMetadata: PropTypes.func,
    addParentGraphMap: PropTypes.func,
    metadata: PropTypes.object,
    parentGraphMap: PropTypes.object,
    rootOrgUnits: PropTypes.array,
    setUiItems: PropTypes.func,
    onUpdate: PropTypes.func,
}

FixedDimension.defaultProps = {
    rootOrgUnits: [],
}

const mapStateToProps = (state, ownProps) => ({
    isInLayout: sGetDimensionIdsFromLayout(state).includes(
        ownProps.dimensionId
    ),
    metadata: sGetMetadata(state),
    ouIds: sGetUiItemsByDimension(state, DIMENSION_ID_ORGUNIT),
    parentGraphMap: sGetUiParentGraphMap(state),
    rootOrgUnits: sGetRootOrgUnits(state),
})

export default connect(mapStateToProps, {
    setUiItems: acSetUiItems,
    addMetadata: acAddMetadata,
    addParentGraphMap: acAddParentGraphMap,
    onUpdate: tSetCurrentFromUi,
})(FixedDimension)
