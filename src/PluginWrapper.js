import { useCacheableSection, CacheableSection } from '@dhis2/app-runtime'
import { CenteredContent, CircularLoader, CssVariables, Layer } from '@dhis2/ui'
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

const PluginWrapper = (props) => {
    const { onInstallationStatusChange, onPropsReceived, ...otherProps } = props
    const [propsFromParent, setPropsFromParent] = useState(otherProps)

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

    useEffect(() => setPropsFromParent(otherProps), [otherProps])

    useEffect(() => {
        // Get & send PWA installation status now
        getPWAInstallationStatus({
            onStateChange: onInstallationStatusChange,
        }).then(onInstallationStatusChange)
    }, [onInstallationStatusChange])

    if (propsFromParent) {
        onPropsReceived()

        return (
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
        )
    } else {
        return null
    }
}

PluginWrapper.propTypes = {
    onInstallationStatusChange: PropTypes.func,
    onPropsReceived: PropTypes.func,
}

export default PluginWrapper
