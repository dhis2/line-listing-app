import i18n from '@dhis2/d2-i18n'
import { Field, IconArrowRight16, InputField, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './StartEndDate.module.css'

export const StartEndDate = ({ value, setValue }) => {
    const [startDateStr, endDateStr] = value ? value.split('_') : []
    const onStartDateChange = ({ value }) => {
        setValue(`${value}_${endDateStr}`)
    }
    const onEndDateChange = ({ value }) => {
        setValue(`${startDateStr}_${value}`)
    }

    return (
        <Field
            helpText={i18n.t(
                'Start and end dates are inclusive and will be included in the outputs.'
            )}
        >
            <div className={styles.row}>
                <InputField
                    value={startDateStr}
                    type="date"
                    onChange={onStartDateChange}
                    label={i18n.t('Start date')}
                    inputWidth="200px"
                />
                <div className={styles.icon}>
                    <IconArrowRight16 color={colors.grey500} />
                </div>
                <InputField
                    value={endDateStr}
                    type="date"
                    onChange={onEndDateChange}
                    label={i18n.t('End date')}
                    inputWidth="200px"
                />
            </div>
        </Field>
    )
}
StartEndDate.propTypes = {
    setValue: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
}
