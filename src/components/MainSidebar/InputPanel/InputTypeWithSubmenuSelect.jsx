import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconChevronDown16, IconChevronRight16, IconArrowRight16 } from '@dhis2/ui'
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
        description: i18n.t(
            'See individual event data from a Tracker program stage or event program.'
        ),
    },
    {
        value: OUTPUT_TYPE_ENROLLMENT,
        label: i18n.t('Enrollment'),
        description: i18n.t(
            'See data from multiple program stages in a Tracker program.'
        ),
    },
    {
        value: OUTPUT_TYPE_TRACKED_ENTITY,
        label: i18n.t('Tracked entity'),
        description: i18n.t(
            'See individual tracked entities from one or more Tracker programs.'
        ),
        hasSubmenu: true,
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
    const [hoveredItem, setHoveredItem] = useState(null)
    const [showSubmenu, setShowSubmenu] = useState(false)
    const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 })
    const containerRef = useRef(null)
    
    const selectedInput = useSelector(sGetUiInput)?.type
    const selectedTypeId = useSelector(sGetUiEntityTypeId)
    
    const { fetching, error, data, refetch, called } = useDataQuery(trackedEntityTypesQuery, {
        lazy: true,
    })

    const types = data?.programs?.trackedEntityTypes
    const selectedType = useSelector((state) =>
        sGetMetadataById(state, selectedTypeId)
    )

    // Filter options based on server version
    const availableOptions = inputTypeOptions.filter((option) => {
        if (option.value === OUTPUT_TYPE_TRACKED_ENTITY) {
            return `${serverVersion.major}.${serverVersion.minor}.${
                serverVersion.patch || 0
            }` >= '2.41.0'
        }
        return true
    })

    useEffect(() => {
        // Always fetch tracked entity types when component mounts
        if (!called) {
            refetch()
        }
    }, [called, refetch])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
                setShowSubmenu(false)
                setHoveredItem(null)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const setSelectedInput = (inputType) => {
        console.log('setSelectedInput called with:', inputType, 'current:', selectedInput)
        if (selectedInput !== inputType) {
            dispatch(tSetUiInput({ type: inputType }))
            // Clear entity type when switching away from tracked entity
            if (inputType !== OUTPUT_TYPE_TRACKED_ENTITY) {
                dispatch(tSetUiEntityType({ type: null }))
            }
        }
    }

    const setSelectedTypeId = (typeId) => {
        if (typeId !== selectedTypeId) {
            const type = types?.find(({ id }) => id === typeId)
            dispatch(tSetUiEntityType({ type }))
        }
        setIsOpen(false)
        setShowSubmenu(false)
    }

    const getDisplayText = () => {
        if (selectedInput === OUTPUT_TYPE_TRACKED_ENTITY && selectedType) {
            return selectedType.name
        }
        const option = availableOptions.find(opt => opt.value === selectedInput)
        return option?.label || i18n.t('Choose input type')
    }

    const handleItemClick = (option) => {
        console.log('handleItemClick called with:', option.value, 'hasSubmenu:', option.hasSubmenu)
        if (option.hasSubmenu) {
            console.log('Opening submenu for tracked entity')
            console.log('Types data:', types)
            console.log('Fetching:', fetching)
            console.log('Error:', error)
            console.log('Called:', called)
            console.log('Setting showSubmenu to true')
            // Calculate submenu position
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                setSubmenuPosition({
                    top: rect.bottom,
                    left: rect.right + 4
                })
            }
            setShowSubmenu(true)
            setHoveredItem(option.value)
            console.log('After setting state - showSubmenu should be true')
        } else {
            console.log('Setting input type and closing dropdown')
            // Always close dropdown first
            setIsOpen(false)
            setShowSubmenu(false)
            setHoveredItem(null)
            // Then update the input type
            setSelectedInput(option.value)
        }
    }

    const handleSubmenuItemClick = (typeId) => {
        console.log('handleSubmenuItemClick called with:', typeId)
        setSelectedInput(OUTPUT_TYPE_TRACKED_ENTITY)
        setSelectedTypeId(typeId)
        setIsOpen(false)
        setShowSubmenu(false)
        setHoveredItem(null)
    }

    return (
        <div className={styles.container} ref={containerRef}>
            <div 
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                data-test="input-type-select"
            >
                <IconArrowRight16 className={styles.prefixIcon} />
                <span className={styles.triggerText}>{getDisplayText()}</span>
                <IconChevronDown16 className={styles.chevron} />
            </div>
            
            {isOpen && (
                <div className={styles.dropdown}>
                    {availableOptions.map((option) => (
                        <div
                            key={option.value}
                            className={styles.menuItem}
                            onMouseEnter={() => {
                                setHoveredItem(option.value)
                            }}
                            onMouseLeave={() => {
                                if (!option.hasSubmenu) {
                                    setHoveredItem(null)
                                }
                            }}
                        >
                            <div
                                className={styles.menuItemContent}
                                onClick={(e) => {
                                    console.log('Menu item clicked:', option.label)
                                    e.stopPropagation()
                                    handleItemClick(option)
                                }}
                            >
                                <span>{option.label}</span>
                                {option.hasSubmenu && (
                                    <IconChevronRight16 className={styles.submenuChevron} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Submenu rendered outside the main dropdown */}
            {console.log('Submenu render check - isOpen:', isOpen, 'showSubmenu:', showSubmenu, 'hoveredItem:', hoveredItem)}
            {isOpen && showSubmenu && (
                console.log('Submenu should render now!') ||
                <div className={styles.submenu} style={{
                    position: 'fixed',
                    top: `${submenuPosition.top}px`,
                    left: `${submenuPosition.left}px`,
                    zIndex: 99999
                }}>
                    {console.log('Rendering submenu, fetching:', fetching, 'error:', error, 'types:', types)}
                    {fetching ? (
                        <div className={styles.submenuItem}>
                            {i18n.t('Loading...')}
                        </div>
                    ) : error ? (
                        <div className={styles.submenuItem}>
                            {i18n.t('Error loading types')}
                        </div>
                    ) : types && types.length > 0 ? (
                        types.map(({ id, name }) => (
                            <div
                                key={id}
                                className={styles.submenuItem}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleSubmenuItemClick(id)
                                }}
                            >
                                {name}
                            </div>
                        ))
                    ) : (
                        <div className={styles.submenuItem}>
                            {i18n.t('No types available')}
                        </div>
                    )}
                </div>
            )}
        </div>
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
