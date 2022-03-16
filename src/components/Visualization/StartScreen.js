import { VisTypeIcon, VIS_TYPE_LINE_LIST } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetLoadError } from '../../actions/loader.js'
import { GenericError } from '../../assets/ErrorIcons.js'
import { EVENT_TYPE } from '../../modules/dataStatistics.js'
import { genericErrorTitle, isVisualizationError } from '../../modules/error.js'
import history from '../../modules/history.js'
import { sGetLoadError } from '../../reducers/loader.js'
import { sGetUsername } from '../../reducers/user.js'
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

const visualizationsQuery = {
    visualizations: {
        resource: 'eventVisualizations',
        params: ({ ids }) => ({
            filter: `id:in:[${ids.join(',')}]`,
            fields: ['id', 'displayName~rename(name)', 'type'],
        }),
    },
}

const useMostViewedVisualizations = (username, error, setLoadError) => {
    const visualizations = useDataQuery(visualizationsQuery, {
        lazy: true,
        onError: (error) => setLoadError(error),
    })

    const mostViewed = useDataQuery(mostViewedQuery, {
        lazy: !!error,
        variables: { username },
        onComplete: (data) => {
            visualizations.refetch({
                ids: data.mostViewed.map((obj) => obj.id),
            })
        },
        onError: (error) => setLoadError(error),
    })

    return {
        mostViewed: visualizations.data
            ? visualizations.data.visualizations.eventVisualizations
            : undefined,
        loading: mostViewed.loading || visualizations.loading,
        fetching: mostViewed.fetching || visualizations.fetching,
        error: mostViewed.error || visualizations.error,
    }
}

const StartScreen = ({ error, username, setLoadError }) => {
    const data = useMostViewedVisualizations(username, error, setLoadError)

    /* TODO remove this when pivot tables are supported */
    const mostViewed = data?.mostViewed?.filter(
        (vis) => vis.type === VIS_TYPE_LINE_LIST
    )

    return (
        <div className={styles.outer}>
            <div className={styles.inner}>
                {error ? (
                    <div
                        className={styles.errorContainer}
                        data-test="start-screen-error-container"
                    >
                        {isVisualizationError(error) ? (
                            <>
                                <div className={styles.errorIcon}>{error.icon()}</div>
                                <p className={styles.errorTitle}>{error.title}</p>
                                <p className={styles.errorDescription}>
                                    {error.description}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className={styles.errorIcon}>{GenericError()}</div>
                                <p className={styles.errorTitle}>{genericErrorTitle}</p>
                                <p className={styles.errorDescription}>
                                    {error.message || error}
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div data-test="start-screen">
                        <div className={styles.section}>
                            <h3
                                className={styles.title}
                                data-test="start-screen-primary-section-title"
                            >
                                {i18n.t('Getting started')}
                            </h3>
                            <ul className={styles.guide}>
                                <li className={styles.guideItem}>
                                    {i18n.t(
                                        'All dimensions that you can use to build visualizations are shown in the sections in the left sidebar.'
                                    )}
                                </li>
                                <li className={styles.guideItem}>
                                    {i18n.t('Add dimensions to the layout above.')}
                                </li>
                                <li className={styles.guideItem}>
                                    {i18n.t(
                                        'Click a dimension to add or remove conditions.'
                                    )}
                                </li>
                            </ul>
                        </div>
                        {/* TODO add a spinner when loading? */}
                        {mostViewed?.length > 0 && (
                            <div className={styles.section}>
                                <h3
                                    className={styles.title}
                                    data-test="start-screen-secondary-section-title"
                                >
                                    {i18n.t('Your most viewed event reports')}
                                </h3>
                                {mostViewed.map((vis, index) => (
                                    <p
                                        key={index}
                                        className={styles.visualization}
                                        onClick={() => history.push(`/${vis.id}`)}
                                        data-test="start-screen-most-viewed-list-item"
                                    >
                                        <span className={styles.visIcon}>
                                            <VisTypeIcon
                                                type={vis.type}
                                                useSmall
                                                color={colors.grey600}
                                            />
                                        </span>
                                        <span>{vis.name}</span>
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

StartScreen.propTypes = {
    error: PropTypes.object,
    setLoadError: PropTypes.func,
    username: PropTypes.string,
}

const mapStateToProps = (state) => ({
    error: sGetLoadError(state),
    username: sGetUsername(state),
})

const mapDispatchToProps = (dispatch) => ({
    setLoadError: (error) => dispatch(acSetLoadError(error)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen)
