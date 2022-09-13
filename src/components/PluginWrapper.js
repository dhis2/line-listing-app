import postRobot from '@krakenjs/post-robot'
import React, { useEffect, useState } from 'react'
import { Visualization } from './components/Visualization/Visualization.js'

const PluginWrapper = () => {
    const [propsFromParent, setPropsFromParent] = useState()

    useEffect(() => {
        postRobot.send(window.top, 'getProps')
        .then((event) => setPropsFromParent(event.data))
        .catch((err) => console.error(err))
    }, [])

    return (
        propsFromParent ? (
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <Visualization {...propsFromParent} />
            </div>
        ) : null
    )
}

export default PluginWrapper
