import React from 'react'
import Layout from './Layout.jsx'
import classes from './styles/LayoutWithBottomBar.module.css'

const LayoutWithBottomBar = () => {
    const handleButton1Click = () => {
        console.log('Button 1 clicked')
        // Add your button 1 logic here
    }

    const handleButton2Click = () => {
        console.log('Button 2 clicked')
        // Add your button 2 logic here
    }

    const handleButton3Click = () => {
        console.log('Button 3 clicked')
        // Add your button 3 logic here
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.layoutContainer}>
                <Layout />
            </div>
            <div className={classes.bottomBar}>
                <button onClick={handleButton1Click} className={classes.button}>
                    Create Event list
                </button>
                <button onClick={handleButton2Click} className={classes.button}>
                    Create Enrollment list
                </button>
                <button
                    onClick={handleButton3Click}
                    className={classes.button}
                    disabled
                >
                    Create Person list
                </button>
            </div>
        </div>
    )
}

export default LayoutWithBottomBar
