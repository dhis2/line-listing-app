import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Input, UserAvatar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { RichTextEditor } from './RichTextEditor/RichTextEditor'
import classes from './styles/InterpretationForm.module.css'

export const InterpretationForm = ({ type, id, currentUser, onSave }) => {
    const [showRichTextEditor, setShowRichTextEditor] = useState(false)
    const [interpretationText, setInterpretationText] = useState('')

    const saveMutationRef = useRef({
        resource: `interpretations/${type}/${id}`,
        type: 'create',
        data: ({ interpretationText }) => interpretationText,
    })

    const [save, { loading: saveMutationInProgress }] = useDataMutation(
        saveMutationRef.current,
        {
            onComplete: () => {
                setShowRichTextEditor(false)
                setInterpretationText('')

                onSave()
            },
        }
    )

    const inputPlaceholder = i18n.t('Write an interpretation')

    return (
        <div className={classes.container}>
            <UserAvatar name={currentUser?.name} medium />
            {showRichTextEditor ? (
                <div className={classes.input}>
                    <RichTextEditor
                        disabled={saveMutationInProgress}
                        inputPlaceholder={inputPlaceholder}
                        onChange={setInterpretationText}
                        value={interpretationText}
                    />
                    <div className={classes.buttonsWrap}>
                        <Button
                            primary
                            small
                            disabled={saveMutationInProgress}
                            onClick={() => save({ interpretationText })}
                        >
                            {i18n.t('Save interpretation')}
                        </Button>
                        <Button
                            secondary
                            small
                            disabled={saveMutationInProgress}
                            onClick={() => {
                                setInterpretationText('')
                                setShowRichTextEditor(false)
                            }}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </div>
                </div>
            ) : (
                <Input
                    onFocus={() => setShowRichTextEditor(true)}
                    placeholder={inputPlaceholder}
                />
            )}
        </div>
    )
}

InterpretationForm.propTypes = {
    currentUser: PropTypes.object,
    id: PropTypes.string,
    type: PropTypes.string,
    onSave: PropTypes.func,
}
