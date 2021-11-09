import i18n from '@dhis2/d2-i18n'
import { Parser as RichTextParser } from '@dhis2/d2-ui-rich-text'
import {
    Button,
    Input,
    TextArea,
    Tooltip,
    IconAt24,
    IconLink24,
    IconTextBold24,
    IconTextItalic24,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import classes from './styles/RichTextEditor.module.css'

const Toolbar = ({ onInsertMarkup, onTogglePreview, previewMode }) => (
    <div className={classes.toolbar}>
        {!previewMode ? (
            <div className={classes.actionsWrap}>
                <div className={classes.mainActions}>
                    <Tooltip content={i18n.t('Bold text')}>
                        <Button
                            secondary
                            small
                            icon={<IconTextBold24 color={colors.grey700} />}
                            onClick={() => onInsertMarkup('*bold text*')}
                        />
                    </Tooltip>
                    <Tooltip content={i18n.t('Italic text')}>
                        <Button
                            secondary
                            small
                            icon={<IconTextItalic24 color={colors.grey700} />}
                            onClick={() => onInsertMarkup('_italic text_')}
                        />
                    </Tooltip>
                    <Tooltip content={i18n.t('Link to a URL')}>
                        <Button
                            secondary
                            small
                            icon={<IconLink24 color={colors.grey700} />}
                            onClick={() => onInsertMarkup('http://<link-url>')}
                        />
                    </Tooltip>
                    <Tooltip content={i18n.t('Mention a user')}>
                        <Button
                            secondary
                            small
                            icon={<IconAt24 color={colors.grey700} />}
                            onClick={() => onInsertMarkup('@')}
                        />
                    </Tooltip>
                </div>

                <div className={classes.sideActions}>
                    <Button secondary small onClick={onTogglePreview}>
                        {i18n.t('Preview')}
                    </Button>
                </div>
            </div>
        ) : (
            <div className={classes.previewWrap}>
                <Button secondary small onClick={onTogglePreview}>
                    {i18n.t('Back to write mode')}
                </Button>
            </div>
        )}
    </div>
)

export const RichTextEditor = ({
    text,
    inputPlaceholder,
    saveButtonLabel = i18n.t('Save'),
    onSave,
}) => {
    const [hasFocus, setHasFocus] = useState(false)
    const [previewMode, setPreviewMode] = useState(false)
    const [newText, setNewText] = useState(text)

    return hasFocus ? (
        <div className={classes.container}>
            <Toolbar
                onInsertMarkup={markup => {
                    // TODO handle markdown highlights etc...
                    setNewText(newText ? newText + markup : markup)
                }}
                onTogglePreview={() => setPreviewMode(!previewMode)}
                previewMode={previewMode}
            />
            {previewMode ? (
                <div>
                    <RichTextParser>{newText}</RichTextParser>
                </div>
            ) : (
                <>
                    <TextArea
                        initialFocus
                        placeholder={inputPlaceholder}
                        value={newText}
                        onChange={({ value }) => setNewText(value)}
                    />
                    <div className={classes.buttonsWrap}>
                        <Button primary small onClick={() => onSave(newText)}>
                            {saveButtonLabel}
                        </Button>
                        <Button
                            secondary
                            small
                            onClick={() => {
                                setHasFocus(false)
                                setNewText(null)
                            }}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </div>
                </>
            )}
        </div>
    ) : (
        <Input
            onFocus={() => setHasFocus(true)}
            placeholder={inputPlaceholder}
        />
    )
}

RichTextEditor.propTypes = {
    inputPlaceholder: PropTypes.string,
    saveButtonLabel: PropTypes.string,
    text: PropTypes.string,
    onSave: PropTypes.func,
}
