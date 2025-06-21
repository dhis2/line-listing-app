import i18n from '@dhis2/d2-i18n'
import React from 'react'
import classes from '../styles/Common.module.css'

export const TransferRightHeader = () => (
    <p className={classes.transferRightHeader}>{i18n.t('Selected options')}</p>
)
