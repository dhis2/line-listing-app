import {
    VisTypeIcon,
    useCachedDataQuery,
    VIS_TYPE_LINE_LIST,
} from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { acSetLoadError } from '../../actions/loader.js'
import { GenericError } from '../../assets/ErrorIcons.jsx'
import { EVENT_TYPE } from '../../modules/dataStatistics.js'
import { genericErrorTitle, isVisualizationError } from '../../modules/error.js'
import history from '../../modules/history.js'
import { sGetLoadError } from '../../reducers/loader.js'
import OpenVisualizationDialog from './OpenVisualizationDialog.jsx'
import styles from './styles/StartScreen.module.css'

const mostViewedQuery = {
    mostViewed: {
        resource: 'dataStatistics/favorites',
        params: ({ username }) => ({
            eventType: EVENT_TYPE,
            pageSize: 6,
            ...(username ? { username } : {}),
        }),
    },
}

const useMostViewedVisualizations = (username, error, setLoadError) => {
    const mostViewed = useDataQuery(mostViewedQuery, {
        lazy: !!error,
        variables: { username },
        onError: (error) => setLoadError(error),
    })

    return {
        mostViewed: mostViewed.data?.mostViewed,
        loading: mostViewed.loading,
        fetching: mostViewed.fetching,
        error: mostViewed.error,
    }
}

const StartScreen = ({ error, setLoadError }) => {
    const { currentUser } = useCachedDataQuery()
    const [isOpenDialogVisible, setIsOpenDialogVisible] = useState(false)
    const data = useMostViewedVisualizations(
        currentUser.username,
        error,
        setLoadError
    )

    const handleOpenDialog = () => {
        setIsOpenDialogVisible(true)
    }

    const handleCloseDialog = () => {
        setIsOpenDialogVisible(false)
    }

    return (
        <>
            <OpenVisualizationDialog
                open={isOpenDialogVisible}
                onClose={handleCloseDialog}
                currentUser={currentUser}
            />
            <div className={styles.outer}>
                <div className={styles.inner}>
                    {error ? (
                        <div
                            className={styles.errorContainer}
                            data-test={'error-container'}
                        >
                            {isVisualizationError(error) ? (
                                <>
                                    <div className={styles.errorIcon}>
                                        {error.icon()}
                                    </div>
                                    <p className={styles.errorTitle}>
                                        {error.title}
                                    </p>
                                    <p className={styles.errorDescription}>
                                        {error.description}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className={styles.errorIcon}>
                                        {GenericError()}
                                    </div>
                                    <p className={styles.errorTitle}>
                                        {genericErrorTitle}
                                    </p>
                                    <p className={styles.errorDescription}>
                                        {error.message || error}
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className={styles.startScreenListsWrapper}>
                            <div className={styles.filesWrapper}>
                                <div className={styles.section}>
                                    <h3 className={styles.title}>
                                        {i18n.t('Most viewed')}
                                    </h3>
                                    {data.mostViewed?.map((vis) => (
                                        <p
                                            key={vis.id}
                                            className={styles.visualization}
                                            onClick={() =>
                                                history.push(`/${vis.id}`)
                                            }
                                            data-test={
                                                'start-screen-most-viewed-list-item'
                                            }
                                        >
                                            <span
                                                className={styles.visIcon}
                                            >
                                                <VisTypeIcon
                                                    type={
                                                        VIS_TYPE_LINE_LIST
                                                    }
                                                    useSmall
                                                    color={colors.grey600}
                                                />
                                            </span>
                                            <span>{vis.name}</span>
                                        </p>
                                    ))}
                                    <p
                                        className={styles.browseAll}
                                        onClick={handleOpenDialog}
                                        data-test="start-screen-browse-all"
                                    >
                                        {i18n.t('Browse all...')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

StartScreen.propTypes = {
    error: PropTypes.object,
    setLoadError: PropTypes.func,
}

const mapStateToProps = (state) => ({
    error: sGetLoadError(state),
})

const mapDispatchToProps = (dispatch) => ({
    setLoadError: (error) => dispatch(acSetLoadError(error)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen)
