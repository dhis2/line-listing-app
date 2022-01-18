import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef, useEffect } from 'react'
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
    const scrollBoxRef = useRef()
    const [isListEndVisible, setIsListEndVisible] = useState(false)
    const { dimensions, loading, fetching, error } = useProgramDimensions({
        inputType,
        isListEndVisible,
        programId,
        stageId,
        searchTerm,
        dimensionType,
    })
    const updateIsListEndVisible = () => {
        const el = scrollBoxRef.current
        const isVisible = el.scrollHeight - el.scrollTop - el.clientHeight < 5

        if (isVisible !== isListEndVisible) {
            setIsListEndVisible(isVisible)
        }
    }

    useEffect(() => {
        if (dimensions && scrollBoxRef.current) {
            updateIsListEndVisible()
        }
    }, [dimensions, scrollBoxRef.current])

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
                <NoticeBox error title={i18n.t("Couldn't load dimensions")}>
                    {error?.message ||
                        i18n.t(
                            'There was a problem loading dimensions. Try again, or contact your system administrator.'
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
        <div
            className={styles.scrollbox}
            onScroll={updateIsListEndVisible}
            ref={scrollBoxRef}
        >
            <div>
                {/* TODO: implement item styles and functionality */}
                {dimensions.map(({ id, displayName }) => (
                    <div key={id}>{displayName}</div>
                ))}
                {fetching && (
                    <div className={styles.loadMoreWrap}>
                        <CircularLoader small />
                    </div>
                )}
            </div>
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
