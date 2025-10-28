import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { DimensionItem } from '../DimensionItem/index.js'
import { useSelectedDimensions } from '../SelectedDimensionsContext.jsx'
import styles from './DimensionsList.module.css'

const getNoResultsMessage = ({
    searchTerm,
    programName,
    trackedEntityType,
}) => {
    if (searchTerm) {
        return i18n.t('No results', {
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

const DimensionsList = ({
    loading,
    fetching,
    error,
    dimensions,
    programName,
    searchTerm,
    hasMore,
    onLoadMore,
    dataTest,
    trackedEntityType,
}) => {
    const { getIsDimensionSelected } = useSelectedDimensions()

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
            onMouseDown={(event) => event.preventDefault()}
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
                        className={styles.loadingMoreWrap}
                        data-test="dimensions-list-loading-more"
                    >
                        <CircularLoader extrasmall />
                        <span className={styles.loadMoreText}>
                            {i18n.t('Loading more...')}
                        </span>
                    </div>
                )}
                {!fetching && hasMore && (
                    <div className={styles.loadMoreWrap}>
                        <button
                            small
                            secondary
                            onClick={onLoadMore}
                            dataTest="dimensions-list-load-more-button"
                        >
                            {i18n.t('Load more')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

DimensionsList.propTypes = {
    onLoadMore: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    dimensions: PropTypes.array,
    error: PropTypes.object,
    fetching: PropTypes.bool,
    hasMore: PropTypes.bool,
    loading: PropTypes.bool,
    programName: PropTypes.string,
    searchTerm: PropTypes.string,
    trackedEntityType: PropTypes.string,
}

export { DimensionsList }
