import i18n from '@dhis2/d2-i18n'
import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from '../styles/Common.module.css'

export const TransferLeftHeader = ({ searchTerm, setSearchTerm, dataTest }) => (
    <div className={classes.transferLeftHeader}>
        <p className={classes.transferLeftTitle}>
            {i18n.t('Available options')}
        </p>
        <InputField
            value={searchTerm}
            onChange={({ value }) => setSearchTerm(value)}
            placeholder={i18n.t('Filter options')}
            dataTest={`${dataTest}-filter-input-field`}
            dense
            initialFocus
            type="search"
        />
    </div>
)

TransferLeftHeader.propTypes = {
    dataTest: PropTypes.string,
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func,
}
