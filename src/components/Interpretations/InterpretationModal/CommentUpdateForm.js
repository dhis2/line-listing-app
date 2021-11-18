import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import {
    MessageEditorContainer,
    RichTextEditor,
    MessageButtonStrip,
} from '../common/index.js'
import styles from './styles/CommentUpdateForm.module.css'

export const CommentUpdateForm = ({
    interpretationId,
    commentId,
    currentUser,
    text,
    close,
    onComplete,
}) => {
    const [interpretationText, setInterpretationText] = useState(text || '')
    const updateMutationRef = useRef({
        resource: `interpretations/${interpretationId}/comments/${commentId}`,
        type: 'update',
        partial: false,
        data: ({ interpretationText }) => interpretationText,
    })
    const [update, { loading, error }] = useDataMutation(
        updateMutationRef.current,
        {
            onComplete: () => {
                console.log('onComplete')
                onComplete()
                close()
            },
        }
    )
    const errorText = error
        ? error.message || i18n.t('Could not update comment')
        : ''

    return (
        <div className={styles.message}>
            <MessageEditorContainer currentUser={currentUser}>
                <RichTextEditor
                    inputPlaceholder={i18n.t('Enter comment text')}
                    onChange={setInterpretationText}
                    value={interpretationText}
                    disabled={loading}
                    errorText={errorText}
                />
                <MessageButtonStrip>
                    <Button
                        loading={loading}
                        primary
                        small
                        onClick={() => update({ interpretationText })}
                    >
                        {i18n.t('Update')}
                    </Button>
                    <Button disabled={loading} secondary small onClick={close}>
                        {i18n.t('Cancel')}
                    </Button>
                </MessageButtonStrip>
            </MessageEditorContainer>
        </div>
    )
}
CommentUpdateForm.propTypes = {
    close: PropTypes.func.isRequired,
    commentId: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    interpretationId: PropTypes.string.isRequired,
    onComplete: PropTypes.func.isRequired,
    text: PropTypes.string,
}
