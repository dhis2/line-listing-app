import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Visualization } from '../../Visualization/Visualization.js'
import { InterpretationThread } from './InterpretationThread.js'

const InterpretationModalContent = ({
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
        <div className="row">
            <div className="visualisation-wrap">
                <Visualization
                    relativePeriodDate={interpretation.created}
                    visualization={visualization}
                    onResponseReceived={onResponseReceived}
                />
            </div>
            <div className="thread-wrap">
                <InterpretationThread
                    interpretation={interpretation}
                    refetchInterpretation={refetchInterpretation}
                    fetching={fetching}
                    currentUser={currentUser}
                />
            </div>
            <style jsx>{`
                .row {
                    display: flex;
                    flex-direction: row;
                    gap: 16px;
                }
                .visualisation-wrap {
                    flex-grow: 1;
                }
                .thread-wrap {
                    flex-basis: 300px;
                    flex-shrink: 0;
                    overflow-y: auto;
                }
            `}</style>
        </div>
    )
}

InterpretationModalContent.propTypes = {
    currentUser: PropTypes.object.isRequired,
    refetchInterpretation: PropTypes.func.isRequired,
    visualization: PropTypes.object.isRequired,
    onResponseReceived: PropTypes.func.isRequired,
    error: PropTypes.object,
    fetching: PropTypes.bool,
    interpretation: PropTypes.object,
}

export { InterpretationModalContent }
