import { useCacheableSection, CacheableSection } from '@dhis2/app-runtime'
import { CenteredContent, CircularLoader, CssVariables, Layer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
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

const CacheableSectionWrapper = ({ id, children, isParentCached }) => {
    const { startRecording, isCached, remove } = useCacheableSection(id)

    useEffect(() => {
        if (isParentCached && !isCached) {
            console.log('LL p: start recording')
            startRecording({ onError: console.error })
        } else if (!isParentCached && isCached) {
            // Synchronize cache state on load or prop update
            // -- a back-up to imperative `removeCachedData`
            console.log('LL p: remove cache')
            remove()
        }

        // NB: Adding `startRecording` to dependencies causes
        // an infinite recording loop as-is (probably need to memoize it)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isParentCached])

    return (
        <CacheableSection id={id} loadingMask={LoadingMask}>
            {children}
        </CacheableSection>
    )
}

CacheableSectionWrapper.propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
    isParentCached: PropTypes.bool,
}

export const AnalyticsPluginWrapper = ({
    onInstallationStatusChange,
    children,
    cacheId,
    isParentCached,
    ...props
}) => {
    useEffect(() => {
        // Get & send PWA installation status now
        getPWAInstallationStatus({
            onStateChange: onInstallationStatusChange,
        }).then(onInstallationStatusChange)
    }, [onInstallationStatusChange])

    return props ? (
        <div
            style={{
                display: 'flex',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <CacheableSectionWrapper
                id={cacheId}
                idParentCached={isParentCached}
            >
                {children(props)}
            </CacheableSectionWrapper>
            <CssVariables colors spacers elevations />
        </div>
    ) : null
}

AnalyticsPluginWrapper.propTypes = {
    cacheId: PropTypes.string,
    children: PropTypes.node,
    isParentCached: PropTypes.bool,
    onInstallationStatusChange: PropTypes.func,
}
