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
import { AddToLayoutButton } from './AddToLayoutButton/AddToLayoutButton.js'

const DimensionModal = ({
    children,
    dataTest,
    isInLayout,
    onClose,
    onUpdate,
    title,
}) => (
    <Modal onClose={onClose} dataTest={`${dataTest}`} position="top" large>
        <ModalTitle dataTest={`${dataTest}-title}`}>{title}</ModalTitle>
        <ModalContent dataTest={`${dataTest}-content`}>{children}</ModalContent>
        <ModalActions dataTest={`${dataTest}-actions`}>
            <ButtonStrip>
                <Button
                    type="button"
                    secondary
                    onClick={onClose}
                    dataTest={`${dataTest}-action-cancel`}
                >
                    {i18n.t('Hide')}
                </Button>
                {isInLayout ? (
                    <Button
                        onClick={onUpdate}
                        type="button"
                        primary
                        dataTest={`${dataTest}-action-confirm`}
                    >
                        {i18n.t('Update')}
                    </Button>
                ) : (
                    <AddToLayoutButton
                        onClick={() => alert('add to layout')}
                        dataTest={`${dataTest}-action-confirm`}
                    />
                )}
            </ButtonStrip>
        </ModalActions>
    </Modal>
)

DimensionModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    children: PropTypes.node,
    dataTest: PropTypes.string,
    isInLayout: PropTypes.bool,
    title: PropTypes.node,
}

export default DimensionModal
