import i18n from '@dhis2/d2-i18n'
import { Parser as RichTextParser } from '@dhis2/d2-ui-rich-text'
import {
    Button,
    Popover,
    TextArea,
    Tooltip,
    IconAt24,
    IconFaceAdd24,
    IconLink24,
    IconTextBold24,
    IconTextItalic24,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { createRef, useState } from 'react'
import classes from './styles/RichTextEditor.module.css'

const smileyFace = ':-)'
const sadFace = ':-('
const thumbsUp = ':+1'
const thumbsDown = ':-1'

const emoticonsButtonRef = createRef()

const EmoticonsPopover = ({ onInsertMarkup, onClose }) => (
    <Popover reference={emoticonsButtonRef} onClickOutside={onClose}>
        <ul className={classes.emoticonsList}>
            <li onClick={() => onInsertMarkup(smileyFace)}>
                <RichTextParser>{smileyFace}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkup(sadFace)}>
                <RichTextParser>{sadFace}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkup(thumbsUp)}>
                <RichTextParser>{thumbsUp}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkup(thumbsDown)}>
                <RichTextParser>{thumbsDown}</RichTextParser>
            </li>
        </ul>
    </Popover>
)

EmoticonsPopover.propTypes = {
    onClose: PropTypes.func.isRequired,
    onInsertMarkup: PropTypes.func.isRequired,
}

const Toolbar = ({
    onInsertMarkup,
    onTogglePreview,
    previewButtonDisabled,
    previewMode,
}) => {
    const [emoticonsPopoverIsOpen, setEmoticonsPopoverIsOpen] = useState(false)

    return (
        <div className={classes.toolbar}>
            {!previewMode ? (
                <div className={classes.actionsWrap}>
                    <div className={classes.mainActions}>
                        <Tooltip
                            content={i18n.t('Bold text')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <Button
                                secondary
                                small
                                icon={<IconTextBold24 color={colors.grey700} />}
                                onClick={() => onInsertMarkup('*bold text*')}
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
                                icon={
                                    <IconTextItalic24 color={colors.grey700} />
                                }
                                onClick={() => onInsertMarkup('_italic text_')}
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
                                icon={<IconLink24 color={colors.grey700} />}
                                onClick={() =>
                                    onInsertMarkup('http://<link-url>')
                                }
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
                                icon={<IconAt24 color={colors.grey700} />}
                                onClick={() => onInsertMarkup('@')}
                            />
                        </Tooltip>
                        <Tooltip
                            content={i18n.t('Add emoji')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <div
                                ref={emoticonsButtonRef}
                                className={classes.emoticonsButtonWrapper}
                            >
                                <Button
                                    secondary
                                    small
                                    icon={
                                        <IconFaceAdd24 color={colors.grey700} />
                                    }
                                    onClick={() =>
                                        setEmoticonsPopoverIsOpen(true)
                                    }
                                />
                            </div>
                            {emoticonsPopoverIsOpen && (
                                <EmoticonsPopover
                                    onClose={() =>
                                        setEmoticonsPopoverIsOpen(false)
                                    }
                                    onInsertMarkup={markup => {
                                        onInsertMarkup(markup)
                                        setEmoticonsPopoverIsOpen(false)
                                    }}
                                />
                            )}
                        </Tooltip>
                    </div>

                    <div className={classes.sideActions}>
                        <Button
                            secondary
                            small
                            disabled={previewButtonDisabled}
                            onClick={onTogglePreview}
                        >
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
}

Toolbar.propTypes = {
    previewButtonDisabled: PropTypes.bool.isRequired,
    previewMode: PropTypes.bool.isRequired,
    onInsertMarkup: PropTypes.func.isRequired,
    onTogglePreview: PropTypes.func.isRequired,
}

export const RichTextEditor = ({ value, inputPlaceholder, onChange }) => {
    const [previewMode, setPreviewMode] = useState(false)

    return (
        <div className={classes.container}>
            <Toolbar
                onInsertMarkup={markup => {
                    // TODO handle markdown highlights etc...
                    onChange(value ? value + markup : markup)
                }}
                onTogglePreview={() => setPreviewMode(!previewMode)}
                previewMode={previewMode}
                previewButtonDisabled={!value}
            />
            {previewMode ? (
                <div className={classes.preview}>
                    <RichTextParser>{value}</RichTextParser>
                </div>
            ) : (
                <TextArea
                    initialFocus
                    placeholder={inputPlaceholder}
                    value={value}
                    onChange={({ value }) => onChange(value)}
                />
            )}
        </div>
    )
}

RichTextEditor.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    inputPlaceholder: PropTypes.string,
}
