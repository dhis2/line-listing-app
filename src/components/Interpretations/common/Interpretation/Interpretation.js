import i18n from '@dhis2/d2-i18n'
import { Button, IconReply16, IconThumbUp16, IconEdit16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    Message,
    MessageStatsBar,
    MessageIconButton,
    useLike,
} from '../index.js'
import { InterpretationDeleteButton } from './InterpretationDeleteButton.js'
import { InterpretationUpdateForm } from './InterpretationUpdateForm.js'

export const Interpretation = ({
    interpretation,
    currentUser,
    reply,
    refresh,
    isModalOpener,
}) => {
    const [isUpdateMode, setIsUpdateMode] = useState(false)
    const { toggleLike, isLikedByCurrentUser, toggleLikeInProgress } = useLike({
        interpretation,
        currentUser,
        onComplete: refresh,
    })

    return isUpdateMode ? (
        <InterpretationUpdateForm
            close={() => setIsUpdateMode(false)}
            id={interpretation.id}
            onComplete={refresh}
            text={interpretation.text}
            currentUser={currentUser}
        />
    ) : (
        <Message
            text={interpretation.text}
            created={interpretation.created}
            id={interpretation.id}
            username={interpretation.user.displayName}
            onClick={isModalOpener ? reply : undefined}
        >
            <MessageStatsBar>
                <MessageIconButton
                    tooltipContent={
                        isLikedByCurrentUser ? i18n.t('Unlike') : i18n.t('Like')
                    }
                    iconComponent={IconThumbUp16}
                    onClick={event => {
                        event.stopPropagation()
                        toggleLike()
                    }}
                    selected={isLikedByCurrentUser}
                    count={interpretation.likes}
                    disabled={toggleLikeInProgress}
                />
                <MessageIconButton
                    tooltipContent={i18n.t('Reply')}
                    iconComponent={IconReply16}
                    onClick={event => {
                        event.stopPropagation()
                        reply(interpretation.id)
                    }}
                    count={interpretation.comments.length}
                />
                {interpretation.access.update && (
                    <MessageIconButton
                        iconComponent={IconEdit16}
                        tooltipContent={i18n.t('Edit')}
                        onClick={event => {
                            event.stopPropagation()
                            setIsUpdateMode(true)
                        }}
                    />
                )}
                {interpretation.access.delete && (
                    <InterpretationDeleteButton
                        id={interpretation.id}
                        refresh={refresh}
                    />
                )}
            </MessageStatsBar>
            {isModalOpener && (
                <Button secondary small onClick={reply}>
                    {i18n.t('See interpretation')}
                </Button>
            )}
        </Message>
    )
}

Interpretation.defaultProps = {
    onClick: Function.prototype,
    refresh: Function.prototype,
}

Interpretation.propTypes = {
    currentUser: PropTypes.object.isRequired,
    interpretation: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
    reply: PropTypes.func.isRequired,
    isModalOpener: PropTypes.bool,
}
