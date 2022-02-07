import {
    OrgUnitDimension,
    ouIdHelper,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current.js'
import { acAddMetadata } from '../../actions/metadata.js'
import { acSetUiItems, acAddParentGraphMap } from '../../actions/ui.js'
import { removeLastPathSegment, getOuPath } from '../../modules/orgUnit.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import { sGetRootOrgUnits } from '../../reducers/settings.js'
import {
    sGetUiItemsByDimension,
    sGetUiParentGraphMap,
    sGetDimensionIdsFromLayout,
} from '../../reducers/ui.js'
import DimensionModal from './DimensionModal.js'

const FixedDimension = ({
    addMetadata,
    addParentGraphMap,
    onClose,
    dimension,
    isInLayout,
    metadata,
    ouIds,
    parentGraphMap,
    rootOrgUnits,
    setUiItems,
}) => {
    const selectUiItems = ({ dimensionId, items }) => {
        setUiItems({
            dimensionId,
            itemIds: items.map((item) => item.id),
        })

        switch (dimensionId) {
            case DIMENSION_ID_ORGUNIT: {
                const forMetadata = {}
                const forParentGraphMap = {}

                items.forEach((ou) => {
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
        switch (dimension.id) {
            case DIMENSION_ID_ORGUNIT: {
                const dimensionProps = {
                    onSelect: selectUiItems,
                }

                const selected = ouIds // TODO: Refactor to not depend on the whole metadata object, but pass in full ouObjects (mapped with metadata) instead of just ids
                    .filter(
                        (id) =>
                            metadata[ouIdHelper.removePrefix(id)] !== undefined
                    )
                    .map((id) => {
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
                    dimension.id === DIMENSION_ID_ORGUNIT ? 'block' : 'none'

                return (
                    <div key={DIMENSION_ID_ORGUNIT} style={{ display }}>
                        <OrgUnitDimension
                            selected={selected}
                            roots={rootOrgUnits.map(
                                (rootOrgUnit) => rootOrgUnit.id
                            )}
                            {...dimensionProps}
                        />
                    </div>
                )
            }
            // TODO: case DIMENSION_ID_PERIOD:
        }
    }

    return dimension ? (
        <DimensionModal
            dataTest={'dialog-manager-modal'}
            isInLayout={isInLayout}
            onClose={closeModal}
            title={dimension.name}
        >
            {renderModalContent()}
        </DimensionModal>
    ) : null
}

FixedDimension.propTypes = {
    dimension: PropTypes.object.isRequired,
    isInLayout: PropTypes.array.isRequired,
    ouIds: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    addMetadata: PropTypes.func,
    addParentGraphMap: PropTypes.func,
    metadata: PropTypes.object,
    parentGraphMap: PropTypes.object,
    rootOrgUnits: PropTypes.array,
    setUiItems: PropTypes.func,
}

FixedDimension.defaultProps = {
    rootOrgUnits: [],
}

const mapStateToProps = (state, ownProps) => ({
    isInLayout: sGetDimensionIdsFromLayout(state).includes(
        ownProps.dimension?.id
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
})(FixedDimension)
