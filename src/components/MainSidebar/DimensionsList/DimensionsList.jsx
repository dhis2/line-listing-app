import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
import { DimensionItem } from '../DimensionItem/index.js'
import { useSelectedDimensions } from '../SelectedDimensionsContext.jsx'
import styles from './DimensionsList.module.css'

const getNoResultsMessage = ({
    searchTerm,
    programName,
    trackedEntityType,
}) => {
    if (searchTerm) {
        return i18n.t("No results", {
            searchTerm,
        })
    } else if (programName) {
        return i18n.t('No dimensions found in the {{- programName}} program', {
            programName,
        })
    } else if (trackedEntityType) {
        return i18n.t(' {{- trackedEntityType}} has no dimensions', {
            trackedEntityType,
        })
    }
    return i18n.t('No results')
}

const isEndReached = (el) =>
    el.scrollHeight - el.scrollTop - el.clientHeight < 5

const DimensionsList = ({
    loading,
    fetching,
    error,
    dimensions,
    programName,
    searchTerm,
    setIsListEndVisible,
    dataTest,
    trackedEntityType,
}) => {
    const scrollBoxRef = useRef()
    const { getIsDimensionSelected } = useSelectedDimensions()

    useEffect(() => {
        if (dimensions && scrollBoxRef.current && !loading && !fetching) {
            setIsListEndVisible(isEndReached(scrollBoxRef.current))
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

    if (!loading && !fetching && !dimensions?.length) {
        return (
            <div className={styles.noResults}>
                {getNoResultsMessage({
                    searchTerm,
                    programName,
                    trackedEntityType,
                })}
            </div>
        )
    }

    return (
        <div
            data-test={dataTest}
            className={styles.scrollbox}
            onScroll={(event) => {
                return setIsListEndVisible(isEndReached(event.target))
            }}
            onMouseDown={(event) => event.preventDefault()}
            ref={scrollBoxRef}
        >
            <div className={styles.list} data-test={`${dataTest}-list`}>
                {dimensions.map((dimension) => (
                    <DimensionItem
                        key={dimension.id}
                        {...dimension}
                        selected={getIsDimensionSelected(dimension.id)}
                    />
                ))}
                {fetching && (
                    <div
                        className={styles.loadMoreWrap}
                        data-test="dimensions-list-load-more"
                    >
                        <CircularLoader small />
                    </div>
                )}
            </div>
        </div>
    )
}

DimensionsList.propTypes = {
    setIsListEndVisible: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    dimensions: PropTypes.array,
    error: PropTypes.object,
    fetching: PropTypes.bool,
    loading: PropTypes.bool,
    programName: PropTypes.string,
    searchTerm: PropTypes.string,
    trackedEntityType: PropTypes.string,
}

export { DimensionsList }
