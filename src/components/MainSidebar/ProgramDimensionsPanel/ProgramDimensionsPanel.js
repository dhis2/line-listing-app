import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, CenteredContent, CircularLoader } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { sGetUiInputType } from '../../../reducers/ui.js'
import { INPUT_TYPES } from '../InputPanel/index.js'
import { ProgramDimensionsFilter } from './ProgramDimensionsFilter.js'
import styles from './ProgramDimensionsPanel.module.css'
import { ProgramSelect } from './ProgramSelect.js'

const WITHOUT_REGISTRATION = 'WITHOUT_REGISTRATION'
const WITH_REGISTRATION = 'WITH_REGISTRATION'
const PROGRAM_TYPES = {
    [WITHOUT_REGISTRATION]: {
        name: 'EVENT',
        id: WITHOUT_REGISTRATION,
    },
    [WITH_REGISTRATION]: {
        name: 'TRACKER',
        id: WITH_REGISTRATION,
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
                'programStages[id,displayName]',
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
    const filteredPrograms = data?.programs.programs.filter(
        ({ programType }) =>
            inputType === INPUT_TYPES.EVENT ||
            programType === PROGRAM_TYPES.WITHOUT_REGISTRATION.id
    )
    const selectedProgram =
        filteredPrograms &&
        selectedProgramId &&
        filteredPrograms.find(({ id }) => id === selectedProgramId)
    const programType = PROGRAM_TYPES[selectedProgram?.programType]?.name

    console.log(filteredPrograms, selectedProgram, programType)

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
                    programs={filteredPrograms}
                    selectedProgramId={selectedProgramId}
                    setSelectedProgramId={setSelectedProgramId}
                />
            </div>
            <div
                className={cx(styles.section, {
                    [styles.bordered]: !!selectedProgramId,
                })}
            >
                {selectedProgram ? (
                    <ProgramDimensionsFilter program={selectedProgram} />
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
