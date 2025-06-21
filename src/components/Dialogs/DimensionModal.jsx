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
import UpdateButton from '../UpdateButton/UpdateButton.jsx'
import UpdateVisualizationContainer from '../UpdateButton/UpdateVisualizationContainer.js'
import AddToLayoutButton from './AddToLayoutButton/AddToLayoutButton.jsx'
import classes from './styles/DimensionModal.module.css'

const DimensionModal = ({ children, dataTest, isInLayout, onClose, title }) => {
    const onClick = (handler) => {
        onClose()
        handler()
    }

    return (
        <Modal onClose={onClose} dataTest={`${dataTest}`} position="top" large>
            <ModalTitle dataTest={`${dataTest}-title`}>{title}</ModalTitle>
            <ModalContent
                dataTest={`${dataTest}-content`}
                className={classes.modalContent}
            >
                {children}
            </ModalContent>
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
                        <UpdateVisualizationContainer
                            renderComponent={(handler) => (
                                <UpdateButton
                                    onClick={() => onClick(handler)}
                                    dataTest={`${dataTest}-action-confirm`}
                                />
                            )}
                        />
                    ) : (
                        <AddToLayoutButton
                            onClick={onClose}
                            dataTest={`${dataTest}-action-confirm`}
                        />
                    )}
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

DimensionModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
    dataTest: PropTypes.string,
    isInLayout: PropTypes.bool,
    title: PropTypes.node,
}

export default DimensionModal
