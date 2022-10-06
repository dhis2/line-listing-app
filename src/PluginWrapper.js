import { useCacheableSection, CacheableSection } from '@dhis2/app-runtime'
import { CenteredContent, CircularLoader, Layer } from '@dhis2/ui'
import postRobot from '@krakenjs/post-robot'
import React, { useEffect, useState } from 'react'
import { Visualization } from './components/Visualization/Visualization.js'

const LoadingMask = () => {
    return (
        <Layer>
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        </Layer>
    )
}

// eslint-disable-next-line react/prop-types
const CacheableSectionWrapper = ({ id, children, cacheNow }) => {
    // This doesn't work without PWA enabled -
    // todo: add an error to the app runtime
    const { startRecording } = useCacheableSection(id)

    React.useEffect(() => {
        if (cacheNow) {
            startRecording({ onError: console.error })
        }
    }, [cacheNow])

    return (
        <CacheableSection id={id} loadingMask={LoadingMask}>
            {children}
        </CacheableSection>
    )
}

const PluginWrapper = () => {
    const [propsFromParent, setPropsFromParent] = useState()

    useEffect(() => {
        postRobot
            .send(window.top, 'getProps')
            .then((event) => {
                setPropsFromParent(event.data)
            })
            .catch((err) => console.error(err))
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
                id={propsFromParent.itemId}
                cacheNow={propsFromParent.recordOnNextLoad}
            >
                <Visualization {...propsFromParent} />
            </CacheableSectionWrapper>
        </div>
    ) : null
}

export default PluginWrapper
