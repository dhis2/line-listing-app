import PropTypes from 'prop-types'
import React from 'react'
import styles from './ProgramDimensionsFilter.module.css'
import { SingleSelect } from '@dhis2/ui'

const ProgramDimensionsFilter = ({ program }) => {
    console.log(program)
    return (
        <div className={styles.container}>
            <SingleSelect></SingleSelect>
        </div>
    )
}

ProgramDimensionsFilter.propTypes = {
    program: PropTypes.object.isRequired,
}

export { ProgramDimensionsFilter }
