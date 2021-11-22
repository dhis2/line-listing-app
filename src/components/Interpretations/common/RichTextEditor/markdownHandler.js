export const EMOJI_SMILEY_FACE = 'smileyFace'
export const EMOJI_SAD_FACE = 'sadFace'
export const EMOJI_THUMBS_UP = 'thumbsUp'
export const EMOJI_THUMBS_DOWN = 'thumsDown'

export const emojis = {
    [EMOJI_SMILEY_FACE]: ':-)',
    [EMOJI_SAD_FACE]: ':-(',
    [EMOJI_THUMBS_UP]: ':+1',
    [EMOJI_THUMBS_DOWN]: ':-1',
}

const markdownMap = {
    italic: {
        prefix: '_',
        postfix: '_',
    },
    bold: {
        prefix: '*',
        postfix: '*',
    },
    link: {
        prefix: '[',
        postfix: '](https://link-url)',
    },
    mention: {
        prefix: '@',
    },
    [EMOJI_SMILEY_FACE]: {
        prefix: emojis[EMOJI_SMILEY_FACE],
    },
    [EMOJI_SAD_FACE]: {
        prefix: emojis[EMOJI_SAD_FACE],
    },
    [EMOJI_THUMBS_UP]: {
        prefix: emojis[EMOJI_THUMBS_UP],
    },
    [EMOJI_THUMBS_DOWN]: {
        prefix: emojis[EMOJI_THUMBS_DOWN],
    },
}

const trim = str => {
    const leftSpaces = /^\s+/
    const rightSpaces = /\s+$/

    return str.replace(leftSpaces, '').replace(rightSpaces, '')
}

export const insertMarkdown = (markdown, target, cb) => {
    const { selectionStart: start, selectionEnd: end, value } = target
    const marker = markdownMap[markdown] || null
    if (!marker || !cb || start < 0) {
        return
    }

    let newValue
    let caretPos = end + 1

    const padMarkers = text => {
        // is caret between two markers (i.e., "**" or "__")? Then do not add padding
        if (start === end && value.length && start > 0) {
            if (
                (value[start - 1] === markdownMap.bold.prefix &&
                    value[start] === markdownMap.bold.prefix) ||
                (value[start - 1] === markdownMap.italic.prefix &&
                    value[start] === markdownMap.italic.prefix)
            ) {
                return text
            }
        }

        if (value.length && start > 0 && value[start - 1] !== ' ') {
            text = ` ${text}`
            ++caretPos
        }

        if (value.length && end !== value.length && value[end] !== ' ') {
            text = `${text} `
        }

        return text
    }

    if (start === end) {
        //no text
        const valueArr = value.split('')
        let markdown = marker.prefix

        if (marker.postfix) {
            markdown += marker.postfix
        }

        valueArr.splice(start, 0, padMarkers(markdown))
        newValue = valueArr.join('')
    } else {
        const text = value.slice(start, end)
        const trimmedText = trim(text) // TODO really needed?

        // adjust caretPos based on trimmed text selection
        caretPos = caretPos - (text.length - trimmedText.length) + 1

        let markdown = `${marker.prefix}${trimmedText}`

        if (marker.postfix) {
            markdown += marker.postfix
        }

        newValue = [
            value.slice(0, start),
            padMarkers(markdown),
            value.slice(end),
        ].join('')
    }

    cb(newValue, caretPos)
}

export const convertCtrlKey = (event, cb) => {
    const { key, ctrlKey, metaKey } = event

    if (key === 'b' && (ctrlKey || metaKey)) {
        event.preventDefault()
        insertMarkdown('bold', event.target, cb)
    } else if (key === 'i' && (ctrlKey || metaKey)) {
        event.preventDefault()
        insertMarkdown('italic', event.target, cb)
    }
}
