import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { tSetUiInput } from '../../../actions/ui.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
} from '../../../modules/visualization.js'
import { sGetUiInput } from '../../../reducers/ui.js'
import { InputOption } from './InputOption.js'
import styles from './InputPanel.module.css'

const getLabelForInputType = (type) => {
    switch (type) {
        case OUTPUT_TYPE_EVENT:
            return i18n.t('Event')
        case OUTPUT_TYPE_ENROLLMENT:
            return i18n.t('Enrollment')
        default:
            throw new Error('No input type specified')
    }
}

const InputPanel = ({ visible }) => {
    const selectedInput = useSelector(sGetUiInput)
    const dispatch = useDispatch()

    if (!visible) {
        return null
    }

    const setSelectedInput = (input) => {
        if (selectedInput.type !== input.type) {
            dispatch(tSetUiInput(input))
        }
    }

    return (
        <div className={styles.container}>
            <InputOption
                dataTest="input-event"
                header={getLabelForInputType(OUTPUT_TYPE_EVENT)}
                description={i18n.t(
                    'See individual event data from a Tracker program stage or event program.'
                )}
                onClick={() => setSelectedInput({ type: OUTPUT_TYPE_EVENT })}
                selected={selectedInput.type === OUTPUT_TYPE_EVENT}
            />
            <InputOption
                dataTest="input-enrollment"
                header={getLabelForInputType(OUTPUT_TYPE_ENROLLMENT)}
                description={i18n.t(
                    'See data from multiple program stages in a Tracker program.'
                )}
                onClick={() =>
                    setSelectedInput({ type: OUTPUT_TYPE_ENROLLMENT })
                }
                selected={selectedInput.type === OUTPUT_TYPE_ENROLLMENT}
            />
        </div>
    )
}

InputPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}

export { InputPanel, getLabelForInputType }
