import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ProgramSelect.module.css'

const TypeSelect = ({ types, setSelectedTypeId, selectedType }) => {
    return (
        <div className={styles.rows}>
            <div className={styles.columns}>
                <div className={styles.stretch}>
                    <SingleSelect
                        dense
                        selected={selectedType?.id}
                        onChange={({ selected }) => setSelectedTypeId(selected)}
                        placeholder={i18n.t('Choose a type')}
                        maxHeight="max(60vh, 460px)"
                        dataTest={'type-select'}
                        filterable
                        noMatchText={i18n.t('No types found')}
                    >
                        {types.map(({ id, name }) => (
                            <SingleSelectOption
                                key={id}
                                label={name}
                                value={id}
                            />
                        ))}
                    </SingleSelect>
                </div>
            </div>
        </div>
    )
}

TypeSelect.propTypes = {
    setSelectedTypeId: PropTypes.func.isRequired,
    types: PropTypes.array.isRequired,
    selectedType: PropTypes.object,
}

export { TypeSelect }
