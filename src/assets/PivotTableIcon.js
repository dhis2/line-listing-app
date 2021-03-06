import PropTypes from 'prop-types'
import React from 'react'

const PivotTableIcon = ({
    style = { paddingRight: '8px', width: 24, height: 24 },
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        fill="none"
        style={style}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M39 16H10V22H39V16ZM8 14V24H41V14H8Z"
            fill="#4A5768"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M39 11H15V14H39V11ZM13 9V16H41V9H13Z"
            fill="#4A5768"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M39 11H28V38H39V11ZM26 9V40H41V9H26Z"
            fill="#4A5768"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13 16H10V38H13V16ZM8 14V40H15V14H8Z"
            fill="#4A5768"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M39 24H10V30H39V24ZM8 22V32H41V22H8Z"
            fill="#4A5768"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M39 32H10V38H39V32ZM8 30V40H41V30H8Z"
            fill="#4A5768"
        />
    </svg>
)

PivotTableIcon.propTypes = {
    style: PropTypes.object,
}

export default PivotTableIcon
