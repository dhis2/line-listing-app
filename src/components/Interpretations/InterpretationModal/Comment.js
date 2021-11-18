import i18n from '@dhis2/d2-i18n'
import { IconEdit16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Message, MessageIconButton, MessageStatsBar } from '../common/index.js'
import { CommentDeleteButton } from './CommentDeleteButton.js'
import { CommentUpdateForm } from './CommentUpdateForm'

const Comment = ({ comment, currentUser, interpretationId, refresh }) => {
    const [isUpdateMode, setIsUpdateMode] = useState(false)

    return isUpdateMode ? (
        <CommentUpdateForm
            close={() => setIsUpdateMode(false)}
            commentId={comment.id}
            interpretationId={interpretationId}
            onComplete={refresh}
            text={comment.text}
            currentUser={currentUser}
        />
    ) : (
        <Message
            id={comment.id}
            text={comment.text}
            created={comment.created}
            username={comment.createdBy.displayName}
        >
            <MessageStatsBar>
                {comment.access.update && (
                    <MessageIconButton
                        iconComponent={IconEdit16}
                        tooltipContent={i18n.t('Edit')}
                        onClick={() => setIsUpdateMode(true)}
                    />
                )}
                {comment.access.delete && (
                    <CommentDeleteButton
                        commentId={comment.id}
                        interpretationId={interpretationId}
                        refresh={refresh}
                    />
                )}
            </MessageStatsBar>
        </Message>
    )
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    interpretationId: PropTypes.string.isRequired,
    refresh: PropTypes.func,
}

export { Comment }
