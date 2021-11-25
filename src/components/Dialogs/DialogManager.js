import {
    OrgUnitDimension,
    ouIdHelper,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_ID_PERIOD,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalContent,
    ModalActions,
    ButtonStrip,
    ModalTitle,
    Button,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current'
import { acAddMetadata } from '../../actions/metadata'
import {
    acSetUiActiveModalDialog,
    acSetUiItems,
    acAddParentGraphMap,
} from '../../actions/ui'
import { removeLastPathSegment, getOuPath } from '../../modules/orgUnit'
import { sGetMetadata } from '../../reducers/metadata'
import { sGetRootOrgUnits } from '../../reducers/settings'
import {
    sGetUiItemsByDimension,
    sGetUiActiveModalDialog,
    sGetUiParentGraphMap,
    sGetDimensionIdsFromLayout,
} from '../../reducers/ui'
import { AddToLayoutButton } from './AddToLayoutButton/AddToLayoutButton'
import ConditionsManager from './Conditions/ConditionsManager'

export const DialogManager = ({
    dialogId,
    metadata,
    parentGraphMap,
    ouIds,
    rootOrgUnits,
    dimensionIdsInLayout,
    changeDialog,
    setUiItems,
    addMetadata,
    addParentGraphMap,
    onUpdate,
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
        }
    }

    const closeDialog = () => changeDialog(null)

    const renderModalContent = () => {
        switch (dialogId) {
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
                    DIMENSION_ID_ORGUNIT === dialogId ? 'block' : 'none'

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
            default: {
                return <ConditionsManager />
            }
        }
    }

    const primaryOnClick = () => {
        onUpdate()
        closeDialog()
    }

    const renderModalTitle = () =>
        [DIMENSION_ID_PERIOD, DIMENSION_ID_ORGUNIT].includes(
            // TODO: How do we handle Period?
            dialogId
        )
            ? dimension.name
            : dimensionIdsInLayout.includes(dialogId)
            ? i18n.t('Edit dimension: {{dimensionName}}', {
                  dimensionName: dimension.name,
                  nsSeparator: '^^',
              })
            : i18n.t('Add dimension: {{dimensionName}}', {
                  dimensionName: dimension.name,
                  nsSeparator: '^^',
              })

    const dimension = metadata[dialogId]

    return (
        <>
            {dimension && (
                <Modal
                    onClose={closeDialog}
                    dataTest={`dialog-manager-${dimension.id}`}
                    position="top"
                    large
                >
                    <ModalTitle dataTest={'dialog-manager-modal-title'}>
                        {renderModalTitle()}
                    </ModalTitle>
                    <ModalContent dataTest={'dialog-manager-modal-content'}>
                        {renderModalContent()}
                    </ModalContent>
                    <ModalActions dataTest={'dialog-manager-modal-actions'}>
                        <ButtonStrip>
                            <Button
                                type="button"
                                secondary
                                onClick={closeDialog}
                                dataTest={'dialog-manager-modal-action-cancel'}
                            >
                                {i18n.t('Hide')}
                            </Button>
                            {dimensionIdsInLayout.includes(dialogId) ? (
                                <Button
                                    onClick={primaryOnClick}
                                    type="button"
                                    primary
                                    dataTest={
                                        'dialog-manager-modal-action-confirm'
                                    }
                                >
                                    {i18n.t('Update')}
                                </Button>
                            ) : (
                                <AddToLayoutButton
                                    onClick={() => alert('add to layout')}
                                    dataTest={
                                        'dialog-manager-modal-action-confirm'
                                    }
                                />
                            )}
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    )
}

DialogManager.propTypes = {
    changeDialog: PropTypes.func.isRequired,
    dimensionIdsInLayout: PropTypes.array.isRequired,
    ouIds: PropTypes.array.isRequired,
    addMetadata: PropTypes.func,
    addParentGraphMap: PropTypes.func,
    dialogId: PropTypes.string,
    metadata: PropTypes.object,
    parentGraphMap: PropTypes.object,
    rootOrgUnits: PropTypes.array,
    setUiItems: PropTypes.func,
    onUpdate: PropTypes.func,
}

DialogManager.defaultProps = {
    dialogId: null,
    rootOrgUnits: [],
}

const mapStateToProps = state => ({
    dialogId: sGetUiActiveModalDialog(state),
    metadata: sGetMetadata(state),
    parentGraphMap: sGetUiParentGraphMap(state),
    ouIds: sGetUiItemsByDimension(state, DIMENSION_ID_ORGUNIT),
    rootOrgUnits: sGetRootOrgUnits(state),
    dimensionIdsInLayout: sGetDimensionIdsFromLayout(state),
})

export default connect(mapStateToProps, {
    changeDialog: acSetUiActiveModalDialog,
    setUiItems: acSetUiItems,
    addMetadata: acAddMetadata,
    addParentGraphMap: acAddParentGraphMap,
    onUpdate: tSetCurrentFromUi,
})(DialogManager)
