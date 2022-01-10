import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ProgramSelect.module.css'

const ProgramSelect = ({
    programs,
    setSelectedProgramId,
    selectedProgramId,
}) => {
    console.log(selectedProgramId)
    return (
        <div className={styles.container}>
            <div className={styles.stretch}>
                <SingleSelect
                    selected={selectedProgramId}
                    disabled={!!selectedProgramId}
                    onChange={({ selected }) => setSelectedProgramId(selected)}
                    placeholder={i18n.t('Choose a program')}
                >
                    {programs.map(({ id, displayName }) => (
                        <SingleSelectOption
                            key={id}
                            label={displayName}
                            value={id}
                        />
                    ))}
                </SingleSelect>
            </div>
            <Button onClick={() => setSelectedProgramId(null)}>
                {i18n.t('Clear')}
            </Button>
        </div>
    )
}

ProgramSelect.propTypes = {
    programs: PropTypes.array.isRequired,
    selectedProgramId: PropTypes.string.isRequired,
    setSelectedProgramId: PropTypes.func.isRequired,
}

export { ProgramSelect }
