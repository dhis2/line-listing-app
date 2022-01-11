import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, CenteredContent, CircularLoader } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { sGetUiInputType } from '../../../reducers/ui.js'
import { ProgramDimensionsFilter } from './ProgramDimensionsFilter.js'
import styles from './ProgramDimensionsPanel.module.css'
import { ProgramSelect } from './ProgramSelect.js'

const WITHOUT_REGISTRATION = 'WITHOUT_REGISTRATION'
const WITH_REGISTRATION = 'WITH_REGISTRATION'
const PROGRAM_TYPES = {
    [WITHOUT_REGISTRATION]: {
        name: 'EVENT',
        type: WITHOUT_REGISTRATION,
    },
    [WITH_REGISTRATION]: {
        name: 'TRACKER',
        type: WITH_REGISTRATION,
    },
}
const query = {
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
    const inputType = useSelector(sGetUiInputType)
    const [selectedProgramId, setSelectedProgramId] = useState(undefined)
    const { fetching, error, data, refetch, called } = useDataQuery(query, {
        lazy: true,
    })
    const programs = data?.programs.programs
    const selectedProgram =
        programs &&
        selectedProgramId &&
        programs.find(({ id }) => id === selectedProgramId)
    const programType = PROGRAM_TYPES[selectedProgram?.programType]

    console.log(programs, selectedProgram, programType)

    useEffect(() => {
        if (visible && !called) {
            refetch()
        }
    }, [visible, called])

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
        <>
            <div className={cx(styles.section, styles.bordered)}>
                <ProgramSelect
                    programs={data.programs.programs}
                    inputType={inputType}
                    selectedProgramId={selectedProgramId}
                    setSelectedProgramId={setSelectedProgramId}
                />
            </div>
            <div
                className={cx(styles.section, {
                    [styles.bordered]: !!selectedProgramId,
                })}
            >
                {selectedProgramId ? (
                    <ProgramDimensionsFilter
                        program={
                            selectedProgramId &&
                            data.programs.programs.find(
                                ({ id }) => id === selectedProgramId
                            )
                        }
                    />
                ) : (
                    <div className={styles.helptext}>
                        {i18n.t(
                            'Choose a program above to add program dimensions.'
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

ProgramDimensionsPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}

export { ProgramDimensionsPanel }
