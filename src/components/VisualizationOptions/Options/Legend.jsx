import {
    LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
    LEGEND_DISPLAY_STRATEGY_FIXED,
    LEGEND_DISPLAY_STYLE_FILL,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Checkbox, FieldSet, Legend as UiCoreLegend } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { acSetUiOptions } from '../../../actions/ui.js'
import {
    OPTION_LEGEND_DISPLAY_STRATEGY,
    OPTION_LEGEND_DISPLAY_STYLE,
    OPTION_LEGEND_SET,
} from '../../../modules/options.js'
import { sGetUiOptions } from '../../../reducers/ui.js'
import styles from '../styles/VisualizationOptions.module.css'
import LegendDisplayStrategy from './LegendDisplayStrategy.jsx'
import LegendDisplayStyle from './LegendDisplayStyle.jsx'
import ShowLegendKey from './ShowLegendKey.jsx'

const Legend = ({
    legendSet,
    legendDisplayStrategy,
    onChange,
    hideStyleOptions,
}) => {
    const [legendEnabled, setLegendEnabled] = useState(
        !(
            (!legendDisplayStrategy ||
                legendDisplayStrategy === LEGEND_DISPLAY_STRATEGY_FIXED) &&
            !legendSet
        )
    )

    const onCheckboxChange = ({ checked }) => {
        setLegendEnabled(checked)

        if (checked) {
            onChange({
                [OPTION_LEGEND_DISPLAY_STRATEGY]:
                    LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
            })
            onChange({
                [OPTION_LEGEND_DISPLAY_STYLE]: LEGEND_DISPLAY_STYLE_FILL,
            })
        } else {
            onChange({
                [OPTION_LEGEND_DISPLAY_STRATEGY]: undefined,
            })
            onChange({
                [OPTION_LEGEND_SET]: undefined,
            })
            onChange({
                [OPTION_LEGEND_DISPLAY_STYLE]: undefined,
            })
        }
    }

    return (
        <div className={styles.tabSectionOption}>
            <Checkbox
                checked={legendEnabled}
                label={i18n.t('Use a legend for table cell colors')}
                onChange={onCheckboxChange}
                dense
            />
            {legendEnabled ? (
                <div className={styles.tabSectionOptionToggleable}>
                    {!hideStyleOptions ? (
                        <div className={styles.tabSectionOption}>
                            <FieldSet>
                                <UiCoreLegend>
                                    <span
                                        className={cx(
                                            styles.tabSectionTitle,
                                            styles.tabSectionTitleMargin
                                        )}
                                    >
                                        {i18n.t('Legend style')}
                                    </span>
                                </UiCoreLegend>
                                <div className={styles.tabSectionOption}>
                                    <LegendDisplayStyle />
                                </div>
                            </FieldSet>
                        </div>
                    ) : null}
                    <div className={styles.tabSectionOption}>
                        <FieldSet>
                            <UiCoreLegend>
                                <span
                                    className={cx(styles.tabSectionTitle, {
                                        [styles.tabSectionTitleMargin]:
                                            hideStyleOptions,
                                    })}
                                >
                                    {i18n.t('Legend type')}
                                </span>
                            </UiCoreLegend>
                            <div className={styles.tabSectionOption}>
                                <LegendDisplayStrategy />
                            </div>
                        </FieldSet>
                    </div>
                    <div>
                        <ShowLegendKey />
                    </div>
                </div>
            ) : null}
        </div>
    )
}

Legend.propTypes = {
    onChange: PropTypes.func.isRequired,
    hideStyleOptions: PropTypes.bool,
    legendDisplayStrategy: PropTypes.string,
    legendSet: PropTypes.object,
}

const mapStateToProps = (state) => ({
    legendSet: sGetUiOptions(state)[OPTION_LEGEND_SET],
    legendDisplayStrategy: sGetUiOptions(state)[OPTION_LEGEND_DISPLAY_STRATEGY],
})

const mapDispatchToProps = (dispatch) => ({
    onChange: (params) => dispatch(acSetUiOptions(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Legend)
