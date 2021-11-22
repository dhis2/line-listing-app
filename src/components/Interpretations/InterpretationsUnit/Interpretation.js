import i18n from '@dhis2/d2-i18n'
import { Button, IconReply16, IconThumbUp16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    Message,
    MessageStatsBar,
    MessageIconButton,
    useLike,
} from '../common/index.js'

export const Interpretation = ({
    interpretation,
    currentUser,
    onClick,
    refresh,
}) => {
    const { toggleLike, isLikedByCurrentUser, toggleLikeInProgress } = useLike({
        interpretation,
        currentUser,
        onComplete: refresh,
    })

    return (
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
                    onClick={() => onClick(interpretation.id)}
                    count={interpretation.comments.length}
                />
            </MessageStatsBar>
            <Button secondary small onClick={() => onClick(interpretation.id)}>
                {i18n.t('See interpretation')}
            </Button>
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
    refresh: PropTypes.func,
    onClick: PropTypes.func,
}
