import {
    OrgUnitDimension,
    ouIdHelper,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Checkbox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current.js'
import { acAddMetadata } from '../../actions/metadata.js'
import {
    acSetUiItems,
    acAddParentGraphMap,
    acSetUiProgramStatus,
    acSetUiEventStatus,
} from '../../actions/ui.js'
import {
    DIMENSION_TYPE_EVENT_STATUS,
    DIMENSION_TYPE_PROGRAM_STATUS,
} from '../../modules/dimensionTypes.js'
import { removeLastPathSegment, getOuPath } from '../../modules/orgUnit.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import { sGetRootOrgUnits } from '../../reducers/settings.js'
import {
    sGetUiItemsByDimension,
    sGetUiParentGraphMap,
    sGetDimensionIdsFromLayout,
    sGetUiProgramStatus,
    sGetUiEventStatus,
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
    onUpdate,
    ouIds,
    parentGraphMap,
    rootOrgUnits,
    setUiItems,
}) => {
    const dispatch = useDispatch()
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
            {i18n.t('Show items where the status is:')}
        </p>
    )

    const renderProgramStatus = () => {
        const PROGRAM_STATUS_ACTIVE = 'active',
            PROGRAM_STATUS_COMPLETED = 'completed',
            PROGRAM_STATUS_CANCELLED = 'cancelled' // TODO: Ideally these are defined somewhere more central
        const ALL_STATUSES = [
            { id: PROGRAM_STATUS_ACTIVE, name: i18n.t('Active') },
            { id: PROGRAM_STATUS_COMPLETED, name: i18n.t('Completed') },
            { id: PROGRAM_STATUS_CANCELLED, name: i18n.t('Cancelled') },
        ]
        const selectedStatus = useSelector(sGetUiProgramStatus)

        const setStatus = (id, toggle) => {
            if (toggle) {
                dispatch(
                    acSetUiProgramStatus([...new Set([...selectedStatus, id])])
                )
            } else {
                dispatch(
                    acSetUiProgramStatus(
                        selectedStatus.filter((status) => status !== id)
                    )
                )
            }
        }

        return (
            <>
                {renderStatusParagraph()}
                <div>
                    {ALL_STATUSES.map((status) => (
                        <Checkbox
                            key={status.id}
                            checked={selectedStatus.includes(status.id)}
                            label={status.name}
                            onChange={({ checked }) =>
                                setStatus(status.id, checked)
                            }
                            dense
                            className={classes.verticalCheckbox}
                        />
                    ))}
                </div>
            </>
        )
    }

    const renderEventStatus = () => {
        const EVENT_STATUS_ACTIVE = 'active',
            EVENT_STATUS_COMPLETED = 'completed',
            EVENT_STATUS_SCHEDULED = 'scheduled',
            EVENT_STATUS_OVERDUE = 'overdue',
            EVENT_STATUS_SKIPPED = 'skipped' // TODO: Ideally these are defined somewhere more central
        const ALL_STATUSES = [
            { id: EVENT_STATUS_ACTIVE, name: i18n.t('Active') },
            { id: EVENT_STATUS_COMPLETED, name: i18n.t('Completed') },
            { id: EVENT_STATUS_SCHEDULED, name: i18n.t('Scheduled') },
            { id: EVENT_STATUS_OVERDUE, name: i18n.t('Overdue') },
            { id: EVENT_STATUS_SKIPPED, name: i18n.t('Skipped') },
        ]
        const selectedStatus = useSelector(sGetUiEventStatus)

        const setStatus = (id, toggle) => {
            if (toggle) {
                dispatch(
                    acSetUiEventStatus([...new Set([...selectedStatus, id])])
                )
            } else {
                dispatch(
                    acSetUiEventStatus(
                        selectedStatus.filter((status) => status !== id)
                    )
                )
            }
        }

        return (
            <>
                {renderStatusParagraph()}
                <div>
                    {ALL_STATUSES.map((status) => (
                        <Checkbox
                            key={status.id}
                            checked={selectedStatus.includes(status.id)}
                            label={status.name}
                            onChange={({ checked }) =>
                                setStatus(status.id, checked)
                            }
                            dense
                            className={classes.verticalCheckbox}
                        />
                    ))}
                </div>
            </>
        )
    }

    const renderModalContent = () => {
        switch (dimension.id) {
            case DIMENSION_TYPE_PROGRAM_STATUS:
                return renderProgramStatus()
            case DIMENSION_TYPE_EVENT_STATUS:
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

    const primaryOnClick = () => {
        onUpdate()
        closeModal()
    }

    return dimension ? (
        <DimensionModal
            dataTest={'dialog-manager-modal'}
            isInLayout={isInLayout}
            onClose={closeModal}
            onUpdate={primaryOnClick}
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
    onUpdate: PropTypes.func,
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
    onUpdate: tSetCurrentFromUi,
})(FixedDimension)
