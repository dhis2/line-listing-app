import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption, Button, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ProgramSelect.module.css'

const ProgramSelect = ({
    programs,
    setSelectedProgramId,
    selectedProgramId,
}) => {
    const select = (
        <SingleSelect
            dense
            selected={selectedProgramId}
            disabled={!!selectedProgramId}
            onChange={({ selected }) => setSelectedProgramId(selected)}
            placeholder={i18n.t('Choose a program')}
        >
            {programs.map(({ id, displayName }) => (
                <SingleSelectOption key={id} label={displayName} value={id} />
            ))}
        </SingleSelect>
    )

    return (
        <div className={styles.container}>
            <div className={styles.stretch}>
                {!selectedProgramId ? (
                    select
                ) : (
                    <Tooltip
                        content={i18n.t(
                            'Clear program first to choose another'
                        )}
                    >
                        {select}
                    </Tooltip>
                )}
            </div>
            <Button
                className={cx({ [styles.hidden]: !selectedProgramId })}
                onClick={() => setSelectedProgramId(undefined)}
            >
                {i18n.t('Clear')}
            </Button>
        </div>
    )
}

ProgramSelect.propTypes = {
    programs: PropTypes.array.isRequired,
    setSelectedProgramId: PropTypes.func.isRequired,
    selectedProgramId: PropTypes.string,
}

export { ProgramSelect }
