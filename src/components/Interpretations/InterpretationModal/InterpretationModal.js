import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Modal, ModalActions, ModalContent, Button } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { InterpretationModalContent } from './InterpretationModalContent.js'
import styles from './styles/InterpretationModal.module.css'

const query = {
    interpretation: {
        resource: 'interpretations',
        id: ({ id }) => id,
        params: {
            fields: [
                'id',
                'text',
                'created',
                'createdBy[id,displayName]',
                'likes',
                'likedBy',
                'comments[access,id,text,created,createdBy[id,displayName]]',
            ],
        },
    },
}

const useInterpretationModalState = interpretationId => {
    const { data, error, loading, fetching, refetch } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        refetch({ id: interpretationId })
    }, [interpretationId])

    return {
        interpretation: data?.interpretation,
        error,
        loading,
        fetching,
        show: !!interpretationId,
        refetchInterpretation: refetch,
    }
}

const InterpretationModal = ({
    currentUser,
    isVisualizationLoading,
    visualization,
    onResponseReceived,
    onClose,
    interpretationId,
}) => {
    const {
        interpretation,
        error,
        loading,
        fetching,
        show,
        refetchInterpretation,
    } = useInterpretationModalState(interpretationId)

    const shouldCssHideModal = loading || isVisualizationLoading

    if (!show) {
        return null
    }

    return (
        <Modal
            position="middle"
            onClose={onClose}
            className={cx(styles.modal, {
                [styles.hidden]: shouldCssHideModal,
            })}
        >
            <h1 className={styles.title}>
                <span className={styles.ellipsis}>
                    {i18n.t('Viewing interpretation: {{visualisationName}}', {
                        visualisationName: visualization.displayName,
                        nsSeparator: '^^',
                    })}
                </span>
            </h1>
            <ModalContent className={styles.modalContent}>
                <div className={styles.container}>
                    <InterpretationModalContent
                        error={error}
                        fetching={fetching}
                        interpretation={interpretation}
                        onResponseReceived={onResponseReceived}
                        refetchInterpretation={refetchInterpretation}
                        visualization={visualization}
                        currentUser={currentUser}
                    />
                </div>
            </ModalContent>
            <ModalActions>
                <Button disabled={fetching} onClick={onClose}>
                    {i18n.t('Hide interpretation')}
                </Button>
            </ModalActions>
        </Modal>
    )
}

InterpretationModal.propTypes = {
    currentUser: PropTypes.object.isRequired,
    isVisualizationLoading: PropTypes.bool.isRequired,
    visualization: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onResponseReceived: PropTypes.func.isRequired,
    interpretationId: PropTypes.string,
}

export { InterpretationModal }
