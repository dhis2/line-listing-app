import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, CenteredContent, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { ProgramSelect } from './ProgramSelect.js'

const programsQuery = {
    programs: {
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
    },
}

const ProgramDimensionsPanel = ({ visible }) => {
    const [selectedProgramId, setSelectedProgramId] = useState(null)
    const { fetching, error, data, refetch, called } = useDataQuery(
        programsQuery,
        {
            lazy: true,
        }
    )

    useEffect(() => {
        if (visible && !data) {
            refetch()
        }
    }, [visible, data])

    if (!visible || !called) {
        return null
    }

    if (error && !fetching) {
        return (
            <NoticeBox error title={i18n.t('Could not load programs')}>
                {error.message ||
                    i18n.t(
                        "The programs couldn't be retrieved. Try again or contact your system administrator."
                    )}
            </NoticeBox>
        )
    }

    if (fetching) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <ProgramSelect
            programs={data?.programs.programs}
            selectedProgramId={selectedProgramId}
            setSelectedProgramId={setSelectedProgramId}
        />
    )
}

ProgramDimensionsPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}

export { ProgramDimensionsPanel }
