import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import classes from '../styles/Common.module.css'

export const TransferSourceEmptyPlaceholder = ({
    loading,
    searchTerm,
    options,
    dataTest,
}) =>
    !loading &&
    !options.length && (
        <p className={classes.transferEmptyList} data-test={dataTest}>
            {searchTerm
                ? i18n.t('Nothing found for "{{- searchTerm}}"', {
                      searchTerm: searchTerm,
                  })
                : i18n.t('No options')}
        </p>
    )

TransferSourceEmptyPlaceholder.propTypes = {
    dataTest: PropTypes.string,
    loading: PropTypes.bool,
    options: PropTypes.array,
    searchTerm: PropTypes.string,
}
