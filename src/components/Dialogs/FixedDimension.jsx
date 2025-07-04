import {
    OrgUnitDimension,
    ouIdHelper,
    DIMENSION_ID_ORGUNIT,
    useCachedDataQuery,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Checkbox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acAddMetadata } from '../../actions/metadata.js'
import { acSetUiItems, acAddParentGraphMap } from '../../actions/ui.js'
import {
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
} from '../../modules/dimensionConstants.js'
import {
    extractDimensionIdParts,
    formatDimensionId,
} from '../../modules/dimensionId.js'
import { removeLastPathSegment, getOuPath } from '../../modules/orgUnit.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../modules/userSettings.js'
import {
    STATUS_ACTIVE,
    STATUS_CANCELLED,
    STATUS_COMPLETED,
    STATUS_SCHEDULED,
    getStatusNames,
} from '../../modules/visualization.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import {
    sGetUiItemsByDimension,
    sGetUiParentGraphMap,
    sGetDimensionIdsFromLayout,
    sGetUiInputType,
} from '../../reducers/ui.js'
import DimensionModal from './DimensionModal.jsx'
import classes from './styles/Common.module.css'

const FixedDimension = ({
    addMetadata,
    addParentGraphMap,
    onClose,
    dimension,
    isInLayout,
    metadata,
    parentGraphMap,
    setUiItems,
    selectedItemsIds,
    inputType,
}) => {
    const { rootOrgUnits, currentUser } = useCachedDataQuery()
    const statusNames = getStatusNames()
    const { programId, dimensionId } = extractDimensionIdParts(
        dimension.id,
        inputType
    )
    const selectUiItems = ({ dimensionId, items }) => {
        setUiItems({
            dimensionId: dimension.id,
            itemIds: items.map((item) => item.id),
        })

        if (dimensionId === DIMENSION_ID_ORGUNIT) {
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
        }
    }

    const closeModal = () => onClose()

    const renderStatusParagraph = () => (
        <p className={classes.paragraph}>
            {i18n.t('Show items where the status is:', { nsSeparator: '^^' })}
        </p>
    )

    const setStatus = ({ selectedItemsIds, itemId, toggle }) => {
        const newIds = toggle
            ? [...new Set([...selectedItemsIds, itemId])]
            : selectedItemsIds.filter((id) => id !== itemId)

        selectUiItems({
            items: newIds.map((id) => ({ id })),
        })
    }

    const renderProgramStatus = () => {
        const ALL_STATUSES = [
            {
                id: formatDimensionId({
                    dimensionId: STATUS_ACTIVE,
                    programId,
                    outputType: inputType,
                }),
                name: statusNames[STATUS_ACTIVE],
            },
            {
                id: formatDimensionId({
                    dimensionId: STATUS_COMPLETED,
                    programId,
                    outputType: inputType,
                }),
                name: statusNames[STATUS_COMPLETED],
            },
            {
                id: formatDimensionId({
                    dimensionId: STATUS_CANCELLED,
                    programId,
                    outputType: inputType,
                }),
                name: statusNames[STATUS_CANCELLED],
            },
        ]

        return (
            <>
                {renderStatusParagraph()}
                <div>
                    {ALL_STATUSES.map(({ id, name }) => (
                        <Checkbox
                            key={id}
                            checked={selectedItemsIds.includes(id)}
                            label={name}
                            onChange={({ checked }) =>
                                setStatus({
                                    selectedItemsIds,
                                    itemId: id,
                                    toggle: checked,
                                })
                            }
                            dense
                            className={classes.verticalCheckbox}
                            dataTest="program-status-checkbox"
                        />
                    ))}
                </div>
            </>
        )
    }

    const renderEventStatus = () => {
        const ALL_STATUSES = [
            { id: STATUS_ACTIVE, name: statusNames[STATUS_ACTIVE] },
            { id: STATUS_COMPLETED, name: statusNames[STATUS_COMPLETED] },
            {
                id: STATUS_SCHEDULED,
                name: statusNames[STATUS_SCHEDULED],
            },
        ]

        return (
            <>
                {renderStatusParagraph()}
                <div>
                    {ALL_STATUSES.map(({ id, name }) => (
                        <Checkbox
                            key={id}
                            checked={selectedItemsIds.includes(id)}
                            label={name}
                            onChange={({ checked }) =>
                                setStatus({
                                    selectedItemsIds,
                                    itemId: id,
                                    toggle: checked,
                                })
                            }
                            dense
                            className={classes.verticalCheckbox}
                            dataTest="event-status-checkbox"
                        />
                    ))}
                </div>
            </>
        )
    }

    const renderModalContent = () => {
        switch (dimensionId) {
            case DIMENSION_ID_PROGRAM_STATUS:
                return renderProgramStatus()
            case DIMENSION_ID_EVENT_STATUS:
                return renderEventStatus()
            case DIMENSION_ID_ORGUNIT: {
                const dimensionProps = {
                    onSelect: selectUiItems,
                }

                const selected = selectedItemsIds
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
                    dimensionId === DIMENSION_ID_ORGUNIT ? 'block' : 'none'

                return (
                    <div key={dimension.id} style={{ display }}>
                        <OrgUnitDimension
                            selected={selected}
                            roots={rootOrgUnits.map(
                                (rootOrgUnit) => rootOrgUnit.id
                            )}
                            displayNameProp={
                                currentUser.settings[
                                    DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                                ]
                            }
                            {...dimensionProps}
                        />
                    </div>
                )
            }
        }
    }

    return dimension ? (
        <DimensionModal
            dataTest={`fixed-dimension-${dimension.id}-modal`}
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
    isInLayout: PropTypes.bool.isRequired,
    selectedItemsIds: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    addMetadata: PropTypes.func,
    addParentGraphMap: PropTypes.func,
    inputType: PropTypes.string,
    metadata: PropTypes.object,
    parentGraphMap: PropTypes.object,
    setUiItems: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
    selectedItemsIds: sGetUiItemsByDimension(state, ownProps.dimension?.id),
    isInLayout: sGetDimensionIdsFromLayout(state).includes(
        ownProps.dimension?.id
    ),
    inputType: sGetUiInputType(state),
    metadata: sGetMetadata(state),
    parentGraphMap: sGetUiParentGraphMap(state),
})

export default connect(mapStateToProps, {
    setUiItems: acSetUiItems,
    addMetadata: acAddMetadata,
    addParentGraphMap: acAddParentGraphMap,
})(FixedDimension)
