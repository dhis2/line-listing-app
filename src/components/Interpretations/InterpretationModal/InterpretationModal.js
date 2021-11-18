import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Modal, ModalActions, ModalContent, Button } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
    useInterpretationIdQueryParam,
    removeInterpretationIdQueryParam,
} from './interpretationIdQueryParam.js'
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
            onClose={removeInterpretationIdQueryParam}
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
                <Button
                    disabled={fetching}
                    onClick={removeInterpretationIdQueryParam}
                >
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
    onResponseReceived: PropTypes.func.isRequired,
    interpretationId: PropTypes.string,
}

/**
 * TODO: When the interpretation modal is moved to analytics,
 * this component needs to remain in the app
 */
//
const ConnectedInterpretationModal = ({
    visualization,
    onResponseReceived,
}) => {
    const interpretationId = useInterpretationIdQueryParam()
    const isVisualizationLoading = useSelector(
        state => state.loader.isVisualizationLoading
    )
    const currentUser = useSelector(state => state.user)

    return (
        <InterpretationModal
            visualization={visualization}
            onResponseReceived={onResponseReceived}
            interpretationId={interpretationId}
            isVisualizationLoading={isVisualizationLoading}
            currentUser={currentUser}
        />
    )
}

ConnectedInterpretationModal.propTypes = {
    visualization: PropTypes.object.isRequired,
    onResponseReceived: PropTypes.func,
}

export { ConnectedInterpretationModal as InterpretationModal }
