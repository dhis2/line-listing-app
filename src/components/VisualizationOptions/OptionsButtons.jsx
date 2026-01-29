import { VisualizationOptions } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { getOptionsByType } from '../../modules/options/config.js'
import UpdateVisualizationContainer from '../UpdateButton/UpdateVisualizationContainer.js'
import styles from './OptionsButtons.module.css'

const OptionsButtons = ({ className, icons = {}, allOptionsIcon }) => {
    const [selectedOptionConfigKey, setSelectedOptionConfigKey] = useState(null)

    const onOptionsUpdate = (handler) => {
        handler()
        setSelectedOptionConfigKey(null)
    }

    const handleButtonClick = (key) => {
        setSelectedOptionConfigKey(key)
    }

    const handleAllOptionsClick = () => {
        // Open with first tab selected
        const optionsConfig = getOptionsByType()
        if (optionsConfig.length > 0) {
            setSelectedOptionConfigKey(optionsConfig[0].key)
        }
    }

    const optionsConfig = getOptionsByType()

    return (
        <div className={`${styles.container} ${className || ''}`}>
            {optionsConfig.map(({ label, key }) => (
                <button
                    key={key}
                    type="button"
                    className={styles.optionButton}
                    onClick={() => handleButtonClick(key)}
                    data-test={`option-button-${key}`}
                    title={label}
                    aria-label={label}
                >
                    {icons[key] && (
                        <span className={styles.icon}>{icons[key]}</span>
                    )}
                </button>
            ))}
            <button
                type="button"
                className={styles.allOptionsButton}
                onClick={handleAllOptionsClick}
                data-test="all-options-button"
            >
                {allOptionsIcon && (
                    <span className={styles.icon}>{allOptionsIcon}</span>
                )}
                <span className={styles.label}>{i18n.t('All options')}</span>
            </button>
            {selectedOptionConfigKey && (
                <UpdateVisualizationContainer
                    renderComponent={(handler) => (
                        <VisualizationOptions
                            optionsConfig={optionsConfig}
                            onUpdate={() => onOptionsUpdate(handler)}
                            onClose={() => setSelectedOptionConfigKey(null)}
                            initiallyActiveTabKey={selectedOptionConfigKey}
                        />
                    )}
                />
            )}
        </div>
    )
}

OptionsButtons.propTypes = {
    className: PropTypes.string,
    icons: PropTypes.objectOf(PropTypes.node),
    allOptionsIcon: PropTypes.node,
}

export default OptionsButtons
