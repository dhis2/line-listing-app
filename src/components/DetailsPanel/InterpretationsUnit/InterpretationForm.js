import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Input, UserAvatar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { RichTextEditor } from './RichTextEditor/RichTextEditor'
import classes from './styles/InterpretationForm.module.css'

export const InterpretationForm = ({ type, id, currentUser, onSave }) => {
    const [showRichTextEditor, setShowRichTextEditor] = useState(false)
    const [interpretationText, setInterpretationText] = useState(null)

    const saveMutationRef = useRef({
        resource: `interpretations/${type}/${id}`,
        type: 'create',
        data: ({ interpretationText }) => interpretationText,
    })

    const [save] = useDataMutation(saveMutationRef.current, {
        onComplete: res => {
            if (res.status === 'OK') {
                setShowRichTextEditor(false)
                setInterpretationText(null)

                onSave()
            }
        },
    })

    const inputPlaceholder = i18n.t('Write an interpretation')

    return (
        <div className={classes.container}>
            <UserAvatar name={currentUser?.name} medium />
            {showRichTextEditor ? (
                <div className={classes.input}>
                    <RichTextEditor
                        inputPlaceholder={inputPlaceholder}
                        onChange={setInterpretationText}
                        value={interpretationText}
                    />
                    <div className={classes.buttonsWrap}>
                        <Button
                            primary
                            small
                            onClick={() => save({ interpretationText })}
                        >
                            {i18n.t('Save interpretation')}
                        </Button>
                        <Button
                            secondary
                            small
                            onClick={() => {
                                setInterpretationText(null)
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
