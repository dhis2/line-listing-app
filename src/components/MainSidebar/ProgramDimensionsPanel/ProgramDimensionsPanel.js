import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'

const programsQuery = {
    resource: 'programs',
    params: {
        fields: [
            'id',
            'displayName',
            'enrollmentDateLabel',
            'incidentDateLabel',
            'programType',
        ],
        paging: false,
    },
}

const ProgramDimensionsPanel = ({ visible }) => {
    const { loading, fetching, error, data, refetch } =
        useDataQuery(programsQuery)

    console.log(loading, fetching, error, data, refetch)

    if (!visible) {
        return null
    }
    return <span>ProgramDimensionsPanel</span>
}

ProgramDimensionsPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}

export { ProgramDimensionsPanel }
