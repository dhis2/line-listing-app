import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    OPTION_DIGIT_GROUP_SEPARATOR,
    SEPARATOR_NONE,
    SEPARATOR_SPACE,
    SEPARATOR_COMMA,
} from '../../../modules/options.js'
import SelectBaseOption from './SelectBaseOption.jsx'

const DigitGroupSeparator = () => (
    <SelectBaseOption
        label={i18n.t('Digit group separator')}
        option={{
            name: OPTION_DIGIT_GROUP_SEPARATOR,
            items: [
                { value: SEPARATOR_NONE, label: i18n.t('None') },
                { value: SEPARATOR_SPACE, label: i18n.t('Space') },
                { value: SEPARATOR_COMMA, label: i18n.t('Comma') },
            ],
        }}
        dataTest="dgs"
    />
)

export default DigitGroupSeparator
