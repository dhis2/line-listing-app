import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
import { DimensionListItem } from './DimensionListItem.js'
import styles from './DimensionsList.module.css'

const getNoResultsMessage = (searchTerm, programName) => {
    if (searchTerm) {
        return i18n.t("No dimensions found for '{{searchTerm}}'", {
            searchTerm,
        })
    }
    if (programName) {
        return i18n.t('No dimensions found in the {{programName}} program', {
            programName,
        })
    }
    return i18n.t('No dimensions found')
}

const isScrollboxEndVisible = (el) =>
    el.scrollHeight - el.scrollTop - el.clientHeight < 5

const DimensionsList = ({
    loading,
    fetching,
    error,
    dimensions,
    programName,
    searchTerm,
    setIsListEndVisible,
}) => {
    const scrollBoxRef = useRef()

    useEffect(() => {
        if (dimensions && scrollBoxRef.current && !loading && !fetching) {
            setIsListEndVisible(isScrollboxEndVisible(scrollBoxRef.current))
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
            <div className={styles.errorWrap}>
                <NoticeBox error title={i18n.t("Couldn't load dimensions")}>
                    {error?.message ||
                        i18n.t(
                            'There was a problem loading the dimensions. Try again, or contact your system administrator.'
                        )}
                </NoticeBox>
            </div>
        )
    }

    if (!dimensions?.length) {
        return (
            <div className={styles.noResults}>
                {getNoResultsMessage(searchTerm, programName)}
            </div>
        )
    }

    return (
        <div
            className={styles.scrollbox}
            onScroll={(event) =>
                setIsListEndVisible(isScrollboxEndVisible(event.target))
            }
            ref={scrollBoxRef}
        >
            <div className={styles.list}>
                {dimensions.map((dimension) => (
                    <DimensionListItem
                        key={dimension.id}
                        dimensionType={dimension.dimensionType}
                        name={dimension.name}
                        id={dimension.id}
                        optionSet={dimension.optionSet}
                        valueType={dimension.valueType}
                    />
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

DimensionsList.propTypes = {
    setIsListEndVisible: PropTypes.func.isRequired,
    dimensions: PropTypes.array,
    error: PropTypes.object,
    fetching: PropTypes.bool,
    loading: PropTypes.bool,
    programName: PropTypes.string,
    searchTerm: PropTypes.string,
}

export { DimensionsList }
