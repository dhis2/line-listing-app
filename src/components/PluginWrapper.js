import React, { useEffect, useRef, useState } from 'react'
//import { Visualization } from './Visualization/Visualization.js'

const PluginWrapper = () => {
    const ref = useRef(null)
    const [propsFromParent, setPropsFromParent] = useState()

    useEffect(() => {
        const pluginWrapper = ref.current

        pluginWrapper.addEventListener('message', (event) => {
            console.log('message received', event)

            // TODO check event.source for security

            setPropsFromParent(event.data)
        })

        window.top.postMessage('getProps')
    }, [])

    return (
        <div ref={ref}>
         {/* propsFromParent && <Visualization {...propsFromParent} /> */}
        {'this is the LL plugin.'}
        {`passed props are: ${Object.keys(propsFromParent)}`}
        </div>
    )
}

export default PluginWrapper
