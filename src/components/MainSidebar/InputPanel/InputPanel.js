import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiInput } from '../../../actions/ui.js'
import { sGetUiInput } from '../../../reducers/ui.js'
import { InputOption } from './InputOption.js'
import styles from './InputPanel.module.css'

const INPUT_TYPES = {
    EVENT: 'EVENT',
    ENROLLMENT: 'ENROLLMENT',
}
const getLabelForInputType = (type) => {
    switch (type) {
        case INPUT_TYPES.EVENT:
            return i18n.t('Event')
        case INPUT_TYPES.ENROLLMENT:
            return i18n.t('Enrollment')
        default:
            throw new Error('No input type specified')
    }
}

const InputPanel = () => {
    const selectedInput = useSelector(sGetUiInput)
    const dispatch = useDispatch()
    const setSelectedInput = (input) => dispatch(acSetUiInput(input))

    return (
        <div className={styles.container}>
            <InputOption
                header={getLabelForInputType(INPUT_TYPES.EVENT)}
                description={i18n.t(
                    'Events are single registrations or incidents in a program.'
                )}
                onClick={() => setSelectedInput({ type: INPUT_TYPES.EVENT })}
                selected={selectedInput.type === INPUT_TYPES.EVENT}
            />
            <InputOption
                header={getLabelForInputType(INPUT_TYPES.ENROLLMENT)}
                description={i18n.t('Programs track enrollments across time.')}
                onClick={() =>
                    setSelectedInput({ type: INPUT_TYPES.ENROLLMENT })
                }
                selected={selectedInput.type === INPUT_TYPES.ENROLLMENT}
            />
        </div>
    )
}

export { InputPanel, getLabelForInputType }
