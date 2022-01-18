import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ProgramDimensionsList.module.css'
import { useProgramDimensions } from './useProgramDimensions.js'

const ProgramDimensionsList = ({
    inputType,
    programId,
    programName,
    stageId,
    searchTerm,
    dimensionType,
}) => {
    const { dimensions, loading, error } = useProgramDimensions({
        inputType,
        programId,
        stageId,
        searchTerm,
        dimensionType,
    })

    if (loading) {
        return (
            <div className={styles.loaderWrap}>
                <CircularLoader small />
            </div>
        )
    }
    if (error) {
        return (
            <div className={styles.padded}>
                <NoticeBox error title={i18n.t('Could not load visualization')}>
                    {error?.message ||
                        i18n.t(
                            'The visualization couldn’t be displayed. Try again or contact your system administrator.'
                        )}
                </NoticeBox>
            </div>
        )
    }
    if (dimensions.length === 0) {
        const message = searchTerm
            ? i18n.t("No dimensions found for '{{searchTerm}}'", { searchTerm })
            : i18n.t('No dimensions found in the {{programName}} program', {
                  programName,
              })

        return <div className={styles.noResults}>{message}</div>
    }

    return (
        <div className={styles.container}>
            <ul>
                {/* TODO: implement item styles and functionality */}
                {dimensions.map(({ id, displayName }) => (
                    <li key={id}>{displayName}</li>
                ))}
            </ul>
        </div>
    )
}

ProgramDimensionsList.propTypes = {
    inputType: PropTypes.string.isRequired,
    programId: PropTypes.string.isRequired,
    programName: PropTypes.string.isRequired,
    dimensionType: PropTypes.string,
    searchTerm: PropTypes.string,
    stageId: PropTypes.string,
}

export { ProgramDimensionsList }
