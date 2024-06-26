import { useCacheableSection, CacheableSection } from '@dhis2/app-runtime'
import { CenteredContent, CircularLoader, CssVariables, Layer } from '@dhis2/ui'
import postRobot from '@krakenjs/post-robot'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { Visualization } from './components/Visualization/Visualization.js'
import { getAdaptedUiSorting } from './modules/current.js'
import { getPWAInstallationStatus } from './modules/getPWAInstallationStatus.js'
import './locales/index.js'

const LoadingMask = () => {
    return (
        <Layer>
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        </Layer>
    )
}

const CacheableSectionWrapper = ({
    id,
    children,
    cacheNow,
    isParentCached,
}) => {
    const { startRecording, isCached, remove } = useCacheableSection(id)

    useEffect(() => {
        if (cacheNow) {
            startRecording({ onError: console.error })
        }

        // NB: Adding `startRecording` to dependencies causes
        // an infinite recording loop as-is (probably need to memoize it)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cacheNow])

    useEffect(() => {
        const listener = postRobot.on(
            'removeCachedData',
            // todo: check domain too; differs based on deployment env though
            { window: window.parent },
            () => remove()
        )

        return () => listener.cancel()
    }, [remove])

    useEffect(() => {
        // Synchronize cache state on load or prop update
        // -- a back-up to imperative `removeCachedData`
        if (!isParentCached && isCached) {
            remove()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isParentCached])

    return (
        <CacheableSection id={id} loadingMask={LoadingMask}>
            {children}
        </CacheableSection>
    )
}
CacheableSectionWrapper.propTypes = {
    cacheNow: PropTypes.bool,
    children: PropTypes.node,
    id: PropTypes.string,
    isParentCached: PropTypes.bool,
}

const sendInstallationStatus = (installationStatus) => {
    postRobot.send(window.parent, 'installationStatus', { installationStatus })
}

const PluginWrapper = () => {
    const [propsFromParent, setPropsFromParent] = useState()

    const receivePropsFromParent = (event) => setPropsFromParent(event.data)

    const onDataSorted = useCallback(
        (sorting) => {
            let newSorting = undefined

            if (sorting.direction !== 'default') {
                newSorting = getAdaptedUiSorting(
                    sorting,
                    propsFromParent.visualization
                )
            }

            setPropsFromParent({
                ...propsFromParent,
                visualization: {
                    ...propsFromParent.visualization,
                    sorting: newSorting,
                },
            })
        },
        [propsFromParent]
    )

    useEffect(() => {
        postRobot
            .send(window.parent, 'getProps')
            .then(receivePropsFromParent)
            .catch((err) => console.error(err))

        // Get & send PWA installation status now, and also prepare to send
        // future updates (installing/ready)
        getPWAInstallationStatus({
            onStateChange: sendInstallationStatus,
        }).then(sendInstallationStatus)

        // Allow parent to update props
        const listener = postRobot.on(
            'newProps',
            { window: window.parent /* Todo: check domain */ },
            receivePropsFromParent
        )

        return () => listener.cancel()
    }, [])

    return propsFromParent ? (
        <div
            style={{
                display: 'flex',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <CacheableSectionWrapper
                id={propsFromParent.cacheId}
                cacheNow={propsFromParent.recordOnNextLoad}
                isParentCached={propsFromParent.isParentCached}
            >
                <Visualization
                    {...propsFromParent}
                    onDataSorted={onDataSorted}
                />
            </CacheableSectionWrapper>
            <CssVariables colors spacers elevations />
        </div>
    ) : null
}

export default PluginWrapper
