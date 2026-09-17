import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    InputField,
    Box,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    CARD_TYPE_TRACKED_ENTITY,
    CARD_TYPE_ENROLLMENT,
    CARD_TYPE_STAGE,
    CARD_TYPE_METADATA,
    CARD_TYPE_PROGRAM_INDICATORS,
    CARD_TYPE_OTHER,
    CARD_TYPE_LABELS,
    DEFAULT_PAGE_SIZES,
    validatePageSize,
} from '../../modules/paginationConfig.js'
import { usePaginationConfig } from '../PaginationConfigContext.jsx'

const PaginationSettingsModal = ({ onClose }) => {
    const { config, updateConfig } = usePaginationConfig()
    const [localConfig, setLocalConfig] = useState({ ...config })

    const cardTypes = [
        CARD_TYPE_TRACKED_ENTITY,
        CARD_TYPE_ENROLLMENT,
        CARD_TYPE_STAGE,
        CARD_TYPE_PROGRAM_INDICATORS,
        CARD_TYPE_METADATA,
        CARD_TYPE_OTHER,
    ]

    const handleChange = (cardType, value) => {
        setLocalConfig((prev) => ({
            ...prev,
            [cardType]: value === '' ? '' : parseInt(value, 10) || 0,
        }))
    }

    const handleSave = () => {
        // Validate all values before saving
        const validatedConfig = {}
        for (const cardType of cardTypes) {
            validatedConfig[cardType] = validatePageSize(localConfig[cardType])
        }
        updateConfig(validatedConfig)
        onClose()
    }

    const handleReset = () => {
        setLocalConfig({ ...DEFAULT_PAGE_SIZES })
    }

    return (
        <Modal onClose={onClose} position="middle" small>
            <ModalTitle>{i18n.t('Pagination Settings (Debug)')}</ModalTitle>
            <ModalContent>
                <p
                    style={{
                        marginBottom: '16px',
                        color: '#6c757d',
                        fontSize: '13px',
                    }}
                >
                    {i18n.t(
                        'Configure how many items are shown per page for each card type. Values must be between 1 and 100.'
                    )}
                </p>
                <Box>
                    {cardTypes.map((cardType) => (
                        <div
                            key={cardType}
                            style={{
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}
                        >
                            <div style={{ flex: 1, minWidth: '180px' }}>
                                <span style={{ fontSize: '14px' }}>
                                    {CARD_TYPE_LABELS[cardType]}
                                </span>
                            </div>
                            <div style={{ width: '80px' }}>
                                <InputField
                                    type="number"
                                    name={cardType}
                                    value={String(localConfig[cardType] ?? '')}
                                    onChange={({ value }) =>
                                        handleChange(cardType, value)
                                    }
                                    min="1"
                                    max="100"
                                    dense
                                    dataTest={`pagination-input-${cardType}`}
                                />
                            </div>
                        </div>
                    ))}
                </Box>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={handleReset} secondary>
                        {i18n.t('Reset to defaults')}
                    </Button>
                    <Button onClick={onClose} secondary>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button onClick={handleSave} primary>
                        {i18n.t('Save')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

PaginationSettingsModal.propTypes = {
    onClose: PropTypes.func.isRequired,
}

export default PaginationSettingsModal

