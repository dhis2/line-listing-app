import {
    OrgUnitDimension,
    ouIdHelper,
    DIMENSION_ID_ORGUNIT,
    useCachedDataQuery,
} from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
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
import { removeLastPathSegment, getOuPath } from '../../modules/orgUnit.js'
import {
    STATUS_ACTIVE,
    STATUS_CANCELLED,
    STATUS_COMPLETED,
    STATUS_SCHEDULED,
    statusNames,
} from '../../modules/visualization.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import {
    sGetUiItemsByDimension,
    sGetUiParentGraphMap,
    sGetDimensionIdsFromLayout,
} from '../../reducers/ui.js'
import DimensionModal from './DimensionModal.js'
import classes from './styles/Common.module.css'

const FixedDimension = ({
    addMetadata,
    addParentGraphMap,
    onClose,
    dimension,
    isInLayout,
    metadata,
    ouIds,
    eventStatusIds,
    programStatusIds,
    parentGraphMap,
    setUiItems,
}) => {
    const { rootOrgUnits } = useCachedDataQuery()
    const { serverVersion } = useConfig()
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

    const renderStatusParagraph = () => (
        <p className={classes.paragraph}>
            {i18n.t('Show items where the status is:', { nsSeparator: '^^' })}
        </p>
    )

    const setStatus = ({ dimensionId, selectedItemsIds, itemId, toggle }) => {
        const newIds = toggle
            ? [...new Set([...selectedItemsIds, itemId])]
            : selectedItemsIds.filter((id) => id !== itemId)

        selectUiItems({
            dimensionId,
            items: newIds.map((id) => ({ id })),
        })
    }

    const renderProgramStatus = () => {
        const ALL_STATUSES = [
            { id: STATUS_ACTIVE, name: statusNames[STATUS_ACTIVE] },
            { id: STATUS_COMPLETED, name: statusNames[STATUS_COMPLETED] },
            { id: STATUS_CANCELLED, name: statusNames[STATUS_CANCELLED] },
        ]

        return (
            <>
                {renderStatusParagraph()}
                <div>
                    {ALL_STATUSES.map(({ id, name }) => (
                        <Checkbox
                            key={id}
                            checked={programStatusIds.includes(id)}
                            label={name}
                            onChange={({ checked }) =>
                                setStatus({
                                    dimensionId: DIMENSION_ID_PROGRAM_STATUS,
                                    selectedItemsIds: programStatusIds,
                                    itemId: id,
                                    toggle: checked,
                                })
                            }
                            dense
                            className={classes.verticalCheckbox}
                            dataTest={'program-status-checkbox'}
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
        ]

        if (
            `${serverVersion.major}.${serverVersion.minor}.${
                serverVersion.patch || 0
            }` >= '2.39.0'
        ) {
            ALL_STATUSES.push({
                id: STATUS_SCHEDULED,
                name: statusNames[STATUS_SCHEDULED],
            })
        }

        return (
            <>
                {renderStatusParagraph()}
                <div>
                    {ALL_STATUSES.map(({ id, name }) => (
                        <Checkbox
                            key={id}
                            checked={eventStatusIds.includes(id)}
                            label={name}
                            onChange={({ checked }) =>
                                setStatus({
                                    dimensionId: DIMENSION_ID_EVENT_STATUS,
                                    selectedItemsIds: eventStatusIds,
                                    itemId: id,
                                    toggle: checked,
                                })
                            }
                            dense
                            className={classes.verticalCheckbox}
                            dataTest={'event-status-checkbox'}
                        />
                    ))}
                </div>
            </>
        )
    }

    const renderModalContent = () => {
        switch (dimension.id) {
            case DIMENSION_ID_PROGRAM_STATUS:
                return renderProgramStatus()
            case DIMENSION_ID_EVENT_STATUS:
                return renderEventStatus()
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
            dataTest={'fixed-dimension-modal'}
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
    eventStatusIds: PropTypes.array.isRequired,
    isInLayout: PropTypes.bool.isRequired,
    ouIds: PropTypes.array.isRequired,
    programStatusIds: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    addMetadata: PropTypes.func,
    addParentGraphMap: PropTypes.func,
    metadata: PropTypes.object,
    parentGraphMap: PropTypes.object,
    setUiItems: PropTypes.func,
}

FixedDimension.defaultProps = {
    rootOrgUnits: [],
}

const mapStateToProps = (state, ownProps) => ({
    eventStatusIds: sGetUiItemsByDimension(state, DIMENSION_ID_EVENT_STATUS),
    isInLayout: sGetDimensionIdsFromLayout(state).includes(
        ownProps.dimension?.id
    ),
    metadata: sGetMetadata(state),
    ouIds: sGetUiItemsByDimension(state, DIMENSION_ID_ORGUNIT),
    parentGraphMap: sGetUiParentGraphMap(state),
    programStatusIds: sGetUiItemsByDimension(
        state,
        DIMENSION_ID_PROGRAM_STATUS
    ),
})

export default connect(mapStateToProps, {
    setUiItems: acSetUiItems,
    addMetadata: acAddMetadata,
    addParentGraphMap: acAddParentGraphMap,
})(FixedDimension)
