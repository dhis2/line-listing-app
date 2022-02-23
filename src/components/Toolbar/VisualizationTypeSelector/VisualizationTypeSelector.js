import {
    visTypeDisplayNames,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    Card,
    Popper,
    Layer,
    Tooltip,
    IconVisualizationLinelist16,
    IconVisualizationPivotTable16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, createRef } from 'react'
import { connect } from 'react-redux'
import ArrowDown from '../../../assets/ArrowDown.js'
import {
    visTypes,
    visTypeDescriptions,
} from '../../../modules/visualization.js'
import { sGetUiType } from '../../../reducers/ui.js'
import classes from './styles/VisualizationTypeSelector.module.css'
import VisualizationTypeListItem from './VisualizationTypeListItem.js'

const VisualizationTypeSelector = ({ visualizationType }) => {
    const [listIsOpen, setListIsOpen] = useState(false)

    const handleListItemClick = () => () => {
        // TODO add set UI when PT is available
        setListIsOpen(false)
    }

    const renderVisualizationTypeListItem = ({ type, disabled }) => {
        return (
            <VisualizationTypeListItem
                key={type}
                visType={type}
                label={visTypeDisplayNames[type]}
                description={visTypeDescriptions[type]}
                isSelected={type === visualizationType}
                onClick={!disabled ? handleListItemClick(type) : null}
                disabled={disabled}
            />
        )
    }

    const VisTypesList = (
        <Card dataTest={'visualization-type-selector-card'}>
            <div className={classes.listContainer}>
                <div className={classes.listSection}>
                    {visTypes.map(({ type, disabled }) =>
                        disabled ? (
                            <Tooltip
                                key={`${type}-tooltip`}
                                placement="bottom"
                                content={i18n.t(
                                    'Not supported by this app yet'
                                )}
                            >
                                {renderVisualizationTypeListItem({
                                    type,
                                    disabled,
                                })}
                            </Tooltip>
                        ) : (
                            renderVisualizationTypeListItem({ type })
                        )
                    )}
                </div>
            </div>
        </Card>
    )

    const buttonRef = createRef()

    return (
        <div className={classes.container}>
            <div
                onClick={() => setListIsOpen(true)}
                ref={buttonRef}
                className={classes.button}
                data-test={'visualization-type-selector-button'}
            >
                {visualizationType === VIS_TYPE_LINE_LIST && (
                    <IconVisualizationLinelist16 color="#4a5768" />
                )}
                {visualizationType === VIS_TYPE_PIVOT_TABLE && (
                    <IconVisualizationPivotTable16 color="#4a5768" />
                )}
                <span data-test="visualization-type-selector-currently-selected-text">
                    {visTypeDisplayNames[visualizationType]}
                </span>
                <span className={classes.arrowIcon}>
                    <ArrowDown />
                </span>
            </div>
            {listIsOpen && (
                <Layer onClick={() => setListIsOpen(false)}>
                    <Popper reference={buttonRef} placement="bottom-start">
                        <div className={classes.cardContainer}>
                            {VisTypesList}
                        </div>
                    </Popper>
                </Layer>
            )}
        </div>
    )
}

VisualizationTypeSelector.propTypes = {
    visualizationType: PropTypes.oneOf(visTypes.map(({ type }) => type)),
}

const mapStateToProps = (state) => ({
    visualizationType: sGetUiType(state),
})

export default connect(mapStateToProps)(VisualizationTypeSelector)
