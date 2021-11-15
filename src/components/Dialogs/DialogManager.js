import {
    OrgUnitDimension,
    ouIdHelper,
    DIMENSION_ID_ORGUNIT,
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
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current'
import { acAddMetadata } from '../../actions/metadata'
import {
    acSetUiActiveModalDialog,
    acSetUiItems,
    acAddParentGraphMap,
} from '../../actions/ui'
import { removeLastPathSegment, getOuPath } from '../../modules/orgUnit'
import { sGetDimensions } from '../../reducers/dimensions'
import { sGetMetadata } from '../../reducers/metadata'
import { sGetRootOrgUnits } from '../../reducers/settings'
import {
    sGetUiItemsByDimension,
    sGetUiActiveModalDialog,
    sGetUiParentGraphMap,
    sGetDimensionIdsFromLayout,
} from '../../reducers/ui'
import { AddToLayoutButton } from './AddToLayoutButton/AddToLayoutButton'

export class DialogManager extends Component {
    // TODO: Convert to functional component
    state = {
        onMounted: false,
    }

    componentDidUpdate = () => {
        if (
            this.props.dialogId === DIMENSION_ID_ORGUNIT &&
            !this.state.ouMounted
        ) {
            this.setState({ ouMounted: true })
        }
    }

    selectUiItems = ({ dimensionId, items }) => {
        this.props.setUiItems({
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

                this.props.addMetadata(forMetadata)
                this.props.addParentGraphMap(forParentGraphMap)

                break
            }
        }
    }

    closeDialog = () => this.props.changeDialog(null)

    getOrgUnitsFromIds = (ids, metadata, parentGraphMap) =>
        ids
            .filter(id => metadata[ouIdHelper.removePrefix(id)] !== undefined)
            .map(id => {
                const ouUid = ouIdHelper.removePrefix(id)
                return {
                    id,
                    name: metadata[ouUid].displayName || metadata[ouUid].name,
                    path: getOuPath(ouUid, metadata, parentGraphMap),
                }
            })

    // The OU content is persisted as mounted in order
    // to cache the org unit tree data
    // TODO: Still needed with the new ui org unit tree?
    renderPersistedContent = dimensionProps => {
        const { ouIds, metadata, parentGraphMap, dialogId } = this.props

        if (this.state.ouMounted) {
            const selected = this.getOrgUnitsFromIds(
                ouIds,
                metadata,
                parentGraphMap
            )

            const display = DIMENSION_ID_ORGUNIT === dialogId ? 'block' : 'none'

            return (
                <div key={DIMENSION_ID_ORGUNIT} style={{ display }}>
                    <OrgUnitDimension
                        selected={selected}
                        roots={this.props.rootOrgUnits.map(
                            rootOrgUnit => rootOrgUnit.id
                        )}
                        {...dimensionProps}
                    />
                </div>
            )
        }

        return null
    }

    renderDialogContent = () => {
        const dimensionProps = {
            onSelect: this.selectUiItems,
        }

        this.renderPersistedContent(dimensionProps)
    }

    primaryOnClick = () => {
        this.props.onUpdate()
        this.closeDialog()
    }

    render() {
        const { dialogId, dimensions = {} } = this.props
        const dimension = dimensions[dialogId]

        return (
            <>
                {dimension && (
                    <Modal
                        onClose={this.closeDialog}
                        dataTest={`dialog-manager-${dimension.id}`}
                        position="top"
                        large
                    >
                        <ModalTitle dataTest={'dialog-manager-modal-title'}>
                            {dimension.name}
                        </ModalTitle>
                        <ModalContent dataTest={'dialog-manager-modal-content'}>
                            {this.renderDialogContent()}
                        </ModalContent>
                        <ModalActions dataTest={'dialog-manager-modal-actions'}>
                            <ButtonStrip>
                                <Button
                                    type="button"
                                    secondary
                                    onClick={this.closeDialog}
                                    dataTest={
                                        'dialog-manager-modal-action-cancel'
                                    }
                                >
                                    {i18n.t('Hide')}
                                </Button>
                                {this.props.dimensionIdsInLayout.includes(
                                    dialogId
                                ) ? (
                                    <Button
                                        onClick={this.primaryOnClick}
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
}

DialogManager.propTypes = {
    changeDialog: PropTypes.func.isRequired,
    dimensionIdsInLayout: PropTypes.array.isRequired,
    ouIds: PropTypes.array.isRequired,
    addMetadata: PropTypes.func,
    addParentGraphMap: PropTypes.func,
    dialogId: PropTypes.string,
    dimensions: PropTypes.object,
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
    dimensions: sGetDimensions(state),
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
