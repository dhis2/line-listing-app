import PropTypes from 'prop-types'
import React from 'react'

export const Main = ({ children }) => (
    <div>
        {children}
        <style jsx>{`
            div {
                flex-grow: 1;
                display: flex;
                align-items: center;
            }
        `}</style>
    </div>
)

Main.propTypes = {
    children: PropTypes.node,
}
