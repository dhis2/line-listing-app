import PropTypes from 'prop-types'
import React from 'react'

const LineListIcon = ({
    style = { paddingRight: '8px', width: 24, height: 24 },
}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={style}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M38 16H10V22H38V16ZM8 14V24H40V14H8Z"
            fill="#4A5768"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M38 11H10V14H38V11ZM8 9V16H40V9H8Z"
            fill="#4A5768"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M38 11H30V38H38V11ZM28 9V40H40V9H28Z"
            fill="#4A5768"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M28 11H20V38H28V11ZM18 9V40H30V9H18Z"
            fill="#4A5768"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M38 24H10V30H38V24ZM8 22V32H40V22H8Z"
            fill="#4A5768"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M38 32H10V38H38V32ZM8 30V40H40V30H8Z"
            fill="#4A5768"
        />
    </svg>
)

LineListIcon.propTypes = {
    style: PropTypes.object,
}

export default LineListIcon
