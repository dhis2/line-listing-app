import i18n from '@dhis2/d2-i18n'
import { Parser as RichTextParser } from '@dhis2/d2-ui-rich-text'
import {
    Button,
    Popover,
    Tooltip,
    Field,
    IconAt24,
    IconFaceAdd24,
    IconLink24,
    IconTextBold24,
    IconTextItalic24,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useEffect, useState } from 'react'
import {
    convertCtrlKey,
    insertMarkdown,
    emojis,
    EMOJI_SMILEY_FACE,
    EMOJI_SAD_FACE,
    EMOJI_THUMBS_UP,
    EMOJI_THUMBS_DOWN,
} from './markdownHandler'
import {
    mainClasses,
    toolbarClasses,
    emojisPopoverClasses,
} from './styles/RichTextEditor.style.js'

const EmojisPopover = ({ onInsertMarkdown, onClose, reference }) => (
    <Popover reference={reference} onClickOutside={onClose}>
        <ul className="emojisList">
            <li onClick={() => onInsertMarkdown(EMOJI_SMILEY_FACE)}>
                <RichTextParser>{emojis[EMOJI_SMILEY_FACE]}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkdown(EMOJI_SAD_FACE)}>
                <RichTextParser>{emojis[EMOJI_SAD_FACE]}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkdown(EMOJI_THUMBS_UP)}>
                <RichTextParser>{emojis[EMOJI_THUMBS_UP]}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkdown(EMOJI_THUMBS_DOWN)}>
                <RichTextParser>{emojis[EMOJI_THUMBS_DOWN]}</RichTextParser>
            </li>
        </ul>
        <style jsx>{emojisPopoverClasses}</style>
    </Popover>
)

EmojisPopover.propTypes = {
    onClose: PropTypes.func.isRequired,
    onInsertMarkdown: PropTypes.func.isRequired,
    reference: PropTypes.object,
}

const Toolbar = ({
    disabled,
    onInsertMarkdown,
    onTogglePreview,
    previewButtonDisabled,
    previewMode,
}) => {
    const emojisButtonRef = useRef()
    const [emojisPopoverIsOpen, setEmojisPopoverIsOpen] = useState(false)

    const iconColor = disabled ? colors.grey600 : colors.grey700

    return (
        <div className="toolbar">
            {!previewMode ? (
                <div className="actionsWrapper">
                    <div className="mainActions">
                        <Tooltip
                            content={i18n.t('Bold text')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <Button
                                secondary
                                small
                                disabled={disabled}
                                icon={<IconTextBold24 color={iconColor} />}
                                onClick={() => onInsertMarkdown('bold')}
                            />
                        </Tooltip>
                        <Tooltip
                            content={i18n.t('Italic text')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <Button
                                secondary
                                small
                                disabled={disabled}
                                icon={<IconTextItalic24 color={iconColor} />}
                                onClick={() => onInsertMarkdown('italic')}
                            />
                        </Tooltip>
                        <Tooltip
                            content={i18n.t('Link to a URL')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <Button
                                secondary
                                small
                                disabled={disabled}
                                icon={<IconLink24 color={iconColor} />}
                                onClick={() => onInsertMarkdown('link')}
                            />
                        </Tooltip>
                        <Tooltip
                            content={i18n.t('Mention a user')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <Button
                                secondary
                                small
                                disabled={disabled}
                                icon={<IconAt24 color={iconColor} />}
                                onClick={() => onInsertMarkdown('mention')}
                            />
                        </Tooltip>
                        <Tooltip
                            content={i18n.t('Add emoji')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <div ref={emojisButtonRef}>
                                <Button
                                    secondary
                                    small
                                    disabled={disabled}
                                    icon={<IconFaceAdd24 color={iconColor} />}
                                    onClick={() => setEmojisPopoverIsOpen(true)}
                                />
                            </div>
                            {emojisPopoverIsOpen && (
                                <EmojisPopover
                                    onClose={() =>
                                        setEmojisPopoverIsOpen(false)
                                    }
                                    onInsertMarkdown={markup => {
                                        onInsertMarkdown(markup)
                                        setEmojisPopoverIsOpen(false)
                                    }}
                                    reference={emojisButtonRef}
                                />
                            )}
                        </Tooltip>
                    </div>

                    <div className="sideActions">
                        <Button
                            secondary
                            small
                            disabled={previewButtonDisabled || disabled}
                            onClick={onTogglePreview}
                        >
                            {i18n.t('Preview')}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="previewWrapper">
                    <Button
                        secondary
                        small
                        onClick={onTogglePreview}
                        disabled={disabled}
                    >
                        {i18n.t('Back to write mode')}
                    </Button>
                </div>
            )}
            <style jsx>{toolbarClasses}</style>
        </div>
    )
}

Toolbar.propTypes = {
    previewButtonDisabled: PropTypes.bool.isRequired,
    previewMode: PropTypes.bool.isRequired,
    onInsertMarkdown: PropTypes.func.isRequired,
    onTogglePreview: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

export const RichTextEditor = ({
    value,
    disabled,
    inputPlaceholder,
    onChange,
    errorText,
}) => {
    const [previewMode, setPreviewMode] = useState(false)
    const textareaRef = useRef()

    useEffect(() => textareaRef.current.focus(), [textareaRef.current])

    return (
        <div className="container">
            <Toolbar
                onInsertMarkdown={markdown => {
                    insertMarkdown(
                        markdown,
                        textareaRef.current,
                        (text, caretPos) => {
                            onChange(text)
                            textareaRef.current.focus()
                            textareaRef.current.selectionEnd = caretPos
                        }
                    )
                }}
                onTogglePreview={() => setPreviewMode(!previewMode)}
                previewMode={previewMode}
                previewButtonDisabled={!value}
                disabled={disabled}
            />
            {previewMode ? (
                <div className="preview">
                    <RichTextParser>{value}</RichTextParser>
                </div>
            ) : (
                <Field error={!!errorText} validationText={errorText}>
                    <div onKeyDown={event => convertCtrlKey(event, onChange)}>
                        <textarea
                            className="textarea"
                            ref={textareaRef}
                            placeholder={inputPlaceholder}
                            disabled={disabled}
                            value={value}
                            onChange={event => onChange(event.target.value)}
                        />
                    </div>
                </Field>
            )}
            <style jsx>{mainClasses}</style>
        </div>
    )
}

RichTextEditor.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    inputPlaceholder: PropTypes.string,
}
