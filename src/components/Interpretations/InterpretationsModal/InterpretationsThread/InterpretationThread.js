import { IconClock16, colors } from '@dhis2/ui'
import cx from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { Comment } from './Comment.js'
import { CommentAddForm } from './CommentAddForm.js'
import { Interpretation } from './Interpretation.js'
import styles from './styles/InterpretationThread.module.css'

const InterpretationThread = ({
    currentUser,
    fetching,
    interpretation,
    refetchInterpretation,
}) => {
    const focusRef = useRef()

    return (
        <div className={cx(styles.container, { [styles.fetching]: fetching })}>
            <div className={styles.scrollbox}>
                {fetching && <div>FETCHING</div>}
                <div className={styles.title}>
                    <IconClock16 color={colors.grey700} />
                    {moment(interpretation.created).format('LLL')}
                </div>
                <div style={{ color: 'red' }}>Download btn placeholder</div>
                <Interpretation
                    currentUser={currentUser}
                    interpretation={interpretation}
                    reply={() => focusRef.current?.focus()}
                    refresh={refetchInterpretation}
                />
                <div className={styles.comments}>
                    {interpretation.comments.map(comment => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            interpretationId={interpretation.id}
                            refresh={refetchInterpretation}
                        />
                    ))}
                </div>
                <CommentAddForm
                    currentUser={currentUser}
                    interpretationId={interpretation.id}
                    onSave={refetchInterpretation}
                    focusRef={focusRef}
                />
            </div>
        </div>
    )
}

InterpretationThread.propTypes = {
    currentUser: PropTypes.object.isRequired,
    fetching: PropTypes.bool.isRequired,
    interpretation: PropTypes.object.isRequired,
    refetchInterpretation: PropTypes.func.isRequired,
}

export { InterpretationThread }
