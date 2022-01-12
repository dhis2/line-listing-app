import PropTypes from 'prop-types'
import React from 'react'
import { SingleSelect } from '@dhis2/ui'
import styles from './ProgramDimensionsFilter.module.css'

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
