import {
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_UNIT_INTERVAL,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
    DIMENSION_TYPE_DATA_ELEMENT,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    SingleSelectField,
    SingleSelectOption,
    CircularLoader,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../modules/visualization.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import { sGetUiProgramId, sGetUiInputType } from '../../reducers/ui.js'
import { useProgramDataDimensions } from '../MainSidebar/ProgramDimensionsPanel/useProgramDataDimensions.js'
import classes from './styles/CustomValueModal.module.css'

const NUMERIC_TYPES = [
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_UNIT_INTERVAL,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
]

// Supported input types for the useProgramDataDimensions hook
const SUPPORTED_INPUT_TYPES = [
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
]

const AGGREGATION_MODE_DATA_ITEM_DEFAULT = 'DATA_ITEM_DEFAULT'
const AGGREGATION_MODE_SUM = 'SUM'
const AGGREGATION_MODE_AVERAGE = 'AVERAGE'

const AGGREGATION_MODES = [
    {
        value: AGGREGATION_MODE_DATA_ITEM_DEFAULT,
        label: 'Use data item default',
    },
    { value: AGGREGATION_MODE_SUM, label: 'Sum' },
    { value: AGGREGATION_MODE_AVERAGE, label: 'Average' },
]

const CustomValueModal = ({
    onClose,
    onConfirm,
    initialSelection,
    initialAggregationMode = AGGREGATION_MODE_DATA_ITEM_DEFAULT,
}) => {
    const programId = useSelector(sGetUiProgramId)
    const program = useSelector((state) => sGetMetadataById(state, programId))
    const currentInputType = useSelector(sGetUiInputType)

    // Use a supported input type for fetching data elements
    // Fall back to EVENT if current type is not supported (e.g., CUSTOM_VALUE)
    const inputType = SUPPORTED_INPUT_TYPES.includes(currentInputType)
        ? currentInputType
        : OUTPUT_TYPE_EVENT

    // Single selection - store just the selected dimension object
    const [selectedItem, setSelectedItem] = useState(initialSelection || null)
    const [aggregationMode, setAggregationMode] = useState(
        initialAggregationMode || AGGREGATION_MODE_DATA_ITEM_DEFAULT
    )

    // Fetch all data elements for the program
    const { loading, error, dimensions } = useProgramDataDimensions({
        inputType,
        program,
        dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
    })

    // Show loading state for a minimum of 400ms to avoid a flash
    const [showLoading, setShowLoading] = useState(true)
    const minLoadTimerRef = useRef(null)
    useEffect(() => {
        if (loading) {
            setShowLoading(true)
            clearTimeout(minLoadTimerRef.current)
        } else {
            minLoadTimerRef.current = setTimeout(
                () => setShowLoading(false),
                400
            )
        }
        return () => clearTimeout(minLoadTimerRef.current)
    }, [loading])

    // Filter to only numeric data elements
    const numericDimensions = useMemo(() => {
        if (!dimensions) return []
        return dimensions.filter(
            (dim) => dim && NUMERIC_TYPES.includes(dim.valueType)
        )
    }, [dimensions])

    const handleSelect = (dimension) => {
        setSelectedItem(dimension)
    }

    const handleConfirm = () => {
        if (selectedItem) {
            onConfirm({ dataItem: selectedItem, aggregationMode })
        }
    }

    return (
        <Modal onClose={onClose} position="top" large>
            <ModalTitle>{i18n.t('Configure custom value')}</ModalTitle>
            <ModalContent className={classes.modalContent}>
                <p className={classes.description}>
                    {i18n.t(
                        'Choose the numeric data element to show in table cells.'
                    )}
                </p>

                <div className={classes.listContainer}>
                    {showLoading && (
                        <div className={classes.listLoading}>
                            <CircularLoader extrasmall />
                            <span>{i18n.t('Loading data')}</span>
                        </div>
                    )}
                    {!showLoading && error && (
                        <NoticeBox error title={i18n.t('Error loading data')}>
                            {error.message ||
                                i18n.t('Failed to load data elements')}
                        </NoticeBox>
                    )}
                    {!showLoading &&
                        !error &&
                        numericDimensions.length === 0 && (
                            <NoticeBox
                                title={i18n.t('No numeric data elements')}
                            >
                                {i18n.t(
                                    'This program does not have any numeric data elements available.'
                                )}
                            </NoticeBox>
                        )}
                    {!showLoading &&
                        !error &&
                        numericDimensions.map((dimension) => (
                            <SingleSelectOption
                                key={dimension.id}
                                label={dimension.name}
                                value={dimension.id}
                                active={selectedItem?.id === dimension.id}
                                onClick={() => handleSelect(dimension)}
                            />
                        ))}
                </div>

                <div className={classes.aggregationSelect}>
                    <SingleSelectField
                        label={i18n.t('Aggregation')}
                        selected={aggregationMode}
                        onChange={({ selected }) =>
                            setAggregationMode(selected)
                        }
                        dense
                    >
                        {AGGREGATION_MODES.map(({ value, label }) => (
                            <SingleSelectOption
                                key={value}
                                label={i18n.t(label)}
                                value={value}
                            />
                        ))}
                    </SingleSelectField>
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button secondary onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        primary
                        onClick={handleConfirm}
                        disabled={!selectedItem}
                    >
                        {i18n.t('Update')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

CustomValueModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    initialSelection: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        valueType: PropTypes.string,
    }),
    initialAggregationMode: PropTypes.oneOf([
        AGGREGATION_MODE_DATA_ITEM_DEFAULT,
        AGGREGATION_MODE_SUM,
        AGGREGATION_MODE_AVERAGE,
    ]),
}

export default CustomValueModal
