import { RichTextEditor } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Button, spacers, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { MessageEditorContainer, MessageButtonStrip } from '../common/index.js'
import {
    useInterpretationsManager,
    useUpdateCommentForActiveInterpretation,
} from '../InterpretationsProvider/hooks.js'

export const CommentUpdateForm = ({ id, text, onComplete }) => {
    const interpretationsManager = useInterpretationsManager()
    const currentUser = interpretationsManager.getCurrentUser()
    const [commentText, setCommentText] = useState(text || '')
    const [update, { loading, error }] =
        useUpdateCommentForActiveInterpretation({
            id,
            text,
            onComplete,
        })
    const errorText = error ? i18n.t('Could not update comment') : ''

    return (
        <div className="message">
            <MessageEditorContainer currentUserName={currentUser.name}>
                <RichTextEditor
                    inputPlaceholder={i18n.t('Enter comment text')}
                    onChange={setCommentText}
                    value={commentText}
                    disabled={loading}
                    errorText={errorText}
                />
                <MessageButtonStrip>
                    <Button
                        loading={loading}
                        primary
                        small
                        onClick={() => update({ commentText })}
                    >
                        {i18n.t('Update')}
                    </Button>
                    <Button disabled={loading} secondary small onClick={close}>
                        {i18n.t('Cancel')}
                    </Button>
                </MessageButtonStrip>
            </MessageEditorContainer>
            <style jsx>{`
                .message {
                    padding: 0 ${spacers.dp8} ${spacers.dp8};
                    background-color: ${colors.grey100};
                    border-radius: 5px;
                }
            `}</style>
        </div>
    )
}
CommentUpdateForm.propTypes = {
    id: PropTypes.string.isRequired,
    onComplete: PropTypes.func.isRequired,
    text: PropTypes.string,
}
