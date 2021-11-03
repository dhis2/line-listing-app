import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Visualization } from '../../Visualization/Visualization.js'
import { InterpretationThread } from './InterpretationsThread/index.js'
import styles from './styles/InterpretationsModalContent.module.css'

const InterpretationsModalContent = ({
    currentUser,
    refetchInterpretation,
    visualization,
    onResponseReceived,
    error,
    fetching,
    interpretation,
}) => {
    if (!error && !interpretation) {
        return null
    }

    if (error) {
        return (
            <NoticeBox error title={i18n.t('Could not load interpretation')}>
                {error.message ||
                    i18n.t(
                        'The interpretation couldn’t be displayed. Try again or contact your system administrator.'
                    )}
            </NoticeBox>
        )
    }

    return (
        <div className={styles.flexRow}>
            <div className={styles.visualisationWrap}>
                <Visualization
                    relativePeriodDate={interpretation.created}
                    visualization={visualization}
                    onResponseReceived={onResponseReceived}
                />
            </div>
            <div className={styles.interpretationThreadWrap}>
                <InterpretationThread
                    interpretation={interpretation}
                    refetchInterpretation={refetchInterpretation}
                    fetching={fetching}
                    currentUser={currentUser}
                />
            </div>
        </div>
    )
}

InterpretationsModalContent.propTypes = {
    currentUser: PropTypes.object.isRequired,
    refetchInterpretation: PropTypes.func.isRequired,
    visualization: PropTypes.object.isRequired,
    onResponseReceived: PropTypes.func.isRequired,
    error: PropTypes.object,
    fetching: PropTypes.bool,
    interpretation: PropTypes.object,
}

export { InterpretationsModalContent }
