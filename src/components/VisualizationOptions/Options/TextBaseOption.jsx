import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetUiOptions } from '../../../actions/ui.js'
import { sGetUiOptions } from '../../../reducers/ui.js'
import styles from '../styles/VisualizationOptions.module.css'

const TextBaseOption = ({
    type,
    label,
    placeholder,
    width,
    option,
    value,
    onChange,
    disabled,
    dataTest,
}) => (
    <div className={styles.tabSectionOption}>
        <InputField
            type={type}
            label={label}
            onChange={({ value }) => onChange(value)}
            name={option.name}
            value={value}
            placeholder={placeholder}
            inputWidth={width}
            dense
            disabled={disabled}
            dataTest={`${dataTest}-input`}
        />
    </div>
)

TextBaseOption.defaultProps = {
    option: {},
}

TextBaseOption.propTypes = {
    dataTest: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    option: PropTypes.object,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.string,
    onChange: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
    value: sGetUiOptions(state)[ownProps.option.name],
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    onChange: (value) =>
        dispatch(acSetUiOptions({ [ownProps.option.name]: value })),
})

export default connect(mapStateToProps, mapDispatchToProps)(TextBaseOption)
