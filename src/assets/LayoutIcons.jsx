import PropTypes from 'prop-types'
import React from 'react'

const STYLE_DEFAULT = { width: 16, height: 16 }

export const IconExpand = ({ style = STYLE_DEFAULT }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        style={style}
        fill="currentColor"
    >
        <path d="M5.14 3.808 7.53 1.51a.67.67 0 0 1 .942 0l2.389 2.298c.26.256.685.256.944 0a.65.65 0 0 0 0-.93L9.416.578a2.02 2.02 0 0 0-2.832 0l-2.388 2.3a.65.65 0 0 0 0 .93c.26.256.683.256.944 0zm0 8.384 2.39 2.298a.67.67 0 0 0 .942 0l2.389-2.298a.677.677 0 0 1 .944 0 .65.65 0 0 1 0 .93l-2.388 2.3a2.02 2.02 0 0 1-2.832 0l-2.388-2.3a.65.65 0 0 1 0-.93.677.677 0 0 1 .944 0zM16 6H0v4h16V6zM1 9V7h14v2H1z" />
    </svg>
)

IconExpand.propTypes = {
    style: PropTypes.object,
}

export const IconCollapse = ({ style = STYLE_DEFAULT }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        style={style}
        fill="currentColor"
    >
        <path d="M5.14.192 7.53 2.49a.67.67 0 0 0 .942 0L10.86.192a.677.677 0 0 1 .944 0 .65.65 0 0 1 0 .93l-2.388 2.3a2.02 2.02 0 0 1-2.832 0l-2.388-2.3a.65.65 0 0 1 0-.93.677.677 0 0 1 .944 0zm0 15.616 2.39-2.298a.67.67 0 0 1 .942 0l2.389 2.298c.26.256.685.256.944 0a.65.65 0 0 0 0-.93l-2.388-2.3a2.02 2.02 0 0 0-2.832 0l-2.388 2.3a.65.65 0 0 0 0 .93c.26.256.683.256.944 0zM16 6H0v4h16V6zM1 9V7h14v2H1z" />
    </svg>
)

IconCollapse.propTypes = {
    style: PropTypes.object,
}
