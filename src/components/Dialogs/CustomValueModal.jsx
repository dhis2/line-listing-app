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
    Radio,
    CircularLoader,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'
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

const CustomValueModal = ({ onClose, onConfirm, initialSelection }) => {
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

    // Fetch all data elements for the program
    const { loading, error, dimensions } = useProgramDataDimensions({
        inputType,
        program,
        dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
    })

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
            console.log('Selected custom value data element:', selectedItem)
            onConfirm(selectedItem)
        }
    }

    return (
        <Modal onClose={onClose} position="top" large>
            <ModalTitle>
                {i18n.t('Select Custom Value Data Element')}
            </ModalTitle>
            <ModalContent className={classes.modalContent}>
                <p className={classes.description}>
                    {i18n.t(
                        'Select a numeric data element to use as the custom value for your table.'
                    )}
                </p>

                {loading && (
                    <div className={classes.loadingContainer}>
                        <CircularLoader small />
                        <span>{i18n.t('Loading data elements...')}</span>
                    </div>
                )}

                {error && (
                    <NoticeBox error title={i18n.t('Error loading data')}>
                        {error.message ||
                            i18n.t('Failed to load data elements')}
                    </NoticeBox>
                )}

                {!loading && !error && numericDimensions.length === 0 && (
                    <NoticeBox title={i18n.t('No numeric data elements')}>
                        {i18n.t(
                            'This program does not have any numeric data elements available.'
                        )}
                    </NoticeBox>
                )}

                {!loading && !error && numericDimensions.length > 0 && (
                    <div className={classes.listContainer}>
                        {numericDimensions.map((dimension) => (
                            <div
                                key={dimension.id}
                                className={`${classes.listItem} ${
                                    selectedItem?.id === dimension.id
                                        ? classes.listItemSelected
                                        : ''
                                }`}
                                onClick={() => handleSelect(dimension)}
                            >
                                <Radio
                                    checked={selectedItem?.id === dimension.id}
                                    onChange={() => handleSelect(dimension)}
                                    label={dimension.name}
                                    name="customValueSelection"
                                    value={dimension.id}
                                />
                                <span className={classes.valueType}>
                                    {dimension.valueType}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
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
                        {i18n.t('Apply')}
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
}

export default CustomValueModal
