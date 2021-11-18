import i18n from '@dhis2/d2-i18n'
import { IconReply16, IconThumbUp16 } from '@dhis2/ui'
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
    refresh,
    reply,
}) => {
    const { toggleLike, isLikedByCurrentUser } = useLike({
        interpretation,
        currentUser,
        onComplete: refresh,
    })

    return (
        <Message
            text={interpretation.text}
            created={interpretation.created}
            id={interpretation.id}
            username={currentUser.name}
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
                />
                <MessageIconButton
                    tooltipContent={i18n.t('Reply')}
                    iconComponent={IconReply16}
                    onClick={reply}
                    count={interpretation.comments.length}
                />
            </MessageStatsBar>
        </Message>
    )
}

Interpretation.defaultProps = {
    refresh: Function.prototype,
}

Interpretation.propTypes = {
    currentUser: PropTypes.object.isRequired,
    interpretation: PropTypes.object.isRequired,
    reply: PropTypes.func.isRequired,
    refresh: PropTypes.func,
}
