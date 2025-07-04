import i18n from '@dhis2/d2-i18n'
import React from 'react'
import classes from '../styles/Common.module.css'

export const TransferEmptySelection = () => (
    <p className={classes.transferEmptyList}>{i18n.t('No items selected')}</p>
)
