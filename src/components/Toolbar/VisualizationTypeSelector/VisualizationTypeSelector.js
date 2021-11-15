import { Card, Popper, Layer, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, createRef } from 'react'
import { connect } from 'react-redux'
import ArrowDown from '../../../assets/ArrowDown'
import { visTypeMap } from '../../../modules/visualization'
import { sGetUi, sGetUiType } from '../../../reducers/ui'
import ListItemIcon from './ListItemIcon'
import classes from './styles/VisualizationTypeSelector.module.css'
import VisualizationTypeListItem from './VisualizationTypeListItem'

export const VisualizationTypeSelector = ({ visualizationType }) => {
    const [listIsOpen, setListIsOpen] = useState(false)

    const handleListItemClick = () => () => {
        // TODO add set UI when PT is available
        setListIsOpen(false)
    }

    const getVisTypes = () => Object.keys(visTypeMap).sort()

    const renderVisualizationTypeListItem = type => {
        const isDisabled = visTypeMap[type].disabled

        return (
            <VisualizationTypeListItem
                key={type}
                visType={type}
                label={visTypeMap[type].name}
                description={visTypeMap[type].description}
                isSelected={type === visualizationType}
                onClick={isDisabled ? null : handleListItemClick(type)}
                disabled={isDisabled}
            />
        )
    }

    const VisTypesList = (
        <Card dataTest={'visualization-type-selector-card'}>
            <div className={classes.listContainer}>
                <div className={classes.listSection}>
                    {getVisTypes().map(type =>
                        visTypeMap[type].disabled ? (
                            <Tooltip
                                key={`${type}-tooltip`}
                                placement="bottom"
                                content={visTypeMap[type].disabledText}
                            >
                                {renderVisualizationTypeListItem(type)}
                            </Tooltip>
                        ) : (
                            renderVisualizationTypeListItem(type)
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
                <ListItemIcon visType={visualizationType} />
                <span data-test="visualization-type-selector-currently-selected-text">
                    {visTypeMap[visualizationType].name}
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
    visualizationType: PropTypes.oneOf(Object.keys(visTypeMap)),
}

const mapStateToProps = state => ({
    visualizationType: sGetUiType(state),
    ui: sGetUi(state),
})

export default connect(mapStateToProps)(VisualizationTypeSelector)
