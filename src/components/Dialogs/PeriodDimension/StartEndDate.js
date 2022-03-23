import i18n from '@dhis2/d2-i18n'
import { Field, IconArrowRight16, InputField, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styles from './StartEndDate.module.css'

export const StartEndDate = ({ value, setValue }) => {
    const [startDateStr, endDateStr] = value ? value.split('_') : []
    const [startDate, setStartDate] = useState(startDateStr)
    const [endDate, setEndDate] = useState(endDateStr)

    useEffect(() => {
        setValue(startDate && endDate ? `${startDate}_${endDate}` : '')
    }, [startDate, endDate])

    const onStartDateChange = ({ value }) => {
        setStartDate(value)
    }
    const onEndDateChange = ({ value }) => {
        setEndDate(value)
    }

    return (
        <Field
            helpText={i18n.t(
                'Start and end dates are inclusive and will be included in the outputs.'
            )}
        >
            <div className={styles.row}>
                <InputField
                    value={startDate}
                    type="date"
                    onChange={onStartDateChange}
                    label={i18n.t('Start date')}
                    inputWidth="200px"
                />
                <div className={styles.icon}>
                    <IconArrowRight16 color={colors.grey500} />
                </div>
                <InputField
                    value={endDate}
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
