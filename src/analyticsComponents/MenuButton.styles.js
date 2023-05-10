import { colors, spacers } from '@dhis2/ui-constants'
import css from 'styled-jsx/css'

export default css`
    button {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        line-height: 14px;
        padding: 0 ${spacers.dp12};
        color: ${colors.grey900};
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        cursor: pointer;
    }

    button:hover:enabled {
        background-color: ${colors.grey200};
    }

    button:disabled {
        color: ${colors.grey400};
        cursor: not-allowed;
    }

    button:focus {
        outline: none;
    }
`
