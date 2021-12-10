import i18n from '@dhis2/d2-i18n'
import { Button, IconReply16, IconThumbUp16, IconEdit16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Message, MessageStatsBar, MessageIconButton } from '../index.js'
import { InterpretationDeleteButton } from './InterpretationDeleteButton.js'
import { InterpretationUpdateForm } from './InterpretationUpdateForm.js'
import { useLike } from './useLike.js'

export const Interpretation = ({
    interpretation,
    currentUser,
    onClick,
    onUpdated,
    onDeleted,
    onReplyIconClick,
}) => {
    const [isUpdateMode, setIsUpdateMode] = useState(false)
    const { toggleLike, isLikedByCurrentUser, toggleLikeInProgress } = useLike({
        interpretation,
        currentUser,
        onComplete: onUpdated,
    })

    return isUpdateMode ? (
        <InterpretationUpdateForm
            close={() => setIsUpdateMode(false)}
            id={interpretation.id}
            onComplete={onUpdated}
            text={interpretation.text}
            currentUser={currentUser}
        />
    ) : (
        <Message
            text={interpretation.text}
            created={interpretation.created}
            id={interpretation.id}
            username={interpretation.user.displayName}
            onClick={onClick}
        >
            <MessageStatsBar>
                <MessageIconButton
                    tooltipContent={
                        isLikedByCurrentUser ? i18n.t('Unlike') : i18n.t('Like')
                    }
                    iconComponent={IconThumbUp16}
                    onClick={toggleLike}
                    selected={isLikedByCurrentUser}
                    count={interpretation.likes}
                    disabled={toggleLikeInProgress}
                />
                <MessageIconButton
                    tooltipContent={i18n.t('Reply')}
                    iconComponent={IconReply16}
                    onClick={() => onReplyIconClick(interpretation.id)}
                    count={interpretation.comments.length}
                />
                {interpretation.access.update && (
                    <MessageIconButton
                        iconComponent={IconEdit16}
                        tooltipContent={i18n.t('Edit')}
                        onClick={() => setIsUpdateMode(true)}
                    />
                )}
                {interpretation.access.delete && (
                    <InterpretationDeleteButton
                        id={interpretation.id}
                        onComplete={onDeleted}
                    />
                )}
            </MessageStatsBar>
            {!!onClick && (
                <Button
                    secondary
                    small
                    onClick={(_, event) => {
                        event.stopPropagation()
                        onClick(interpretation.id)
                    }}
                >
                    {i18n.t('See interpretation')}
                </Button>
            )}
        </Message>
    )
}

Interpretation.propTypes = {
    currentUser: PropTypes.object.isRequired,
    interpretation: PropTypes.object.isRequired,
    onDeleted: PropTypes.func.isRequired,
    onReplyIconClick: PropTypes.func.isRequired,
    onUpdated: PropTypes.func.isRequired,
    onClick: PropTypes.func,
}
