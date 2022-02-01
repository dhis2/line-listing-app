import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetUiOptions } from '../../../actions/ui.js'
import { sGetUiOptions } from '../../../reducers/ui.js'
import styles from '../styles/VisualizationOptions.module.css'

const SelectBaseOption = ({ option, label, value, onChange, dataTest }) => {
    const selected = option.items.find((item) => item.value === value)?.value

    return (
        <div className={styles.tabSectionOption}>
            <SingleSelectField
                name={`${option.name}-select`}
                label={label}
                onChange={({ selected }) => onChange(selected)}
                selected={selected}
                inputWidth="280px"
                dense
                dataTest={`${dataTest}-select`}
            >
                {option.items.map(({ value, label }) => (
                    <SingleSelectOption
                        key={value}
                        value={value}
                        label={label}
                        dataTest={`${dataTest}-option`}
                    />
                ))}
            </SingleSelectField>
        </div>
    )
}

SelectBaseOption.propTypes = {
    option: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    label: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => ({
    value: sGetUiOptions(state)[ownProps.option.name],
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    onChange: (value) =>
        dispatch(acSetUiOptions({ [ownProps.option.name]: value })),
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectBaseOption)
