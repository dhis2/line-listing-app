import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { InputOption } from './InputOption.js'
import styles from './InputPanel.module.css'

const INPUT_TYPES = {
    EVENT: 'EVENT',
    ENROLLMENT: 'ENROLLMENT',
}

const InputPanel = ({ selectedInputType, setSelectedInputType }) => (
    <div className={styles.container}>
        <InputOption
            header={i18n.t('Event')}
            description={i18n.t(
                'Events are single registrations or incidents in a program.'
            )}
            onClick={() => setSelectedInputType(INPUT_TYPES.EVENT)}
            selected={selectedInputType === INPUT_TYPES.EVENT}
        />
        <InputOption
            header={i18n.t('Enrollment')}
            description={i18n.t('Programs track enrollments across time.')}
            onClick={() => setSelectedInputType(INPUT_TYPES.ENROLLMENT)}
            selected={selectedInputType === INPUT_TYPES.ENROLLMENT}
        />
    </div>
)

InputPanel.propTypes = {
    selectedInputType: PropTypes.string,
    setSelectedInputType: PropTypes.func,
}

export { InputPanel, INPUT_TYPES }
