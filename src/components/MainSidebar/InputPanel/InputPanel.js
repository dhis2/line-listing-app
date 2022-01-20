import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiInput } from '../../../actions/ui.js'
import { sGetUiInput } from '../../../reducers/ui.js'
import { InputOption } from './InputOption.js'
import styles from './InputPanel.module.css'

const INPUT_TYPE_EVENT = 'EVENT'
const INPUT_TYPE_ENROLLMENT = 'ENROLLMENT'

const getLabelForInputType = (type) => {
    switch (type) {
        case INPUT_TYPE_EVENT:
            return i18n.t('Event')
        case INPUT_TYPE_ENROLLMENT:
            return i18n.t('Enrollment')
        default:
            throw new Error('No input type specified')
    }
}

const InputPanel = ({ visible }) => {
    if (!visible) {
        return null
    }

    const selectedInput = useSelector(sGetUiInput)
    const dispatch = useDispatch()
    const setSelectedInput = (input) => dispatch(acSetUiInput(input))

    return (
        <div className={styles.container}>
            <InputOption
                header={getLabelForInputType(INPUT_TYPE_EVENT)}
                description={i18n.t(
                    'Events are single registrations or incidents in a program.'
                )}
                onClick={() => setSelectedInput({ type: INPUT_TYPE_EVENT })}
                selected={selectedInput.type === INPUT_TYPE_EVENT}
            />
            <InputOption
                header={getLabelForInputType(INPUT_TYPE_ENROLLMENT)}
                description={i18n.t('Programs track enrollments across time.')}
                onClick={() =>
                    setSelectedInput({ type: INPUT_TYPE_ENROLLMENT })
                }
                selected={selectedInput.type === INPUT_TYPE_ENROLLMENT}
            />
        </div>
    )
}

InputPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}

export {
    InputPanel,
    getLabelForInputType,
    INPUT_TYPE_EVENT,
    INPUT_TYPE_ENROLLMENT,
}
