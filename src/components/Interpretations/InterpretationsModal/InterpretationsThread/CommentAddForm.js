import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import {
    RichTextEditor,
    MessageEditorContainer,
    MessageButtonStrip,
    MessageInput,
} from '../../common/index.js'
import styles from './styles/CommentAddForm.module.css'

export const CommentAddForm = ({
    interpretationId,
    currentUser,
    onSave,
    focusRef,
}) => {
    const [isActive, setIsActive] = useState(false)
    const [commentText, setCommentText] = useState('')

    const saveMutationRef = useRef({
        resource: `interpretations/${interpretationId}/comments`,
        type: 'create',
        data: ({ commentText }) => commentText,
    })

    const [save, { loading }] = useDataMutation(saveMutationRef.current, {
        onComplete: () => {
            setIsActive(false)
            setCommentText('')
            onSave()
        },
    })

    const inputPlaceholder = i18n.t('Add a comment')

    return (
        <MessageEditorContainer currentUser={currentUser}>
            {isActive ? (
                <div className={styles.input}>
                    <RichTextEditor
                        inputPlaceholder={inputPlaceholder}
                        onChange={setCommentText}
                        value={commentText}
                        ref={focusRef}
                        disabled={loading}
                    />
                    <MessageButtonStrip>
                        <Button
                            primary
                            small
                            onClick={() => save({ commentText })}
                            loading={loading}
                        >
                            {i18n.t('Save comment')}
                        </Button>
                        <Button
                            secondary
                            small
                            disabled={loading}
                            onClick={() => {
                                setCommentText('')
                                setIsActive(false)
                            }}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </MessageButtonStrip>
                </div>
            ) : (
                <MessageInput
                    onFocus={() => setIsActive(true)}
                    placeholder={inputPlaceholder}
                    ref={focusRef}
                />
            )}
        </MessageEditorContainer>
    )
}

CommentAddForm.propTypes = {
    currentUser: PropTypes.object.isRequired,
    focusRef: PropTypes.object.isRequired,
    interpretationId: PropTypes.string.isRequired,
    onSave: PropTypes.func,
}
