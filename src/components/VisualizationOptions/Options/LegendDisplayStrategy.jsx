import {
    LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
    LEGEND_DISPLAY_STRATEGY_FIXED,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Radio, Field } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { acSetUiOptions } from '../../../actions/ui.js'
import { OPTION_LEGEND_DISPLAY_STRATEGY } from '../../../modules/options.js'
import { sGetUiOptions } from '../../../reducers/ui.js'
import styles from '../styles/VisualizationOptions.module.css'
import LegendSet from './LegendSet.jsx'

const LegendDisplayStrategy = ({ value, onChange }) => (
    <Fragment>
        <Field name={OPTION_LEGEND_DISPLAY_STRATEGY} dense>
            <Radio
                key={LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM}
                label={i18n.t('Use pre-defined legend per data item')}
                value={LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM}
                checked={value === LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM}
                onChange={onChange}
                dense
                dataTest={`legend-display-strategy-${LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM}`}
            />
            <Radio
                key={LEGEND_DISPLAY_STRATEGY_FIXED}
                label={i18n.t(
                    'Choose a single legend for the entire visualization'
                )}
                value={LEGEND_DISPLAY_STRATEGY_FIXED}
                checked={value === LEGEND_DISPLAY_STRATEGY_FIXED}
                onChange={onChange}
                dense
                dataTest={`legend-display-strategy-${LEGEND_DISPLAY_STRATEGY_FIXED}`}
            />
        </Field>
        {value === LEGEND_DISPLAY_STRATEGY_FIXED ? (
            <div className={styles.tabSectionOptionToggleable}>
                <LegendSet dataTest="fixed-legend-set" />
            </div>
        ) : null}
    </Fragment>
)

LegendDisplayStrategy.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    value: sGetUiOptions(state)[OPTION_LEGEND_DISPLAY_STRATEGY],
})

const mapDispatchToProps = (dispatch) => ({
    onChange: ({ value }) =>
        dispatch(acSetUiOptions({ [OPTION_LEGEND_DISPLAY_STRATEGY]: value })),
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LegendDisplayStrategy)
