import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    IconSearch16,
    IconChevronDown16,
    IconArrowRight16,
    FlyoutMenu,
    MenuItem,
    MenuDivider,
    MenuSectionHeader,
    Input,
    Layer,
    Popper,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetUiInput, tSetUiEntityType } from '../../../actions/ui.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { sGetUiInput, sGetUiEntityTypeId } from '../../../reducers/ui.js'
import styles from './InputTypeWithSubmenuSelect.module.css'

const inputTypeOptions = [
    {
        value: OUTPUT_TYPE_EVENT,
        label: i18n.t('Event'),
    },
    {
        value: OUTPUT_TYPE_ENROLLMENT,
        label: i18n.t('Enrollment'),
    },
    {
        value: OUTPUT_TYPE_TRACKED_ENTITY,
        label: i18n.t('Tracked entity'),
    },
]

const trackedEntityTypesQuery = {
    programs: {
        resource: 'trackedEntityTypes',
        params: () => ({
            fields: ['id', 'displayName~rename(name)'],
            paging: false,
            filter: 'access.data.read:eq:true',
        }),
    },
}

const InputTypeWithSubmenuSelect = ({ serverVersion }) => {
    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const buttonRef = useRef(null)

    const selectedInput = useSelector(sGetUiInput)?.type
    const selectedTypeId = useSelector(sGetUiEntityTypeId)

    const { fetching, error, data, refetch, called } = useDataQuery(
        trackedEntityTypesQuery,
        {
            lazy: true,
        }
    )

    const types = data?.programs?.trackedEntityTypes
    const selectedType = useSelector((state) =>
        sGetMetadataById(state, selectedTypeId)
    )

    // Filter options based on server version
    const availableOptions = inputTypeOptions.filter((option) => {
        if (option.value === OUTPUT_TYPE_TRACKED_ENTITY) {
            return (
                `${serverVersion.major}.${serverVersion.minor}.${
                    serverVersion.patch || 0
                }` >= '2.41.0'
            )
        }
        return true
    })

    useEffect(() => {
        // Always fetch tracked entity types when component mounts
        if (!called) {
            refetch()
        }
    }, [called, refetch])

    // Filter tracked entity types based on search term
    const filteredTypes = types?.filter(({ name }) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleInputClick = (inputType) => {
        // Close menu first
        setIsOpen(false)
        setSearchTerm('')

        // Update input type
        if (selectedInput !== inputType) {
            dispatch(tSetUiInput({ type: inputType }))
            // Clear entity type when switching away from tracked entity
            if (inputType !== OUTPUT_TYPE_TRACKED_ENTITY) {
                dispatch(tSetUiEntityType({ type: null }))
            }
        }
    }

    const handleTrackedEntityTypeClick = (typeId) => {
        // Close menu first
        setIsOpen(false)
        setSearchTerm('')

        // Update input type
        const type = types?.find(({ id }) => id === typeId)
        if (type) {
            dispatch(tSetUiInput({ type: OUTPUT_TYPE_TRACKED_ENTITY }))
            dispatch(tSetUiEntityType({ type }))
        }
    }

    const getDisplayText = () => {
        if (selectedInput === OUTPUT_TYPE_TRACKED_ENTITY && selectedType) {
            return selectedType.name
        }
        const option = availableOptions.find(
            (opt) => opt.value === selectedInput
        )
        return option?.label || i18n.t('Choose input type')
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen)
        if (!isOpen) {
            setSearchTerm('')
        }
    }

    const handleBackdropClick = () => {
        setIsOpen(false)
        setSearchTerm('')
    }

    return (
        <>
            <div
                className={styles.trigger}
                ref={buttonRef}
                onClick={toggleMenu}
                data-test="input-type-select"
            >
                <IconArrowRight16 className={styles.prefixIcon} />
                <span className={styles.triggerText}>{getDisplayText()}</span>
                <IconChevronDown16 className={styles.chevron} />
            </div>

            {isOpen && (
                <Layer onBackdropClick={handleBackdropClick}>
                    <Popper
                        reference={buttonRef.current}
                        placement="bottom-start"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <FlyoutMenu dense maxHeight="80vh">
                            {/* Search bar */}
                            <div className={styles.searchContainer}>
                                <Input
                                    value={searchTerm}
                                    onChange={({ value }) =>
                                        setSearchTerm(value)
                                    }
                                    placeholder={i18n.t('Search input types')}
                                    prefixIcon={<IconSearch16 />}
                                    dense
                                    type="search"
                                />
                            </div>

                            <MenuItem
                                label={i18n.t('Events')}
                                onClick={() =>
                                    handleInputClick(OUTPUT_TYPE_EVENT)
                                }
                            />

                            <MenuItem
                                label={i18n.t('Enrollments')}
                                onClick={() =>
                                    handleInputClick(OUTPUT_TYPE_ENROLLMENT)
                                }
                            />

                            <MenuDivider dense />

                            <MenuSectionHeader
                                label={i18n.t('Tracked entity types')}
                                dense
                                hideDivider
                            />

                            {fetching ? (
                                <MenuItem
                                    label={i18n.t('Loading...')}
                                    disabled
                                />
                            ) : error ? (
                                <MenuItem
                                    label={i18n.t('Error loading types')}
                                    disabled
                                />
                            ) : (
                                filteredTypes?.map(({ id, name }) => (
                                    <MenuItem
                                        key={id}
                                        label={name}
                                        onClick={() =>
                                            handleTrackedEntityTypeClick(id)
                                        }
                                    />
                                ))
                            )}
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </>
    )
}

InputTypeWithSubmenuSelect.propTypes = {
    serverVersion: PropTypes.shape({
        major: PropTypes.number.isRequired,
        minor: PropTypes.number.isRequired,
        patch: PropTypes.number,
    }).isRequired,
}

export { InputTypeWithSubmenuSelect }
